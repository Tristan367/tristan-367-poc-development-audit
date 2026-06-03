const func = require("./index");
const makeMockRes = require("../../../helpers/makeMockRes");
const { ObjectId } = require("mongodb");

const movieId1 = new ObjectId("69efd1c1b2f8c7327f029fae");
const movieId2 = new ObjectId("69efd1c1b2f8c7327f029fb1");
const charId = "6a15b1d58291c3d1a98c2ac1";

function makeMovie(id, characters = []) {
  return {
    _id: id,
    title: "Test Movie",
    releaseYear: 2001,
    characters,
    save: jest.fn().mockResolvedValue(true),
  };
}

test("CharacterToMoviesAddPost adds character to valid movies", async () => {
  const movie1 = makeMovie(movieId1);
  const movie2 = makeMovie(movieId2);

  const MovieModel = { find: jest.fn().mockResolvedValue([movie1, movie2]) };

  const req = {
    body: {
      movies: [String(movieId1), String(movieId2)],
      characterToAdd: { id: charId, name: "Dave Jones", race: "Man" },
    },
  };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(movie1.save).toHaveBeenCalled();
  expect(movie2.save).toHaveBeenCalled();
  expect(movie1.characters).toHaveLength(1);
  expect(movie1.characters[0].name).toBe("Dave Jones");
});

test("CharacterToMoviesAddPost skips movies not found", async () => {
  const movie1 = makeMovie(movieId1);

  const MovieModel = { find: jest.fn().mockResolvedValue([movie1]) };

  const req = {
    body: {
      movies: ["000000000000000000000000"],
      characterToAdd: { id: charId, name: "Dave Jones", race: "Man" },
    },
  };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(movie1.save).not.toHaveBeenCalled();
});

test("CharacterToMoviesAddPost skips if character already in movie", async () => {
  const movie1 = makeMovie(movieId1, [
    { _id: charId, name: "Dave Jones", race: "Man" },
  ]);

  const MovieModel = { find: jest.fn().mockResolvedValue([movie1]) };

  const req = {
    body: {
      movies: [String(movieId1)],
      characterToAdd: { id: charId, name: "Dave Jones", race: "Man" },
    },
  };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(201);
  expect(movie1.save).not.toHaveBeenCalled();
  expect(movie1.characters).toHaveLength(1);
});

test("CharacterToMoviesAddPost returns 406 if characterToAdd is missing id", async () => {
  const MovieModel = { find: jest.fn() };

  const req = {
    body: {
      movies: [String(movieId1)],
      characterToAdd: { name: "Dave Jones", race: "Man" },
    },
  };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({
    error: "Your character can not be added.",
  });
});

test("CharacterToMoviesAddPost returns 406 if characterToAdd is missing name", async () => {
  const MovieModel = { find: jest.fn() };

  const req = {
    body: {
      movies: [String(movieId1)],
      characterToAdd: { id: charId, race: "Man" },
    },
  };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({
    error: "Your character can not be added.",
  });
});

test("CharacterToMoviesAddPost returns 406 if characterToAdd is missing race", async () => {
  const MovieModel = { find: jest.fn() };

  const req = {
    body: {
      movies: [String(movieId1)],
      characterToAdd: { id: charId, name: "Dave Jones" },
    },
  };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({
    error: "Your character can not be added.",
  });
});
