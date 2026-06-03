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
      const characterName = req.params && req.params.characterName;

      if (!movieId) {
        return res.status(406).json({ error: "Movie ID is required" });
      }

      if (!characterName) {
        return res.status(406).json({ error: "Character name is required" });
      }

      const movies = await MovieModel.find();
      const movie = (movies || []).find(
        (item) => getIdValue(item) === String(movieId),
      );

      if (!movie) {
        return res.status(404).json({ error: "No movie found" });
      }

      const normalizedCharName = String(characterName).trim().toLowerCase();
      const character = (movie.characters || []).find(
        (c) =>
          c &&
          c.name &&
          String(c.name).trim().toLowerCase() === normalizedCharName,
      );

      if (!character) {
        return res.status(404).json({ error: "No character found" });
      }

      return res.status(200).json({
        movie: movie.title,
        name: character.name,
        race: character.race,
      });
    } catch (error) {
      return res.status(500).json({ error: "Database error" });
    }
  },
);
