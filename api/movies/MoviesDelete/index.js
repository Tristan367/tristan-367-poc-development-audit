const makeInjectable = require("../../../helpers/makeInjectable");

module.exports = makeInjectable(
  {
    defaults: {
      MovieModel: () => require("../models/movie"),
    },
  },
  async function ({ MovieModel }, req, res) {
    try {
      await MovieModel.deleteMany({});
      return res.status(204).send();
    } catch (error) {
      console.error("MoviesDelete error:", error);
      return res.status(500).json({ error: "Database error" });
    }
  },
);
