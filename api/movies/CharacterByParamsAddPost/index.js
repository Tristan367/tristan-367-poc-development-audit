const makeInjectable = require("../../../helpers/makeInjectable");
const { ObjectId } = require("mongodb");

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
      const movieId = req.params && req.params.movie_id;
      const characterName = req.params && req.params.mainCharacterName;

      if (!characterName || String(characterName).trim().length < 3) {
        return res
          .status(406)
          .json({
            error:
              "Main Character Name is not valid. It must be at least three characters.",
          });
      }

      const movies = await MovieModel.find();
      const movie = (movies || []).find(
        (item) => getIdValue(item) === String(movieId),
      );

      if (!movie) {
        return res.status(404).json({ error: "No movie found" });
      }

      const newCharacter = {
        _id: new ObjectId(),
        name: characterName,
      };

      movie.characters = movie.characters || [];
      movie.characters.push(newCharacter);

      await movie.save();

      return res.status(200).json(movie);
    } catch (error) {
      return res.status(500).json({ error: "Database error" });
    }
  },
);
