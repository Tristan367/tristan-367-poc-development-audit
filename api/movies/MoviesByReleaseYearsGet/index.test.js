const func = require("./index");
const makeMockRes = require("../../../helpers/makeMockRes");
const { getJSON } = require("../../../helpers/readFile");

test("MoviesByReleaseYearsGet returns movies between start and end year", async () => {
  const movieDocuments = getJSON(
    "../api/movies/_test/documents/movies-get-document.json",
  );
  const MovieModel = {
    find: jest.fn().mockResolvedValue(movieDocuments),
  };

  const req = {
    params: {
      startReleaseYear: "2000",
      endReleaseYear: "2005",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  const body = res.json.mock.calls[0][0];

  expect(res.status).toHaveBeenCalledWith(200);
  expect(body).toHaveLength(3);
  expect(body[0].releaseYear).toBe(2001);
  expect(body[2].releaseYear).toBe(2003);
});

test("MoviesByReleaseYearsGet returns 406 when start year is not a number", async () => {
  const MovieModel = {
    find: jest.fn(),
  };

  const req = {
    params: {
      startReleaseYear: "abc",
      endReleaseYear: "2005",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({
    error: "Starting release year must be a number",
  });
  expect(MovieModel.find).not.toHaveBeenCalled();
});

test("MoviesByReleaseYearsGet returns 406 when start year is out of range", async () => {
  const MovieModel = {
    find: jest.fn(),
  };

  const req = {
    params: {
      startReleaseYear: "1999",
      endReleaseYear: "2005",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({
    error: "Starting release year must be between 2000 and 2020",
  });
  expect(MovieModel.find).not.toHaveBeenCalled();
});

test("MoviesByReleaseYearsGet returns 406 when end year is not a number", async () => {
  const MovieModel = {
    find: jest.fn(),
  };

  const req = {
    params: {
      startReleaseYear: "2000",
      endReleaseYear: "x",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({
    error: "Ending release year must be a number",
  });
  expect(MovieModel.find).not.toHaveBeenCalled();
});

test("MoviesByReleaseYearsGet returns 406 when end year is out of range", async () => {
  const MovieModel = {
    find: jest.fn(),
  };

  const req = {
    params: {
      startReleaseYear: "2000",
      endReleaseYear: "1999",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({
    error: "Ending release year must be between 1977 and 2020",
  });
  expect(MovieModel.find).not.toHaveBeenCalled();
});

test("MoviesByReleaseYearsGet returns 404 when no movies are found", async () => {
  const movieDocuments = getJSON(
    "../api/movies/_test/documents/movies-get-document.json",
  );
  const MovieModel = {
    find: jest.fn().mockResolvedValue(movieDocuments),
  };

  const req = {
    params: {
      startReleaseYear: "2004",
      endReleaseYear: "2010",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: "No movies found" });
});
