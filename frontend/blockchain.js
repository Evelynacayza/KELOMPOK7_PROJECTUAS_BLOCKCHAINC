/* ================================================================
   blockchain.js — Koneksi Ethers.js (dipakai di semua halaman)
   ================================================================ */

// Auto-connect MetaMask tanpa popup (jika sudah pernah approve)
async function autoKoneksiWallet() {
  if (!window.ethereum) return false;
  try {
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (accounts.length === 0) return false;

    provider = new ethers.BrowserProvider(window.ethereum);
    signer   = await provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    return true;
  } catch { return false; }
}

// Connect MetaMask dengan popup konfirmasi
async function hubungkanDompet(callbackSukses) {
  if (!window.ethereum) {
    alert("MetaMask belum terinstall! Pasang ekstensi MetaMask terlebih dahulu.");
    return;
  }
  try {
    provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    signer   = await provider.getSigner();
    contract = new ethers.Contract(contractAddress, contractABI, signer);

    const addr = await signer.getAddress();
    Session.setWallet(addr);
    alert("✅ MetaMask Terhubung!\nWallet: " + addr);

    if (callbackSukses) await callbackSukses(addr);
  } catch (err) {
    console.error(err);
    alert("⚠️ Gagal terhubung: " + err.message);
  }
}

// Tarik semua proposal dari blockchain
async function muatRiwayatTender() {
  if (!contract) return [];
  try {
    const data = await contract.getProposals();
    const vendors = data.map(p => ({
      nama:       p.namaPerusahaan,
      harga:      Number(p.penawaranHarga) || 0,
      pengalaman: Number(p.pengalamanTahun) || 0,
      hash:       p.documentHash,
      skor:       Number(p.skor) === 0 ? undefined : Number(p.skor)
    }));
    Session.setVendors(vendors);
    return vendors;
  } catch (err) {
    console.error("Gagal load data:", err);
    return [];
  }
}

// Baca status isBiddingOpen & hasWinner dari kontrak
async function sinkronisasiStatus() {
  if (!contract) return;
  try {
    const buka       = await contract.isBiddingOpen();
    const adaWinner  = await contract.hasWinner();
    const kualLocked  = await contract.kualifikasiLocked();

    if (kualLocked) {
      Session.setKualLocked(true);
      const minExp   = await contract.minExpYears();
      const maxPagu  = await contract.maxPagu();
      const bobotTek = await contract.bobotTeknis();
      Session.setKual({
        minExp:    Number(minExp),
        maxPagu:   Number(maxPagu),
        weightTek: Number(bobotTek)
      });
    }

    if (adaWinner) {
      Session.setStatus('selesai');
      // Ambil detail pemenang LANGSUNG dari blockchain (bukan dari cache lokal)
      // supaya tetap akurat di device/browser manapun yang membuka publik.html.
      try {
        const w = await contract.winner();
        Session.setWinner({ nama: w.namaPerusahaan, skor: Number(w.skor) });
      } catch (e) {
        console.error("Gagal ambil detail pemenang:", e);
      }
    } else if (buka) {
      Session.setStatus('buka');
      Session.setKualLocked(true);
    } else {
      Session.setStatus('tutup');
      Session.setKualLocked(true);
    }
  } catch (err) {
    console.error("Gagal sinkronisasi:", err);
  }
}
