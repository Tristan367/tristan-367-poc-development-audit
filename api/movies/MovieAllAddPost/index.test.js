const func = require("./index");
const makeMockRes = require("../../../helpers/makeMockRes");
const { ObjectId } = require("mongodb");

const movieId1 = new ObjectId("69efd1c1b2f8c7327f029fad");
const movieId2 = new ObjectId("69efd1c1b2f8c7327f029fae");

test("MovieAllAddPost adds new movies and marks existing as NOT ADDED", async () => {
  const existingMovie = {
    _id: movieId1,
    title: "Existing",
    releaseYear: 2001,
    characters: [],
  };

  const newMovieInstance = {
    save: jest.fn().mockResolvedValue(true),
  };

  const MovieModel = jest.fn(function (data) {
    Object.assign(this, data);
    this.save = jest.fn().mockResolvedValue(true);
  });

  MovieModel.find = jest.fn().mockResolvedValue([existingMovie]);

  const req = {
    body: [
      {
        _id: movieId1,
        title: "Fellowship",
        releaseYear: 2001,
        characters: [],
      },
      {
        _id: movieId2,
        title: "Two Towers",
        releaseYear: 2002,
        characters: [],
      },
    ],
  };
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  const body = res.json.mock.calls[0][0];

  expect(res.status).toHaveBeenCalledWith(200);
  expect(body).toHaveLength(2);
  expect(body[0].status).toBe("NOT ADDED");
  expect(body[1].status).toBe("ADDED");
});
