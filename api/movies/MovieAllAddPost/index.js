const makeInjectable = require("../../../helpers/makeInjectable");

function getIdValue(doc) {
  if (!doc || !doc._id) return "";
  if (doc._id.$oid) return String(doc._id.$oid);
  return String(doc._id);
}

module.exports = makeInjectable(
  {
    defaults: {
      MovieModel: () => require("../models/movie"),
    },
  },
  async function ({ MovieModel }, req, res) {
    try {
      const moviesToAdd = req.body || [];
      const existingMovies = await MovieModel.find();

      const result = [];

      for (const movie of moviesToAdd) {
        const exists = (existingMovies || []).some(
          (m) => getIdValue(m) === String(movie._id),
        );

        const status = exists ? "NOT ADDED" : "ADDED";

        if (!exists) {
          const newMovie = new MovieModel({
            _id: movie._id,
            title: movie.title,
            releaseYear: movie.releaseYear,
            characters: movie.characters || [],
          });
          await newMovie.save();
        }

        result.push({ ...movie, status });
      }

      return res.status(200).json(result);
    } catch (error) {
      console.error("MovieAllAddPost error:", error);
      return res.status(500).json({ error: "Database error" });
    }
  },
);
