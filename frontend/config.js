/* ================================================================
   config.js — Konfigurasi Global
   ================================================================
   Dimuat di SEMUA halaman. Berisi konstanta yang dipakai bersama:
   - contractAddress & contractABI
   - daftarAkunVendor (akun demo)
   - Variabel koneksi Ethers.js
   ================================================================ */

// ⚠️ Update setelah redeploy kontrak di Remix!
const contractAddress = "0x291072870280685A4B7B765A6F609f1e46Be4772";

const contractABI = [
  { "inputs": [], "stateMutability": "nonpayable", "type": "constructor" },
  { "inputs": [], "name": "announceWinner", "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  { "inputs": [], "name": "closeBidding",   "outputs": [], "stateMutability": "nonpayable", "type": "function" },
  {
    "inputs": [
      { "internalType": "uint256", "name": "_minExpYears", "type": "uint256" },
      { "internalType": "uint256", "name": "_maxPagu",     "type": "uint256" },
      { "internalType": "uint256", "name": "_bobotTeknis", "type": "uint256" }
    ],
    "name": "lockKualifikasi", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string",  "name": "_namaPerusahaan", "type": "string"  },
      { "internalType": "uint256", "name": "_penawaranHarga", "type": "uint256" },
      { "internalType": "uint256", "name": "_pengalamanTahun","type": "uint256" },
      { "internalType": "string",  "name": "_documentHash",   "type": "string"  }
    ],
    "name": "submitProposal", "outputs": [], "stateMutability": "nonpayable", "type": "function"
  },
  {
    "inputs": [], "name": "getProposals",
    "outputs": [{ "components": [
      { "internalType": "address", "name": "vendor",          "type": "address" },
      { "internalType": "string",  "name": "namaPerusahaan",  "type": "string"  },
      { "internalType": "uint256", "name": "penawaranHarga",  "type": "uint256" },
      { "internalType": "uint256", "name": "pengalamanTahun", "type": "uint256" },
      { "internalType": "uint256", "name": "skor",            "type": "uint256" },
      { "internalType": "string",  "name": "documentHash",    "type": "string"  },
      { "internalType": "uint256", "name": "timestamp",       "type": "uint256" }
    ], "internalType": "struct TenderJalanJawa.Proposal[]", "name": "", "type": "tuple[]" }],
    "stateMutability": "view", "type": "function"
  },
  { "inputs": [], "name": "admin",             "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "isBiddingOpen",     "outputs": [{ "internalType": "bool",    "name": "", "type": "bool"    }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "hasWinner",         "outputs": [{ "internalType": "bool",    "name": "", "type": "bool"    }], "stateMutability": "view", "type": "function" },
  {
    "inputs": [], "name": "winner",
    "outputs": [
      { "internalType": "address", "name": "vendor",          "type": "address" },
      { "internalType": "string",  "name": "namaPerusahaan",  "type": "string"  },
      { "internalType": "uint256", "name": "penawaranHarga",  "type": "uint256" },
      { "internalType": "uint256", "name": "pengalamanTahun", "type": "uint256" },
      { "internalType": "uint256", "name": "skor",            "type": "uint256" },
      { "internalType": "string",  "name": "documentHash",    "type": "string"  },
      { "internalType": "uint256", "name": "timestamp",       "type": "uint256" }
    ],
    "stateMutability": "view", "type": "function"
  },
  { "inputs": [], "name": "kualifikasiLocked", "outputs": [{ "internalType": "bool",    "name": "", "type": "bool"    }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "minExpYears",       "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "maxPagu",           "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "inputs": [], "name": "bobotTeknis",       "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" },
  { "anonymous": false, "inputs": [
      { "indexed": false, "internalType": "uint256", "name": "minExp",      "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "maxPagu",     "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "bobotTeknis", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "bobotHarga",  "type": "uint256" }
    ], "name": "KualifikasiLocked", "type": "event" },
  { "anonymous": false, "inputs": [
      { "indexed": true,  "internalType": "address", "name": "vendor",          "type": "address" },
      { "indexed": false, "internalType": "string",  "name": "namaPerusahaan",  "type": "string"  },
      { "indexed": false, "internalType": "uint256", "name": "penawaranHarga",  "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "pengalamanTahun", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "skor",            "type": "uint256" },
      { "indexed": false, "internalType": "string",  "name": "documentHash",    "type": "string"  },
      { "indexed": false, "internalType": "uint256", "name": "timestamp",       "type": "uint256" }
    ], "name": "NewProposal", "type": "event" },
  { "anonymous": false, "inputs": [], "name": "BiddingClosed", "type": "event" },
  { "anonymous": false, "inputs": [
      { "indexed": false, "internalType": "address", "name": "vendor",         "type": "address" },
      { "indexed": false, "internalType": "string",  "name": "namaPerusahaan", "type": "string"  },
      { "indexed": false, "internalType": "uint256", "name": "skor",           "type": "uint256" }
    ], "name": "WinnerSet", "type": "event" }
];

const daftarAkunVendor = [
  { user: "vendor01", pass: "Vendor01@2026", wallet: "0x98B...11e1", nama: "PT. Karya Mandiri Jaya" },
  { user: "vendor02", pass: "Vendor02@2026", wallet: "0x24A...55b2", nama: "PT. Bangun Sejahtera Abadi" },
  { user: "vendor03", pass: "Vendor03@2026", wallet: "0x3D1...88c3", nama: "PT. Cipta Konstruksi Utama" },
  { user: "vendor04", pass: "Vendor04@2026", wallet: "0x4E2...99d4", nama: "PT. Surya Bangun Persada" },
  { user: "vendor05", pass: "Vendor05@2026", wallet: "0x5F3...00e5", nama: "PT. Graha Konstruksi Nusantara" },
  { user: "vendor06", pass: "Vendor06@2026", wallet: "0x6A4...11f6", nama: "PT. Mitra Jaya Pratama" },
  { user: "vendor07", pass: "Vendor07@2026", wallet: "0x7B5...22a7", nama: "PT. Bumi Perkasa Konstruksi" },
  { user: "vendor08", pass: "Vendor08@2026", wallet: "0x8C6...33b8", nama: "PT. Nusantara Karya Beton" },
  { user: "vendor09", pass: "Vendor09@2026", wallet: "0x9D7...44c9", nama: "PT. Sentosa Jalan Raya" },
  { user: "vendor10", pass: "Vendor10@2026", wallet: "0x0E8...55d0", nama: "PT. Permata Infrastruktur" }
];

// Variabel koneksi Ethers.js — diisi ulang tiap halaman load
let provider, signer, contract;
