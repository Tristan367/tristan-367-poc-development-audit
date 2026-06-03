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
      const movieId = req.body && req.body._id;
      const charactersToUpdate = req.body && req.body.characters;

      const movies = await MovieModel.find();
      const movie = (movies || []).find(
        (m) => getIdValue(m) === String(movieId),
      );

      if (!movie) {
        return res.status(404).json({ error: "No movie found" });
      }

      const result = {
        _id: movieId,
        characters: [],
      };

      for (const incomingChar of charactersToUpdate || []) {
        const existingChar = (movie.characters || []).find(
          (c) => getIdValue(c) === String(incomingChar._id),
        );

        if (existingChar) {
          if (
            existingChar.name === incomingChar.name &&
            existingChar.race === incomingChar.race
          ) {
            result.characters.push({ ...incomingChar, status: "NOT ADDED" });
          } else {
            existingChar.name = incomingChar.name;
            existingChar.race = incomingChar.race;
            result.characters.push({ ...incomingChar, status: "UPDATED" });
          }
        } else {
          movie.characters.push({
            _id: incomingChar._id,
            name: incomingChar.name,
            race: incomingChar.race,
          });
          result.characters.push({ ...incomingChar, status: "ADDED" });
        }
      }

      await movie.save();

      return res.status(200).json(result);
    } catch (error) {
      console.error("MovieCharactersPut error:", error);
      return res.status(500).json({ error: "Database error" });
    }
  },
);
