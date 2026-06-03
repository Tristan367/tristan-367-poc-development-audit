const makeInjectable = require("../../../helpers/makeInjectable");

function getMatchingCharacters(characters, race) {
  const normalizedInput = String(race).trim().toLowerCase();

  return (characters || []).filter(
    (character) =>
      character &&
      character.race &&
      String(character.race).trim().toLowerCase() === normalizedInput,
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
      const race = req.params && req.params.race;

      if (!race || !String(race).trim()) {
        return res.status(406).json({ error: "Race is required" });
      }

      const movies = await MovieModel.find();
      const matches = (movies || [])
        .map((movie) => {
          const matchingCharacters = getMatchingCharacters(
            movie.characters,
            race,
          );

          if (!matchingCharacters.length) {
            return null;
          }

          return {
            _id: movie._id,
            title: movie.title,
            releaseYear: movie.releaseYear,
            characters: matchingCharacters,
          };
        })
        .filter(Boolean);

      if (!matches.length) {
        return res
          .status(404)
          .json({
            error: `No movie(s) with characters of the ${race} race were found`,
          });
      }

      return res.status(200).json(matches);
    } catch (error) {
      return res.status(500).json({ error: "Database error" });
    }
  },
);
