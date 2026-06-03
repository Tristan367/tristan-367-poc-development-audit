const func = require("./index");
const makeMockRes = require("../../../helpers/makeMockRes");
const { ObjectId } = require("mongodb");

test("CharacterByParamsAddPost adds a character via route params", async () => {
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
    params: {
      movie_id: "690b9436fb29d9d76b2a0dc2",
      mainCharacterName: "Olwyn",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  const body = res.json.mock.calls[0][0];

  expect(res.status).toHaveBeenCalledWith(200);
  expect(body.characters).toHaveLength(1);
  expect(body.characters[0].name).toBe("Olwyn");
});

test("CharacterByParamsAddPost returns 406 when characterName is too short", async () => {
  const MovieModel = {
    find: jest.fn(),
  };

  const req = {
    params: {
      movie_id: "690b9436fb29d9d76b2a0dc2",
      mainCharacterName: "Ol",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({
    error:
      "Main Character Name is not valid. It must be at least three characters.",
  });
  expect(MovieModel.find).not.toHaveBeenCalled();
});

test("CharacterByParamsAddPost returns 404 when movie is not found", async () => {
  const MovieModel = {
    find: jest.fn().mockResolvedValue([]),
  };

  const req = {
    params: {
      movie_id: "000000000000000000000000",
      mainCharacterName: "Olwyn",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "No movie found" });
});
