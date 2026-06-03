const makeInjectable = require("../../../helpers/makeInjectable");
const { ObjectId } = require("mongodb");

function getIdValue(doc) {
  if (!doc || !doc._id) return "";
  if (doc._id.$oid) return String(doc._id.$oid);
  return String(doc._id);
}

module.exports = makeInjectable(
  {
    defaults: {
      MovieModel: () => require("../../movies/models/movie"),
    },
  },
  async function ({ MovieModel }, req, res) {
    try {
      const movieId = req.params && req.params.movieId;

      if (!ObjectId.isValid(movieId)) {
        return res.status(404).json({ error: "No movie found" });
      }

      const movies = await MovieModel.find();
      const movie = (movies || []).find(
        (m) => getIdValue(m) === String(movieId),
      );

      if (!movie) {
        return res.status(404).json({ error: "No movie found" });
      }

      movie.characters = [];
      await movie.save();

      return res.status(204).send();
    } catch (error) {
      console.error("MovieCharactersDelete error:", error);
      return res.status(500).json({ error: "Database error" });
    }
  },
);
