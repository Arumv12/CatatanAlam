// src/scripts/router.js
import { loadHome as Home } from "./pages/home.js"; // ✅ SATU-SATUNYA import Home
import Add from "./pages/add.js";
import Login from "./pages/login.js";
import Register from "./pages/register.js";
import { startViewTransition } from "./utils/view-transition.js";

const routes = {
  "/home": Home,
  "/add": Add,
  "/login": Login,
  "/register": Register,
};

const router = () => {
  let path = location.hash.slice(1).toLowerCase();
  if (!path || !routes[path]) {
    path = "/home"; // Default
  }

  const page = routes[path];
  if (typeof page !== "function") {
    console.error(
      `Halaman untuk path "${path}" tidak ditemukan atau bukan fungsi.`
    );
    return;
  }

  // Ambil token dari localStorage (jika ada)
  const token = localStorage.getItem("token");

  startViewTransition(() => {
    // Teruskan token jika fungsi halaman memerlukannya
    page(token);
  });
};

export default router;
