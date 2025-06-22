import { openDB } from "idb";

const DB_NAME = "jurnal-alam";
const DB_VERSION = 1;
const STORE_NAME = "stories";

export async function getDB() {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: "id" });
      }
    },
  });
}
// db.js
export async function clearStories() {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  await tx.store.clear();
  await tx.done;
}

export async function saveStories(stories) {
  const db = await getDB();
  const tx = db.transaction(STORE_NAME, "readwrite");
  for (const story of stories) {
    await tx.store.put(story);
  }
  await tx.done;
}

export async function getStories() {
  const db = await getDB();
  return await db.getAll(STORE_NAME);
}

export async function deleteStoryById(id) {
  const db = await getDB();
  await db.delete(STORE_NAME, id);
}
