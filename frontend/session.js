/* ================================================================
   session.js — Manajemen State Antar Halaman
   ================================================================
   Karena setiap halaman adalah file HTML terpisah, variabel JS
   tidak bisa dibagi langsung. Session menggunakan sessionStorage
   sebagai "jembatan" data antar halaman.

   Prefix "tjj_" dipakai agar tidak bentrok dengan key lain.
   ================================================================ */

const Session = {

  // --- Helpers dasar ---
  set(key, value) { sessionStorage.setItem('tjj_' + key, JSON.stringify(value)); },
  get(key)        { try { return JSON.parse(sessionStorage.getItem('tjj_' + key)); } catch { return null; } },
  clear()         { Object.keys(sessionStorage).filter(k => k.startsWith('tjj_')).forEach(k => sessionStorage.removeItem(k)); },

  // --- Role & wallet ---
  setRole(role)     { this.set('role', role); },
  getRole()         { return this.get('role'); },

  setWallet(addr)   { this.set('wallet', addr); },
  getWallet()       { return this.get('wallet') || '—'; },

  // --- Status kontrak ---
  setStatus(s)      { this.set('status', s); },
  getStatus()       { return this.get('status') || 'belum'; },

  // --- Kualifikasi ---
  setKual(obj)      { this.set('kual', obj); },
  getKual()         { return this.get('kual') || {}; },

  setKualLocked(v)  { this.set('kualLocked', v); },
  getKualLocked()   { return this.get('kualLocked') || false; },

  // --- Data vendor (array proposal) ---
  setVendors(arr)   { this.set('vendors', arr); },
  getVendors()      { return this.get('vendors') || []; },

  // --- Pemenang ---
  setWinner(obj)    { this.set('winner', obj); },
  getWinner()       { return this.get('winner') || null; },

  // --- Guard: redirect ke login jika belum login ---
  requireLogin(allowedRoles = []) {
    const role = this.getRole();
    if (!role) { window.location.href = 'login.html'; return false; }
    if (allowedRoles.length > 0 && !allowedRoles.includes(role)) {
      alert('⛔ Akses ditolak. Halaman ini tidak tersedia untuk role Anda.');
      window.location.href = 'login.html';
      return false;
    }
    return true;
  },

  // --- Logout ---
  logout() {
    this.clear();
    window.location.href = 'login.html';
  }
};

/* ----------------------------------------------------------------
   Deteksi pergantian Smart Contract (deploy ulang untuk tender baru)
   ----------------------------------------------------------------
   Setiap kali contractAddress di config.js berbeda dari alamat
   terakhir yang tersimpan di sessionStorage, berarti admin baru
   saja deploy ulang kontrak (mis: setelah pemenang tender lama
   diumumkan & buka tender baru). Maka data tender lama (status,
   kualifikasi, daftar vendor, pemenang) HARUS dianggap basi dan
   dibersihkan otomatis — supaya tidak salah tampil seperti data
   tender sebelumnya.
   Catatan: role login & wallet TIDAK dihapus, supaya admin/vendor
   tidak perlu login ulang hanya karena ganti kontrak.
   ---------------------------------------------------------------- */
(function cekPerubahanKontrak() {
  if (typeof contractAddress === 'undefined' || !contractAddress) return;
  const KEY_LAST_CONTRACT = 'tjj_lastContractAddress';
  const alamatTerakhir = sessionStorage.getItem(KEY_LAST_CONTRACT);

  if (alamatTerakhir && alamatTerakhir.toLowerCase() !== contractAddress.toLowerCase()) {
    ['status', 'kual', 'kualLocked', 'vendors', 'winner']
      .forEach(k => sessionStorage.removeItem('tjj_' + k));
    console.info('[TenderJalanJawa] Contract address berubah — cache tender lama dibersihkan otomatis.');
  }

  sessionStorage.setItem(KEY_LAST_CONTRACT, contractAddress);
})();
