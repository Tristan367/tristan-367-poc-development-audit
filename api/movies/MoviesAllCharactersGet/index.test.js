const func = require("./index");
const makeMockRes = require("../../../helpers/makeMockRes");

test("MoviesAllCharactersGet returns all characters ordered by release year, deduplicated", async () => {
  const MovieModel = {
    find: jest.fn().mockResolvedValue([
      {
        releaseYear: 2001,
        characters: [
          { name: "Frodo Baggins", race: "Hobbit" },
          { name: "Aragorn", race: "Man" },
        ],
      },
      {
        releaseYear: 2002,
        characters: [
          { name: "Aragorn", race: "Man" },
          { name: "Gollum", race: "Hobbit" },
        ],
      },
    ]),
  };

  const req = {};
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  const body = res.json.mock.calls[0][0];

  expect(res.status).toHaveBeenCalledWith(200);
  expect(body).toHaveLength(3);
  expect(body[0]).toEqual({ name: "Frodo Baggins", race: "Hobbit" });
  expect(body[1]).toEqual({ name: "Aragorn", race: "Man" });
  expect(body[2]).toEqual({ name: "Gollum", race: "Hobbit" });
});

test("MoviesAllCharactersGet returns empty array when no movies", async () => {
  const MovieModel = {
    find: jest.fn().mockResolvedValue([]),
  };

  const req = {};
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  const body = res.json.mock.calls[0][0];

  expect(res.status).toHaveBeenCalledWith(200);
  expect(body).toEqual([]);
});

test("MoviesAllCharactersGet returns empty array when movies have no characters", async () => {
  const MovieModel = {
    find: jest.fn().mockResolvedValue([{ releaseYear: 2001, characters: [] }]),
  };

  const req = {};
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  const body = res.json.mock.calls[0][0];

  expect(res.status).toHaveBeenCalledWith(200);
  expect(body).toEqual([]);
});
