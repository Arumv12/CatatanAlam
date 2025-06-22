import API from "../data/api.js";

const Detail = async (id) => {
  const main = document.getElementById("main-content");
  main.innerHTML = "<h2>Loading detail...</h2>";
  try {
    const data = await API.getDetailStory(id);
    const s = data.story;

    main.innerHTML = `
      <article>
        <h2>${s.name}</h2>
        <img src="${s.photoUrl}" alt="Foto ${s.name}" />
        <p>${s.description}</p>
        <p>Dibuat pada: ${new Date(s.createdAt).toLocaleString()}</p>
        ${s.lat && s.lon ? '<div id="map" style="height:300px;"></div>' : ""}
      </article>
    `;

    if (s.lat && s.lon) {
      const map = L.map("map").setView([s.lat, s.lon], 10);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        map
      );
      L.marker([s.lat, s.lon])
        .addTo(map)
        .bindPopup(`<b>${s.name}</b><br>${s.description}`);
    }
  } catch (err) {
    main.innerHTML = `<p>Gagal memuat detail</p>`;
  }
};

export default Detail;
