// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract TenderJalanJawa {
    address public admin;
    bool public isBiddingOpen;

    // --- Parameter Kualifikasi (dikunci 1x oleh admin) ---
    bool public kualifikasiLocked;
    uint256 public minExpYears;   // syarat pengalaman minimum (tahun)
    uint256 public maxPagu;       // pagu anggaran maksimum (IDR)
    uint256 public bobotTeknis;   // bobot nilai teknis, dalam persen (0-100)
    uint256 public bobotHarga;    // bobot nilai harga, dalam persen (0-100)

    struct Proposal {
        address vendor;
        string namaPerusahaan;
        uint256 penawaranHarga;
        uint256 pengalamanTahun;
        uint256 skor;
        string documentHash;
        uint256 timestamp;
    }

    Proposal[] public tenderHistory;
    Proposal public winner;
    bool public hasWinner;

    event KualifikasiLocked(uint256 minExp, uint256 maxPagu, uint256 bobotTeknis, uint256 bobotHarga);
    event NewProposal(address indexed vendor, string namaPerusahaan, uint256 penawaranHarga, uint256 pengalamanTahun, uint256 skor, string documentHash, uint256 timestamp);
    event BiddingClosed();
    event WinnerSet(address vendor, string namaPerusahaan, uint256 skor);

    modifier onlyAdmin() {
        require(msg.sender == admin, "Akses Ditolak: Hanya Admin LPSE yang berhak!");
        _;
    }

    modifier biddingActive() {
        require(isBiddingOpen, "Gagal: Masa penawaran tender sudah ditutup!");
        _;
    }

    constructor() {
        admin = msg.sender;
        isBiddingOpen = true;
        hasWinner = false;
    }

    /// @notice Admin mengunci parameter kualifikasi. Hanya bisa dipanggil 1x.
    function lockKualifikasi(
        uint256 _minExpYears,
        uint256 _maxPagu,
        uint256 _bobotTeknis
    ) public onlyAdmin {
        require(!kualifikasiLocked, "Gagal: Kualifikasi sudah dikunci dan tidak bisa diubah!");
        require(_bobotTeknis <= 100, "Bobot teknis maksimal 100%");
        require(_minExpYears > 0, "Syarat pengalaman minimum harus lebih dari 0");
        require(_maxPagu > 0, "Pagu anggaran harus lebih dari 0");

        minExpYears   = _minExpYears;
        maxPagu       = _maxPagu;
        bobotTeknis   = _bobotTeknis;
        bobotHarga    = 100 - _bobotTeknis;
        kualifikasiLocked = true;

        emit KualifikasiLocked(_minExpYears, _maxPagu, _bobotTeknis, bobotHarga);
    }

    /// @notice Vendor mengirim penawaran. Skor DIHITUNG OLEH CONTRACT, bukan dikirim vendor.
    function submitProposal(
        string memory _namaPerusahaan,
        uint256 _penawaranHarga,
        uint256 _pengalamanTahun,
        string memory _documentHash
    ) public biddingActive {
        require(kualifikasiLocked, "Gagal: Admin belum mengunci parameter kualifikasi!");
        require(_pengalamanTahun >= minExpYears, "Gagal: Pengalaman tidak memenuhi syarat minimum!");
        require(_penawaranHarga > 0 && _penawaranHarga <= maxPagu, "Gagal: Harga 0 atau melebihi pagu anggaran!");

        uint256 skorTeknis = (_pengalamanTahun * 100) / minExpYears;
        if (skorTeknis > 100) skorTeknis = 100; // dibatasi maksimal 100 agar adil

        uint256 skorHarga = (maxPagu * 100) / _penawaranHarga;
        if (skorHarga > 100) skorHarga = 100; // dibatasi maksimal 100 agar adil

        uint256 skorAkhir = (skorTeknis * bobotTeknis + skorHarga * bobotHarga) / 100;

        tenderHistory.push(Proposal({
            vendor: msg.sender,
            namaPerusahaan: _namaPerusahaan,
            penawaranHarga: _penawaranHarga,
            pengalamanTahun: _pengalamanTahun,
            skor: skorAkhir,
            documentHash: _documentHash,
            timestamp: block.timestamp
        }));

        emit NewProposal(msg.sender, _namaPerusahaan, _penawaranHarga, _pengalamanTahun, skorAkhir, _documentHash, block.timestamp);
    }

    function closeBidding() public onlyAdmin {
        isBiddingOpen = false;
        emit BiddingClosed();
    }

    function announceWinner() public onlyAdmin {
        require(!isBiddingOpen, "Gagal: Tutup masa lelang terlebih dahulu!");
        require(!hasWinner, "Gagal: Pemenang sudah ditetapkan dan tidak dapat diubah!");
        require(tenderHistory.length > 0, "Gagal: Belum ada proposal yang masuk!");

    // Langkah 1: Cari referensi — pengalaman tertinggi & harga terendah dari semua vendor
        uint256 expTertinggi = 0;
        uint256 hargaTerendah = type(uint256).max;

        for (uint256 i = 0; i < tenderHistory.length; i++) {
            if (tenderHistory[i].pengalamanTahun > expTertinggi)
                expTertinggi = tenderHistory[i].pengalamanTahun;
            if (tenderHistory[i].penawaranHarga < hargaTerendah)
                hargaTerendah = tenderHistory[i].penawaranHarga;
        }

    // Langkah 2: Hitung skor relatif antar vendor & cari yang terbaik
        uint256 bestScore = 0;
        uint256 bestIndex = 0;

        for (uint256 i = 0; i < tenderHistory.length; i++) {
            uint256 st = (tenderHistory[i].pengalamanTahun * 100) / expTertinggi;
            uint256 sh = (hargaTerendah * 100) / tenderHistory[i].penawaranHarga;
            uint256 skorFinal = (st * bobotTeknis + sh * bobotHarga) / 100;

        // Update skor di storage supaya tampil benar di papan publik
            tenderHistory[i].skor = skorFinal;

            if (skorFinal > bestScore) {
                bestScore = skorFinal;
                bestIndex = i;
            }
        }

        winner = tenderHistory[bestIndex];
        hasWinner = true;
        emit WinnerSet(winner.vendor, winner.namaPerusahaan, bestScore);
    }

    function getProposals() public view returns (Proposal[] memory) {
        return tenderHistory;
    }
}