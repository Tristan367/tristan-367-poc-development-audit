const func = require("./index");
const makeMockRes = require("../../../helpers/makeMockRes");
const { getJSON } = require("../../../helpers/readFile");

test("MoviesByCharacterNameGet returns movie summaries by character name", async () => {
  const movieDocuments = getJSON(
    "../api/movies/_test/documents/movies-get-document.json",
  );
  const MovieModel = {
    find: jest.fn().mockResolvedValue(movieDocuments),
  };

  const req = {
    params: {
      characterName: "Frodo Baggins",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  const body = res.json.mock.calls[0][0];

  expect(res.status).toHaveBeenCalledWith(200);
  expect(body).toHaveLength(3);
  expect(body[0]).toEqual(
    expect.objectContaining({
      title: "The Lord of the Rings: The Fellowship of the Ring",
      releaseYear: 2001,
    }),
  );
  expect(body[0].characters).toBeUndefined();
});

test("MoviesByCharacterNameGet returns 406 when character name is missing", async () => {
  const MovieModel = {
    find: jest.fn(),
  };

  const req = {
    params: {
      characterName: " ",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({
    error: "Character name is required",
  });
  expect(MovieModel.find).not.toHaveBeenCalled();
});

test("MoviesByCharacterNameGet returns 404 when character is not found", async () => {
  const movieDocuments = getJSON(
    "../api/movies/_test/documents/movies-get-document.json",
  );
  const MovieModel = {
    find: jest.fn().mockResolvedValue(movieDocuments),
  };

  const req = {
    params: {
      characterName: "Tom Bombadil",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({
    error: "No movie(s) with this Character were found",
  });
});
