const makeInjectable = require("../../../helpers/makeInjectable");
const { ObjectId } = require("mongodb");

module.exports = makeInjectable(
  {
    defaults: {
      MovieModel: () => require("../../movies/models/movie"),
    },
  },
  async function ({ MovieModel }, req, res) {
    try {
      const movieName = req.body && req.body.movieName;
      const releaseYear = req.body && req.body.releaseYear;

      if (!movieName) {
        return res.status(406).json({ error: "No movie name found" });
      }

      if (String(movieName).trim().length <= 3) {
        return res.status(406).json({ error: "Invalid movie name" });
      }

      const year = Number(releaseYear);
      const currentYear = new Date().getFullYear();

      if (Number.isNaN(year) || year < 1990 || year > currentYear) {
        return res.status(406).json({ error: "Invalid release year" });
      }

      const newMovie = new MovieModel({
        _id: new ObjectId(),
        title: movieName,
        releaseYear: year,
        characters: [],
      });

      await newMovie.save();

      const result = newMovie.toObject();

      return res.status(200).json({
        _id: result._id,
        name: result.title,
        releaseYear: result.releaseYear,
        characters: result.characters,
      });
    } catch (error) {
      return res.status(500).json({ error: "Database error" });
    }
  },
);
