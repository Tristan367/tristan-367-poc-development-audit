const makeInjectable = require("../../../helpers/makeInjectable");

function getCharacterNameMatch(characters, characterName) {
  const normalizedInput = String(characterName).trim().toLowerCase();

  return (characters || []).some(
    (character) =>
      character &&
      character.name &&
      String(character.name).trim().toLowerCase() === normalizedInput,
  );
}

module.exports = makeInjectable(
  {
    defaults: {
      MovieModel: () => require("../models/movie"),
    },
  },
  async function ({ MovieModel }, req, res) {
    try {
      const characterName = req.params && req.params.characterName;

      if (!characterName || !String(characterName).trim()) {
        return res.status(406).json({ error: "Character name is required" });
      }

      const movies = await MovieModel.find();
      const matchingMovies = (movies || [])
        .filter((movie) =>
          getCharacterNameMatch(movie.characters, characterName),
        )
        .map((movie) => ({
          _id: movie._id,
          title: movie.title,
          releaseYear: movie.releaseYear,
        }));

      if (!matchingMovies.length) {
        return res
          .status(404)
          .json({ error: "No movie(s) with this Character were found" });
      }

      return res.status(200).json(matchingMovies);
    } catch (error) {
      return res.status(500).json({ error: "Database error" });
    }
  },
);
