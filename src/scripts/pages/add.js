import API from "../data/api.js";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Add = () => {
  const main = document.getElementById("main-content");
  main.innerHTML = `
    <h2>Tambah Cerita</h2>
    <form id="addForm" aria-label="Form tambah cerita">
      <label for="description">Deskripsi</label>
      <textarea id="description" name="description" required></textarea>
      
      <label>Ambil Foto</label><br>
      <video id="camera" width="300" autoplay></video><br>
      <button type="button" id="captureBtn">Capture</button><br>
      <canvas id="canvas" style="display:none;"></canvas>

      <div id="map" style="height: 400px; width: 100%; margin-top: 1rem;"></div>

      <input type="hidden" id="lat" name="lat" required>
      <input type="hidden" id="lon" name="lon" required>

      <button type="submit">Kirim</button>
    </form>
  `;

  const video = document.getElementById("camera");
  const canvas = document.getElementById("canvas");
  const captureBtn = document.getElementById("captureBtn");
  let marker;

  // Mulai kamera
  navigator.mediaDevices
    .getUserMedia({ video: true })
    .then((stream) => {
      video.srcObject = stream;

      captureBtn.onclick = () => {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext("2d").drawImage(video, 0, 0);
        canvas.style.display = "block";
      };
    })
    .catch(() => alert("Gagal mengakses kamera"));

  // Setup peta
  const map = L.map("map").setView([0, 0], 2);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  map.on("click", (e) => {
    const { lat, lng } = e.latlng;
    document.getElementById("lat").value = lat;
    document.getElementById("lon").value = lng;
    if (marker) {
      map.removeLayer(marker);
    }
    marker = L.marker([lat, lng]).addTo(map);
  });

  document.getElementById("addForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const description = document.getElementById("description").value.trim();
    const lat = document.getElementById("lat").value;
    const lon = document.getElementById("lon").value;

    if (!description) {
      alert("Deskripsi harus diisi");
      return;
    }
    if (!lat || !lon) {
      alert("Silakan klik peta untuk memilih lokasi");
      return;
    }
    if (canvas.style.display === "none") {
      alert("Silakan ambil foto terlebih dahulu");
      return;
    }

    // Konversi canvas ke Blob
    canvas.toBlob(async (blob) => {
      if (!blob) {
        alert("Foto tidak valid");
        return;
      }
      const formData = new FormData();
      formData.append("description", description);
      formData.append("photo", blob, "photo.png");
      formData.append("lat", lat);
      formData.append("lon", lon);

      try {
        await API.addStory(formData);
        alert("Cerita berhasil ditambahkan!");
        location.hash = "/home";
      } catch (err) {
        alert("Gagal menambah cerita: " + (err.message || ""));
      } finally {
        // Matikan kamera saat sudah selesai submit
        if (video.srcObject) {
          video.srcObject.getTracks().forEach((t) => t.stop());
        }
      }
    }, "image/png");
  });
};

export default Add;
