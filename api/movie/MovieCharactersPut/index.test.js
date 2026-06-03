const func = require("./index");
const makeMockRes = require("../../../helpers/makeMockRes");
const { ObjectId } = require("mongodb");

const movieId = new ObjectId("69efd1c1b2f8c7327f029fad");
const charId1 = new ObjectId("6a1e03d0a7e982d8b6bc2a82");
const charId2 = new ObjectId("6a1e03d6c1b6526312a05de1");
const charId3 = new ObjectId("6a1e03dc3c961cfb2829658d");

test("MovieCharactersPut adds new, updates existing, skips duplicates", async () => {
  const movie = {
    _id: movieId,
    title: "Test",
    releaseYear: 2001,
    characters: [
      { _id: charId1, name: "Frodo", race: "Hobbit" },
      { _id: charId2, name: "Gandalf", race: "Maia" },
    ],
    save: jest.fn().mockResolvedValue(true),
  };

  const MovieModel = { find: jest.fn().mockResolvedValue([movie]) };

  const req = {
    body: {
      _id: String(movieId),
      characters: [
        { _id: String(charId1), name: "Frodo", race: "Hobbit" },
        { _id: String(charId2), name: "Gandalf Updated", race: "Maia" },
        { _id: String(charId3), name: "Aragorn", race: "Man" },
      ],
    },
  };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  const body = res.json.mock.calls[0][0];

  expect(res.status).toHaveBeenCalledWith(200);
  expect(body.characters).toHaveLength(3);
  expect(body.characters[0].status).toBe("NOT ADDED");
  expect(body.characters[1].status).toBe("UPDATED");
  expect(body.characters[2].status).toBe("ADDED");
});

test("MovieCharactersPut returns 404 when movie not found", async () => {
  const MovieModel = { find: jest.fn().mockResolvedValue([]) };

  const req = {
    body: {
      _id: "000000000000000000000000",
      characters: [],
    },
  };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "No movie found" });
});
