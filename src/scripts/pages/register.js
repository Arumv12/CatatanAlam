// register.js
import API from "../data/api.js";

const Register = () => {
  const main = document.getElementById("main-content");
  main.innerHTML = `
    <section>
      <h2>Register</h2>
      <form id="registerForm" aria-label="Form registrasi pengguna">
        <label for="name">Nama</label>
        <input type="text" id="name" name="name" required autocomplete="name" />
        
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required autocomplete="email" />
        
        <label for="password">Password</label>
        <input type="password" id="password" name="password" required minlength="8" autocomplete="new-password" />
        
        <button type="submit">Register</button>
      </form>
      <div id="error-msg" role="alert" style="color: red; margin-top: 1rem;"></div>
    </section>
  `;

  const form = document.getElementById("registerForm");
  const errorMsg = document.getElementById("error-msg");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorMsg.textContent = "";

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;

    if (password.length < 8) {
      errorMsg.textContent = "Password harus minimal 8 karakter.";
      return;
    }

    try {
      await API.register(name, email, password);
      alert("Registrasi berhasil. Silakan login.");
      location.hash = "/login";
    } catch (err) {
      errorMsg.textContent =
        err.message || "Registrasi gagal. Silakan coba lagi.";
    }
  });
};

export default Register;
