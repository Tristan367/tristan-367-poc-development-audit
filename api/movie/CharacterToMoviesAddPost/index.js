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
      const movies = req.body && req.body.movies;
      const characterToAdd = req.body && req.body.characterToAdd;

      if (
        !characterToAdd ||
        !characterToAdd.id ||
        !characterToAdd.name ||
        !characterToAdd.race
      ) {
        return res
          .status(406)
          .json({ error: "Your character can not be added." });
      }

      const allMovies = await MovieModel.find();

      for (const movieId of movies || []) {
        const movie = (allMovies || []).find(
          (m) => getIdValue(m) === String(movieId),
        );

        if (!movie) continue;

        const alreadyExists = (movie.characters || []).some(
          (c) => getIdValue(c) === String(characterToAdd.id),
        );

        if (alreadyExists) continue;

        movie.characters = movie.characters || [];
        movie.characters.push({
          _id: characterToAdd.id,
          name: characterToAdd.name,
          race: characterToAdd.race,
        });

        await movie.save();
      }

      return res.status(201).send();
    } catch (error) {
      return res.status(500).json({ error: "Database error" });
    }
  },
);
