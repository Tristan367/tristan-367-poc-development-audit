const func = require("./index");
const makeMockRes = require("../../../helpers/makeMockRes");
const { getJSON } = require("../../../helpers/readFile");

test("MoviesByRaceGet returns movie summaries with matching race characters", async () => {
  const movieDocuments = getJSON(
    "../api/movies/_test/documents/movies-get-document.json",
  );
  const MovieModel = {
    find: jest.fn().mockResolvedValue(movieDocuments),
  };

  const req = {
    params: {
      race: "dwarf",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  const body = res.json.mock.calls[0][0];

  expect(res.status).toHaveBeenCalledWith(200);
  expect(body).toHaveLength(4);
  expect(body[0]).toEqual(
    expect.objectContaining({
      title: "The Lord of the Rings: The Fellowship of the Ring",
      releaseYear: 2001,
    }),
  );
  expect(body[0].characters).toEqual([{ name: "Gimli", race: "Dwarf" }]);
});

test("MoviesByRaceGet returns 406 when race is missing", async () => {
  const MovieModel = {
    find: jest.fn(),
  };

  const req = {
    params: {
      race: " ",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({ error: "Race is required" });
  expect(MovieModel.find).not.toHaveBeenCalled();
});

test("MoviesByRaceGet returns 404 when race does not exist", async () => {
  const movieDocuments = getJSON(
    "../api/movies/_test/documents/movies-get-document.json",
  );
  const MovieModel = {
    find: jest.fn().mockResolvedValue(movieDocuments),
  };

  const req = {
    params: {
      race: "oompa loompa",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    error: "No movie(s) with characters of the oompa loompa race were found",
  });
});
