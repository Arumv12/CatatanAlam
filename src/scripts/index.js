// Import CSS dan Router
import "../styles/main.css";
import router from "./router.js";

// Jalankan router saat hash berubah atau halaman pertama kali dimuat
window.addEventListener("hashchange", router);
window.addEventListener("load", router);

// OPTIONAL: Tambahkan handler logout jika Anda ingin tombol logout
window.logout = () => {
  localStorage.removeItem("token");
  alert("Berhasil logout");
  location.hash = "/login";
};
// Misal di index.js
async function subscribe() {
  const reg = await navigator.serviceWorker.register("/sw.js");
  const sub = await reg.pushManager.subscribe({
    userVisibleOnly: true,
    applicationServerKey: "<YOUR_PUBLIC_VAPID_KEY>",
  });
  await API.subscribeNotification(sub.toJSON());
  alert("Berhasil subscribe notifikasi");
}
window.subscribe = subscribe;
