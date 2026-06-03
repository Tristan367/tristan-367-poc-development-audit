const makeInjectable = require("../../../helpers/makeInjectable");

module.exports = makeInjectable(
  {
    defaults: {
      MovieModel: () => require("../models/movie"),
    },
  },
  async function ({ MovieModel }, req, res) {
    try {
      const movies = await MovieModel.find();
      const sorted = (movies || [])
        .slice()
        .sort((a, b) => (a.releaseYear || 0) - (b.releaseYear || 0));

      const seen = new Set();
      const characters = [];

      for (const movie of sorted) {
        for (const character of movie.characters || []) {
          if (!seen.has(character.name)) {
            seen.add(character.name);
            characters.push({
              name: character.name,
              race: character.race,
            });
          }
        }
      }

      return res.status(200).json(characters);
    } catch (error) {
      console.error("MoviesAllCharactersGet error:", error);
      return res.status(500).json({ error: "Database error" });
    }
  },
);
