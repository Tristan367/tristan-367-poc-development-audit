const makeInjectable = require("../../../helpers/makeInjectable");

function getIdValue(doc) {
  if (!doc || !doc._id) {
    return "";
  }

  if (doc._id.$oid) {
    return String(doc._id.$oid);
  }

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
      const movieId = req.params && req.params.movieId;

      if (!movieId) {
        return res.status(406).json({ error: "Movie ID is required" });
      }

      const movies = await MovieModel.find();
      const movie = (movies || []).find(
        (item) => getIdValue(item) === String(movieId),
      );

      if (!movie) {
        return res.status(404).json({ error: "No movie found" });
      }

      const characters = (movie.characters || []).map((c) => ({
        name: c.name,
      }));

      return res.status(200).json(characters);
    } catch (error) {
      return res.status(500).json({ error: "Database error" });
    }
  },
);
