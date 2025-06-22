// src/scripts/pages/login.js
import API from "../data/api.js";

const Login = () => {
  const main = document.getElementById("main-content");
  main.innerHTML = `
    <section>
      <h2>Login</h2>
      <form id="loginForm" aria-label="Form login pengguna">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required autocomplete="username" />
        
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required minlength="8" autocomplete="current-password" />
        
        <button type="submit">Login</button>
      </form>
      <div id="error-msg" role="alert" style="color: red; margin-top: 1rem;"></div>
    </section>
  `;

  const form = document.getElementById("loginForm");
  const errorMsg = document.getElementById("error-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.textContent = "";

    const email = form.email.value.trim();
    const password = form.password.value;

    if (password.length < 8) {
      errorMsg.textContent = "Password harus minimal 8 karakter.";
      return;
    }

    try {
      // Panggil API login, token akan disimpan otomatis di localStorage oleh API.login()
      await API.login(email, password);

      // Jika sukses, langsung navigasi ke halaman home
      location.hash = "/home";
    } catch (err) {
      // Tampilkan pesan error dari API atau default message
      errorMsg.textContent = err.message || "Login gagal. Silakan coba lagi.";
    }
  });
};

export default Login;
