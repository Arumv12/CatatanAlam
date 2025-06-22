// src/scripts/pages/home.js
import L from "leaflet";
import { saveStories, getStories, deleteStoryById } from "../db.js";
import API from "../data/api.js"; // Jika digunakan

export async function loadHome(token) {
  const main = document.getElementById("main-content");

  main.innerHTML = `
    <h1>Beranda</h1>
    <button id="clearDataBtn" aria-label="Hapus data offline" style="margin-bottom: 1rem;">
      Hapus Data Offline
    </button>
    <section aria-label="Daftar Cerita" id="stories-list">
      <h2>Loading cerita...</h2>
    </section>
    <div id="map" style="height: 400px; margin-top: 1rem;"></div>
  `;

  const clearBtn = document.getElementById("clearDataBtn");
  clearBtn.addEventListener("click", async () => {
    const confirmDelete = confirm(
      "Apakah Anda yakin ingin menghapus data offline?"
    );
    if (!confirmDelete) return;

    try {
      const stories = await getStories();
      for (const story of stories) {
        await deleteStoryById(story.id);
      }
      alert("Data offline berhasil dihapus.");
      location.reload();
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      alert("Gagal menghapus data offline.");
    }
  });

  const listContainer = document.getElementById("stories-list");

  try {
    const response = await fetch("https://story-api.dicoding.dev/v1/stories", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await response.json();

    if (!data.error) {
      await saveStories(data.listStory);
      renderStories(data.listStory);
    } else {
      alert(data.message);
      listContainer.innerHTML = `<p>${data.message}</p>`;
    }
  } catch (error) {
    console.error("Fetch error:", error);
    alert("Koneksi error, memuat dari IndexedDB...");

    const cachedStories = await getStories();
    if (cachedStories.length > 0) {
      renderStories(cachedStories);
    } else {
      listContainer.innerHTML = "<p>Belum ada cerita tersimpan offline</p>";
    }
  }
}

function renderStories(stories) {
  const listContainer = document.getElementById("stories-list");
  const mapContainer = document.getElementById("map");

  if (!stories.length) {
    listContainer.innerHTML = "<p>Tidak ada cerita tersedia.</p>";
    return;
  }

  // Generate HTML cerita dengan tombol Delete
  const listHTML = stories
    .map(
      (s) => `
        <article tabindex="0" aria-label="Cerita dari ${s.name}" data-id="${
        s.id
      }">
          <h3><a href="#/detail/${s.id}">${s.name}</a></h3>
          <img src="${s.photoUrl}" alt="Foto cerita dari ${
        s.name
      }" style="max-width: 100%; height: auto;" />
          <p>${s.description}</p>
          <p>Dibuat: ${new Date(s.createdAt).toLocaleString()}</p>
          <button class="delete-story-btn" aria-label="Hapus cerita dari ${
            s.name
          }">Delete</button>
        </article>
      `
    )
    .join("");
  listContainer.innerHTML = listHTML;

  // Pasang event listener tombol delete untuk setiap cerita
  const deleteButtons = listContainer.querySelectorAll(".delete-story-btn");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const article = e.target.closest("article");
      const storyId = article.getAttribute("data-id");

      const confirmed = confirm(
        "Apakah Anda yakin ingin menghapus cerita ini?"
      );
      if (!confirmed) return;

      try {
        await deleteStoryById(storyId);
        alert("Cerita berhasil dihapus dari data offline.");
        // Hapus elemen cerita dari DOM tanpa reload
        article.remove();
        // Update peta supaya marker ikut hilang:
        const remainingStories = await getStories();
        renderStories(remainingStories);
      } catch (error) {
        console.error("Gagal menghapus cerita:", error);
        alert("Gagal menghapus cerita.");
      }
    });
  });

  // Cleanup peta sebelumnya
  if (mapContainer._leaflet_id) {
    mapContainer._leaflet_id = null;
    mapContainer.innerHTML = "";
  }

  // Inisiasi peta baru
  const map = L.map(mapContainer).setView([0, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  // Tambahkan marker
  stories.forEach((s) => {
    if (
      s.lat !== undefined &&
      s.lon !== undefined &&
      s.lat !== null &&
      s.lon !== null
    ) {
      L.marker([s.lat, s.lon])
        .addTo(map)
        .bindPopup(`<b>${s.name}</b><br>${s.description}`);
    }
  });
}
