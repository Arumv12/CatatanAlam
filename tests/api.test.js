import API from "../src/scripts/data/api.js";

global.fetch = jest.fn();

describe("API", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should login and store token", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        loginResult: { token: "test-token" },
      }),
    });

    await API.login("test@mail.com", "password123");
    expect(localStorage.getItem("token")).toBe("test-token");
  });

  it("should get stories", async () => {
    fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        listStory: [
          {
            id: "1",
            name: "Test",
            photoUrl: "",
            description: "",
            createdAt: "",
          },
        ],
      }),
    });

    const data = await API.getStories();
    expect(data).toHaveLength(1);
  });
});
