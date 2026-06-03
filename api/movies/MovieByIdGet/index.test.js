const func = require("./index");
const makeMockRes = require("../../../helpers/makeMockRes");
const { getJSON } = require("../../../helpers/readFile");

test("MovieByIdGet returns a single movie object by id", async () => {
  const movieDocuments = getJSON(
    "../api/movies/_test/documents/movies-get-document.json",
  );
  const MovieModel = {
    find: jest.fn().mockResolvedValue(movieDocuments),
  };

  const req = {
    params: {
      id: "69efd1c1b2f8c7327f029faf",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  const body = res.json.mock.calls[0][0];

  expect(res.status).toHaveBeenCalledWith(200);
  expect(Array.isArray(body)).toBe(false);
  expect(body.title).toBe("The Lord of the Rings: The Return of the King");
});

test("MovieByIdGet returns 406 when id is not provided", async () => {
  const MovieModel = {
    find: jest.fn(),
  };

  const req = {
    params: {},
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({ error: "Movie _id is required" });
  expect(MovieModel.find).not.toHaveBeenCalled();
});

test("MovieByIdGet returns 404 when no movie exists for id", async () => {
  const movieDocuments = getJSON(
    "../api/movies/_test/documents/movies-get-document.json",
  );
  const MovieModel = {
    find: jest.fn().mockResolvedValue(movieDocuments),
  };

  const req = {
    params: {
      id: "000000000000000000000000",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "No movie found" });
});

test("MovieByIdGet returns 500 on database error", async () => {
  const MovieModel = {
    find: jest.fn().mockRejectedValue(new Error("Database down")),
  };

  const req = {
    params: {
      id: "69efd1c1b2f8c7327f029faf",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.json).toHaveBeenCalledWith({ error: "Database error" });
});
