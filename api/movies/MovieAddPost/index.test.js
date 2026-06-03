const func = require("./index");
const makeMockRes = require("../../../helpers/makeMockRes");
const { ObjectId } = require("mongodb");

test("MovieAddPost creates a new movie with valid data", async () => {
  const savedMovie = {
    _id: new ObjectId(),
    title: "The Lord of the Rings: The War of the Rohirrim",
    releaseYear: 2024,
    characters: [],
  };

  const MovieModel = function (data) {
    Object.assign(this, data);
  };
  MovieModel.prototype.save = jest.fn().mockResolvedValue(savedMovie);
  MovieModel.prototype.toObject = jest.fn().mockReturnValue(savedMovie);

  const req = {
    body: {
      movieName: "The Lord of the Rings: The War of the Rohirrim",
      releaseYear: 2024,
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  const body = res.json.mock.calls[0][0];

  expect(res.status).toHaveBeenCalledWith(200);
  expect(body.name).toBe("The Lord of the Rings: The War of the Rohirrim");
  expect(body.releaseYear).toBe(2024);
  expect(body.characters).toEqual([]);
});

test("MovieAddPost returns 406 when movieName is missing", async () => {
  const MovieModel = function () {};

  const req = {
    body: {
      releaseYear: 2024,
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({ error: "No movie name found" });
});

test("MovieAddPost returns 406 when movieName is too short", async () => {
  const MovieModel = function () {};

  const req = {
    body: {
      movieName: "ABC",
      releaseYear: 2024,
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({ error: "Invalid movie name" });
});

test("MovieAddPost returns 406 when releaseYear is not a number", async () => {
  const MovieModel = function () {};

  const req = {
    body: {
      movieName: "The Lord of the Rings",
      releaseYear: "abc",
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({ error: "Invalid release year" });
});

test("MovieAddPost returns 406 when releaseYear is out of range", async () => {
  const MovieModel = function () {};

  const req = {
    body: {
      movieName: "The Lord of the Rings",
      releaseYear: 1989,
    },
  };

  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(406);
  expect(res.json).toHaveBeenCalledWith({ error: "Invalid release year" });
});
