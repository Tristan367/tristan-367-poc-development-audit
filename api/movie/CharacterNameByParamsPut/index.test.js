const func = require("./index");
const makeMockRes = require("../../../helpers/makeMockRes");
const { ObjectId } = require("mongodb");

const movieId = new ObjectId("69efd1c1b2f8c7327f029fae");
const characterId = new ObjectId("6a15b4f20a41fb7270ce2f3e");

function makeMovie(id, characters = []) {
  return {
    _id: id,
    title: "Test Movie",
    releaseYear: 2002,
    characters,
    save: jest.fn().mockResolvedValue(true),
  };
}

test("CharacterNameByParamsPut returns 204 on success", async () => {
  const movie = makeMovie(movieId, [
    { _id: characterId, name: "Gollum", race: "Hobbit" },
  ]);
  const MovieModel = { find: jest.fn().mockResolvedValue([movie]) };

  const req = {
    params: {
      movieId: String(movieId),
      characterId: String(characterId),
      characterName: "Smeagol",
    },
  };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(204);
  expect(res.send).toHaveBeenCalled();
  expect(movie.characters[0].name).toBe("Smeagol");
  expect(movie.save).toHaveBeenCalled();
});

test("CharacterNameByParamsPut returns 404 when movie not found", async () => {
  const MovieModel = { find: jest.fn().mockResolvedValue([]) };

  const req = {
    params: {
      movieId: "000000000000000000000000",
      characterId: String(characterId),
      characterName: "Smeagol",
    },
  };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "Movie not found for id >" });
});

test("CharacterNameByParamsPut returns 404 when character not found", async () => {
  const movie = makeMovie(movieId, []);
  const MovieModel = { find: jest.fn().mockResolvedValue([movie]) };

  const req = {
    params: {
      movieId: String(movieId),
      characterId: "000000000000000000000000",
      characterName: "Smeagol",
    },
  };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    error: "Character not found for id >",
  });
});

test("CharacterNameByParamsPut returns 406 when characterName has less than 3 characters", async () => {
  const MovieModel = { find: jest.fn() };

  const req = {
    params: {
      movieId: String(movieId),
      characterId: String(characterId),
      characterName: "Ab",
    },
  };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({
    error: "Character Name is not valid. It must be at least three characters.",
  });
});
