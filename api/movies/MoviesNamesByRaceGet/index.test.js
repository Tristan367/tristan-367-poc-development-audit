const func = require("./index");
const makeMockRes = require("../../../helpers/makeMockRes");

test("MoviesNamesByRaceGet returns characters with matching race", async () => {
  const MovieModel = {
    find: jest.fn().mockResolvedValue([
      {
        title: "LOTR 1",
        characters: [
          { name: "Aragorn", race: "Man" },
          { name: "Legolas", race: "Elf" },
        ],
      },
      {
        title: "LOTR 2",
        characters: [
          { name: "Aragorn", race: "Man" },
          { name: "Theoden", race: "Man" },
        ],
      },
    ]),
  };

  const req = { params: { raceName: "Man" } };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  const body = res.json.mock.calls[0][0];

  expect(res.status).toHaveBeenCalledWith(200);
  expect(body).toHaveLength(2);
  expect(body.find((c) => c.name === "Aragorn").movies).toEqual([
    "LOTR 1",
    "LOTR 2",
  ]);
  expect(body.find((c) => c.name === "Theoden").movies).toEqual(["LOTR 2"]);
});

test("MoviesNamesByRaceGet is case-insensitive", async () => {
  const MovieModel = {
    find: jest.fn().mockResolvedValue([
      {
        title: "LOTR 1",
        characters: [{ name: "Aragorn", race: "Man" }],
      },
    ]),
  };

  const req = { params: { raceName: "man" } };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  const body = res.json.mock.calls[0][0];

  expect(res.status).toHaveBeenCalledWith(200);
  expect(body).toHaveLength(1);
});

test("MoviesNamesByRaceGet returns 404 when race not found", async () => {
  const MovieModel = {
    find: jest.fn().mockResolvedValue([
      {
        title: "LOTR 1",
        characters: [{ name: "Aragorn", race: "Man" }],
      },
    ]),
  };

  const req = { params: { raceName: "Dragon" } };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    error: "No character with that race was found in a movie.",
  });
});
