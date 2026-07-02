# TenderJalanJawa 🛣️
### Sistem Tender Infrastruktur Jalan Berbasis Blockchain Ethereum
**Kelompok 7 | Teknologi Blockchain | Institut Teknologi PLN**

---

## Anggota Kelompok 7

| Nama | NIM |
|------|-----|
| *(isi nama)* | *(isi NIM)* |
| *(isi nama)* | *(isi NIM)* |
| *(isi nama)* | *(isi NIM)* |
| *(isi nama)* | *(isi NIM)* |

---

## Struktur Folder

```
TenderJalanJawa/
│
├── frontend/
│   ├── login.html          ← Halaman login & autentikasi
│   ├── admin.html          ← Halaman Pokja Pemilihan (admin)
│   ├── vendor.html         ← Halaman Portal Vendor
│   ├── publik.html         ← Halaman Papan Transparansi Publik
│   │
│   ├── css/
│   │   └── style.css       ← Stylesheet global (dipakai semua halaman)
│   │
│   └── js/
│       ├── config.js       ← Contract address, ABI, akun demo
│       ├── session.js      ← Manajemen state antar halaman (sessionStorage)
│       └── blockchain.js   ← Koneksi MetaMask & fungsi Ethers.js
│
├── smart-contract/
│   └── TenderJalanJawa.sol ← Source code smart contract
│
└── README.md
```

---

## Alur Navigasi Antar Halaman

```
frontend/login.html
    │
    ├── admin123 / admin123 ──────────────────────→ frontend/admin.html
    │
    ├── vendor01–vendor05 / VendorXX@2026 ────────→ frontend/vendor.html
    │
    └── Masuk sebagai Publik ─────────────────────→ frontend/publik.html
```

Setiap halaman role dijaga oleh `Session.requireLogin([...])` di `frontend/js/session.js`,
jadi akses antar role **saling eksklusif**:

- `admin.html` hanya bisa dibuka oleh role `admin`.
- `vendor.html` hanya bisa dibuka oleh role `vendor` — admin **tidak** bisa mengaksesnya,
  meski `admin.html` punya link tersembunyi (`display:none`) ke halaman ini.
- `publik.html` bisa diakses oleh semua role (read-only monitoring).

**State antar halaman** dikelola via `sessionStorage` melalui `frontend/js/session.js`.
Variabel seperti `role`, `status`, `kual`, `vendors`, dan `winner` otomatis
tersedia di setiap halaman tanpa perlu kirim ulang.

---

## Cara Menjalankan

### Prasyarat
- Browser Chrome/Firefox + ekstensi **MetaMask**
- MetaMask aktif di **Sepolia Testnet**
- ETH Sepolia gratis: [sepoliafaucet.com](https://sepoliafaucet.com)

### Langkah
1. Buka proyek menggunakan editor VS Code, masuk ke dalam folder `frontend`, lalu klik kanan pada berkas `login.html` → pilih *Open with Live Server*.
   > ⚠️ Jangan buka dengan `file://` — MetaMask butuh `http://`

2. Login sesuai role:

| Role | Username | Password | Keterangan Akun |
| :--- | :---: | :---: | :--- |
| **Admin** | `admin123` | `admin123` | Panitia / Pokja Pemilihan |
| **Vendor** | `vendor01` | `Vendor01@2026` | Kontraktor Pengaju Tender (Vendor 01) |
| **Vendor** | `vendor02` | `Vendor02@2026` | Kontraktor Pengaju Tender (Vendor 02) |
| **Vendor** | `vendor03` | `Vendor03@2026` | Kontraktor Pengaju Tender (Vendor 03) |
| **Vendor** | `vendor04` | `Vendor04@2026` | Kontraktor Pengaju Tender (Vendor 04) |
| **Vendor** | `vendor05` | `Vendor05@2026` | Kontraktor Pengaju Tender (Vendor 05) |
| **Publik** | — | klik tombol | Masyarakat Umum (Read-Only) |

3. Hubungkan MetaMask di halaman yang memerlukan transaksi

---

## Update Contract Address

Setelah redeploy di Remix IDE, ubah di `frontend/js/config.js`:

```javascript
const contractAddress = "0x...ADDRESS_BARU...";
```

---

## Smart Contract

| | |
|---|---|
| **File** | `smart-contract/TenderJalanJawa.sol` |
| **Network** | Ethereum Sepolia Testnet |
| **Address** | `0xE43FdE37B49f337FF64f052e45fC3866f5f3B97e` |
| **Etherscan** | https://sepolia.etherscan.io/address/0xE43FdE37B49f337FF64f052e45fC3866f5f3B97e |
| **Solidity** | `^0.8.19` |

> ⚠️ Cek ulang panjang address di atas (harus 42 karakter termasuk `0x`) sebelum submit, sering ada typo saat copy-paste dari Remix.

### Fungsi Utama Smart Contract

| Fungsi | Akses | Keterangan |
| :--- | :---: | :--- |
| `lockKualifikasi()` | Admin | Mengunci parameter acuan ambang batas kualifikasi tender di awal lelang. |
| `submitProposal()` | Vendor | Mengirimkan data penawaran harga dan berkas hash dokumen vendor ke blockchain. |
| `closeBidding()` | Admin | Menutup gerbang masa penawaran tender secara mutlak. |
| `announceWinner()` | Admin | Memicu kontrak untuk mengalkulasi skor relatif dan menetapkan pemenang otomatis. |
| `getProposals()` | Semua | Membaca seluruh list proposal yang masuk untuk kebutuhan transparansi publik. |

---

## Teknologi

| | |
|---|---|
| **Solidity ^0.8.19** | Smart Contract |
| **Ethers.js v6** | Koneksi frontend ↔ blockchain |
| **Web Crypto API** | Hash SHA-256 dokumen PDF |
| **MetaMask** | Wallet & ECDSA signing |
| **sessionStorage** | State sharing antar halaman |

---
*Institut Teknologi PLN · Fakultas Telematika Energi · 2025/2026*
