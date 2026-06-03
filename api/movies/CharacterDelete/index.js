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
      const movieId = req.body && req.body.movieId;
      const characterId = req.body && req.body.characterId;

      if (!ObjectId.isValid(movieId)) {
        return res.status(404).json({ error: "No movie found" });
      }

      if (!ObjectId.isValid(characterId)) {
        return res.status(404).json({ error: "No Character found" });
      }

      const movies = await MovieModel.find();
      const movie = (movies || []).find(
        (m) => getIdValue(m) === String(movieId),
      );

      if (!movie) {
        return res.status(404).json({ error: "No movie found" });
      }

      const characterExists = (movie.characters || []).some(
        (c) => getIdValue(c) === String(characterId),
      );

      if (!characterExists) {
        return res.status(404).json({ error: "No Character found" });
      }

      movie.characters = (movie.characters || []).filter(
        (c) => getIdValue(c) !== String(characterId),
      );

      await movie.save();

      return res.status(204).send();
    } catch (error) {
      console.error("CharacterDelete error:", error);
      return res.status(500).json({ error: "Database error" });
    }
  },
);
