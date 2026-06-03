const func = require("./index");
const makeMockRes = require("../../../helpers/makeMockRes");
const { ObjectId } = require("mongodb");

const movieId = new ObjectId("69efd1c1b2f8c7327f029fad");
const charId = new ObjectId("6a1e03d0a7e982d8b6bc2a82");

test("CharacterDelete removes character from movie", async () => {
  const movie = {
    _id: movieId,
    title: "Test",
    releaseYear: 2001,
    characters: [
      { _id: charId, name: "Frodo", race: "Hobbit" },
      { _id: new ObjectId(), name: "Gandalf", race: "Maia" },
    ],
    save: jest.fn().mockResolvedValue(true),
  };

  const MovieModel = { find: jest.fn().mockResolvedValue([movie]) };

  const req = {
    body: { movieId: String(movieId), characterId: String(charId) },
  };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(204);
  expect(res.send).toHaveBeenCalled();
  expect(movie.characters).toHaveLength(1);
  expect(movie.characters[0].name).toBe("Gandalf");
});

test("CharacterDelete returns 404 when movie not found", async () => {
  const MovieModel = { find: jest.fn().mockResolvedValue([]) };

  const req = {
    body: {
      movieId: String(movieId),
      characterId: String(charId),
    },
  };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "No movie found" });
});

test("CharacterDelete returns 404 when character not found", async () => {
  const movie = {
    _id: movieId,
    characters: [],
    save: jest.fn(),
  };

  const MovieModel = { find: jest.fn().mockResolvedValue([movie]) };

  const req = {
    body: {
      movieId: String(movieId),
      characterId: String(charId),
    },
  };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "No Character found" });
});

test("CharacterDelete returns 404 for invalid movieId", async () => {
  const MovieModel = { find: jest.fn() };

  const req = {
    body: { movieId: "invalid", characterId: String(charId) },
  };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "No movie found" });
});
