const func = require("./index");
const makeMockRes = require("../../../helpers/makeMockRes");
const { ObjectId } = require("mongodb");

const movieId = new ObjectId("69efd1c1b2f8c7327f029fad");

test("MovieCharactersDelete removes all characters", async () => {
  const movie = {
    _id: movieId,
    title: "Test",
    characters: [
      { name: "Frodo", race: "Hobbit" },
      { name: "Gandalf", race: "Maia" },
    ],
    save: jest.fn().mockResolvedValue(true),
  };

  const MovieModel = { find: jest.fn().mockResolvedValue([movie]) };

  const req = { params: { movieId: String(movieId) } };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(204);
  expect(res.send).toHaveBeenCalled();
  expect(movie.characters).toEqual([]);
  expect(movie.save).toHaveBeenCalled();
});

test("MovieCharactersDelete returns 404 when movie not found", async () => {
  const MovieModel = { find: jest.fn().mockResolvedValue([]) };

  const req = { params: { movieId: String(movieId) } };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "No movie found" });
});

test("MovieCharactersDelete returns 404 for invalid movieId", async () => {
  const MovieModel = { find: jest.fn() };

  const req = { params: { movieId: "invalid" } };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "No movie found" });
});
