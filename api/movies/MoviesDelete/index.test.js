const func = require("./index");
const makeMockRes = require("../../../helpers/makeMockRes");

test("MoviesDelete deletes all movies", async () => {
  const MovieModel = {
    deleteMany: jest.fn().mockResolvedValue({ deletedCount: 5 }),
  };

  const req = {};
  const res = makeMockRes();

  await func.inject({ MovieModel })(req, res);

  expect(res.status).toHaveBeenCalledWith(204);
  expect(res.send).toHaveBeenCalled();
  expect(MovieModel.deleteMany).toHaveBeenCalledWith({});
});
