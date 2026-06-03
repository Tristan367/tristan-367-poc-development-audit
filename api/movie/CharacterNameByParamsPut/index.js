const makeInjectable = require("../../../helpers/makeInjectable");

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
      const { movieId, characterId, characterName } = req.params || {};

      if (!characterName || String(characterName).trim().length < 3) {
        return res.status(406).json({
          error:
            "Character Name is not valid. It must be at least three characters.",
        });
      }

      const movies = await MovieModel.find();
      const movie = (movies || []).find(
        (m) => getIdValue(m) === String(movieId),
      );

      if (!movie) {
        return res.status(404).json({ error: "Movie not found for id >" });
      }

      const character = (movie.characters || []).find(
        (c) => getIdValue(c) === String(characterId),
      );

      if (!character) {
        return res.status(404).json({ error: "Character not found for id >" });
      }

      character.name = String(characterName).trim();
      await movie.save();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({ error: "Database error" });
    }
  },
);
