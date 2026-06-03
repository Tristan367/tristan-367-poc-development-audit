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
      const id = req.params && req.params.id;

      if (!id) {
        return res.status(406).json({ error: "Movie _id is required" });
      }

      const movies = await MovieModel.find();
      const movie = (movies || []).find(
        (item) => getIdValue(item) === String(id),
      );

      if (!movie) {
        return res.status(404).json({ error: "No movie found" });
      }

      return res.status(200).json(movie);
    } catch (error) {
      return res.status(500).json({ error: "Database error" });
    }
  },
);
