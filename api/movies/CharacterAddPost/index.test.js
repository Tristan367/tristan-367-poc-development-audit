const func = require("./index");
const makeMockRes = require("../../../helpers/makeMockRes");
const { ObjectId } = require("mongodb");

test("CharacterAddPost adds a character to a movie", async () => {
  const movieData = {
    _id: new ObjectId("690b9436fb29d9d76b2a0dc2"),
    title: "Test Movie",
    releaseYear: 2024,
    characters: [],
    save: jest.fn().mockResolvedValue(true),
  };

  const MovieModel = {
    find: jest.fn().mockResolvedValue([movieData]),
  };

  const req = {
    body: {
      movieId: "690b9436fb29d9d76b2a0dc2",
      characterName: "Helm",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  const body = res.json.mock.calls[0][0];

  expect(res.status).toHaveBeenCalledWith(200);
  expect(body.characters).toHaveLength(1);
  expect(body.characters[0].name).toBe("Helm");
});

test("CharacterAddPost returns 404 when movie is not found", async () => {
  const MovieModel = {
    find: jest.fn().mockResolvedValue([]),
  };

  const req = {
    body: {
      movieId: "000000000000000000000000",
      characterName: "Helm",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "No movie found" });
});

test("CharacterAddPost returns 404 when characterName is missing", async () => {
  const MovieModel = {
    find: jest.fn(),
  };

  const req = {
    body: {
      movieId: "690b9436fb29d9d76b2a0dc2",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    error: "No Main Character Name Provided",
  });
  expect(MovieModel.find).not.toHaveBeenCalled();
});

test("CharacterAddPost returns 406 when characterName is too short", async () => {
  const MovieModel = {
    find: jest.fn(),
  };

  const req = {
    body: {
      movieId: "690b9436fb29d9d76b2a0dc2",
      characterName: "He",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({
    error: "Character Name is not valid. It must be at least three characters.",
  });
  expect(MovieModel.find).not.toHaveBeenCalled();
});
