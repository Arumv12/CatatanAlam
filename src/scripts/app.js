import "../styles/main.css";
import router from "./router.js";
import "leaflet/dist/leaflet.css";
import { subscribePush } from "./push-notification.js"; // IMPORT di atas semua

window.addEventListener("hashchange", router);
window.addEventListener("load", router);

// =================================================
// LOGOUT FUNCTION
// =================================================
function logout() {
  localStorage.removeItem("token");
  window.location.hash = "#/login";
  alert("Anda berhasil logout.");
}
window.logout = logout;

// =================================================
// UTILITY FUNCTION
// =================================================
function urlBase64ToUint8Array(base64) {
  const padding = "=".repeat((4 - (base64.length % 4)) % 4);
  const b64 = (base64 + padding).replace(/\-/g, "+").replace(/\_/g, "/");
  const rawData = window.atob(b64);
  const output = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
}

// =================================================
// EXPORT TO WINDOW
// =================================================
window.subscribePush = subscribePush;

async function registerServiceWorker() {
  if ("serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/service-worker.js"
      );
      console.log("Service Worker registered", registration);
    } catch (error) {
      console.error("Service Worker registration failed:", error);
    }
  }
}

async function subscribe() {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Silakan login terlebih dahulu.");
    return;
  }
  await subscribePush();
}

// Registrasi service worker langsung saat load aplikasi
registerServiceWorker();

// Expose fungsi subscribe agar bisa dipanggil di UI
window.subscribe = subscribe;
