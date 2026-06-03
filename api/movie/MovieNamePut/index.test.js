const func = require("./index");
const makeMockRes = require("../../../helpers/makeMockRes");
const { ObjectId } = require("mongodb");

const movieId = new ObjectId("69efd1c1b2f8c7327f029fae");

function makeMovie(id) {
  return {
    _id: id,
    title: "Old Title",
    releaseYear: 2001,
    characters: [],
    save: jest.fn().mockResolvedValue(true),
  };
}

test("MovieNamePut returns 204 on success", async () => {
  const movie = makeMovie(movieId);
  const MovieModel = { find: jest.fn().mockResolvedValue([movie]) };

  const req = { body: { movieId: String(movieId), movieName: "New Title" } };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(204);
  expect(res.send).toHaveBeenCalled();
  expect(movie.title).toBe("New Title");
  expect(movie.save).toHaveBeenCalled();
});

test("MovieNamePut returns 404 when movie not found", async () => {
  const MovieModel = { find: jest.fn().mockResolvedValue([]) };

  const req = {
    body: { movieId: "000000000000000000000000", movieName: "New Title" },
  };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "No movie found" });
});

test("MovieNamePut returns 406 when movieName is missing", async () => {
  const MovieModel = { find: jest.fn() };

  const req = { body: { movieId: String(movieId) } };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({
    error: "Movie Name is not valid. It must be at least three characters.",
  });
});

test("MovieNamePut returns 406 when movieName has less than 3 characters", async () => {
  const MovieModel = { find: jest.fn() };

  const req = { body: { movieId: String(movieId), movieName: "Ab" } };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({
    error: "Movie Name is not valid. It must be at least three characters.",
  });
});
