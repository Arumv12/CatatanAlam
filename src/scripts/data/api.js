const BASE_URL = "https://story-api.dicoding.dev/v1";

const API = {
  async getStories() {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/stories?location=1`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();
    return data.listStory;
  },

  async login(email, password) {
    if (password.length < 8) {
      throw new Error("Password harus minimal 8 karakter");
    }

    const response = await fetch(`${BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (response.ok && data.loginResult && data.loginResult.token) {
      localStorage.setItem("token", data.loginResult.token);
      return data.loginResult;
    } else {
      throw new Error(data.message || "Login gagal");
    }
  },

  async register(name, email, password) {
    if (password.length < 8) {
      throw new Error("Password harus minimal 8 karakter");
    }

    const response = await fetch(`${BASE_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Registrasi gagal");
    }
  },

  async addStory(formData) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/stories`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Gagal menambah cerita");
    }
  },

  async subscribeNotification(subscription) {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/notifications/subscribe`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(subscription),
    });

    if (!response.ok) throw new Error("Gagal subscribe notifikasi");
    return await response.json();
  },
};

export default API;
