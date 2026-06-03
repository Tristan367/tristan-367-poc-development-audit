const makeInjectable = require("../../../helpers/makeInjectable");

module.exports = makeInjectable(
  {
    defaults: {
      MovieModel: () => require("../models/movie"),
    },
  },
  async function ({ MovieModel }, req, res) {
    try {
      const startReleaseYear = Number(
        req.params && req.params.startReleaseYear,
      );
      const endReleaseYear = Number(req.params && req.params.endReleaseYear);

      if (Number.isNaN(startReleaseYear)) {
        return res
          .status(406)
          .json({ error: "Starting release year must be a number" });
      }

      if (startReleaseYear < 2000 || startReleaseYear > 2020) {
        return res
          .status(406)
          .json({
            error: "Starting release year must be between 2000 and 2020",
          });
      }

      if (Number.isNaN(endReleaseYear)) {
        return res
          .status(406)
          .json({ error: "Ending release year must be a number" });
      }

      if (endReleaseYear < 2000 || endReleaseYear > 2020) {
        return res
          .status(406)
          .json({ error: "Ending release year must be between 1977 and 2020" });
      }

      const movies = await MovieModel.find();
      const matchingMovies = (movies || [])
        .filter(
          (movie) =>
            Number(movie.releaseYear) >= startReleaseYear &&
            Number(movie.releaseYear) <= endReleaseYear,
        )
        .sort((a, b) => Number(a.releaseYear) - Number(b.releaseYear));

      if (!matchingMovies.length) {
        return res.status(404).json({ error: "No movies found" });
      }

      return res.status(200).json(matchingMovies);
    } catch (error) {
      return res.status(500).json({ error: "Database error" });
    }
  },
);
