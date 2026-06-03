const func = require("./index");
const makeMockRes = require("../../../helpers/makeMockRes");
const { getJSON } = require("../../../helpers/readFile");

test("NamesById returns movie title, character name, and race", async () => {
  const movieDocuments = getJSON(
    "../api/movies/_test/documents/movies-get-document.json",
  );
  const MovieModel = {
    find: jest.fn().mockResolvedValue(movieDocuments),
  };

  const req = {
    params: {
      movieId: "69efd1c1b2f8c7327f029faf",
      characterName: "Aragorn",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  const body = res.json.mock.calls[0][0];

  expect(res.status).toHaveBeenCalledWith(200);
  expect(body).toEqual({
    movie: "The Lord of the Rings: The Return of the King",
    name: "Aragorn",
    race: "Man",
  });
});

test("NamesById returns 404 when movie is not found", async () => {
  const movieDocuments = getJSON(
    "../api/movies/_test/documents/movies-get-document.json",
  );
  const MovieModel = {
    find: jest.fn().mockResolvedValue(movieDocuments),
  };

  const req = {
    params: {
      movieId: "000000000000000000000000",
      characterName: "Aragorn",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "No movie found" });
});

test("NamesById returns 404 when character is not found", async () => {
  const movieDocuments = getJSON(
    "../api/movies/_test/documents/movies-get-document.json",
  );
  const MovieModel = {
    find: jest.fn().mockResolvedValue(movieDocuments),
  };

  const req = {
    params: {
      movieId: "69efd1c1b2f8c7327f029faf",
      characterName: "Tom Bombadil",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "No character found" });
});
