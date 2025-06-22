/**
 * Fungsi startViewTransition
 * Membungkus callback render halaman dengan View Transition API jika didukung browser.
 * Jika tidak didukung, langsung menjalankan callback tanpa transisi.
 *
 * @param {Function} callback - Fungsi render halaman yang dijalankan saat transisi.
 * @returns {Promise|void}
 */
export function startViewTransition(callback) {
  if ("startViewTransition" in document) {
    // Gunakan API View Transition jika ada
    return document.startViewTransition(() => {
      // Panggil fungsi renderPage yang kamu definisikan sendiri,
      // atau jika gak perlu bisa hapus baris ini (lihat komentar di bawah)
      // renderPage();

      // Jalankan callback render halaman utama
      callback();
    });
  } else {
    // Fallback bila browser tidak mendukung View Transition API
    return callback();
  }
}

/**
 * Contoh fungsi renderPage (opsional)
 *
 * Jika kamu punya fungsi khusus untuk render ulang halaman,
 * kamu bisa definisikan di sini, lalu panggil renderPage() di startViewTransition.
 * Jika tidak perlu, kamu bisa hapus fungsi ini dan juga pemanggilan renderPage()
 */
export function renderPage() {
  // Contoh: jalankan router, render ulang view, dsb.
  // Misal: router(); atau renderHomePage(); tergantung struktur proyekmu

  console.log("Render ulang halaman dijalankan...");
}
