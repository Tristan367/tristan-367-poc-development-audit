const path = require("path");
const fs = require("fs");
const YAML = require("js-yaml");
const asExpressRoute = require("./asExpressRoute");

/**
 * Dig through a directory to find all route configs (recursively searches nested folders).
 */
module.exports = function findRoutes(directory) {
  directory = path.resolve(directory);

  const routes = [];

  function searchDirectory(dir) {
    for (const file of fs.readdirSync(dir)) {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);

      if (stats.isDirectory()) {
        const entrypoint = path.join(filePath, "index.js");
        const configPath = path.join(filePath, "route.yaml");

        if (fs.existsSync(configPath)) {
          const config = YAML.load(fs.readFileSync(configPath));

          routes.push({
            name: file,
            entrypoint,
            method: config.method.trim().toUpperCase(),
            route: asExpressRoute(config.route),
          });
        } else {
          // No route.yaml in this folder, search subdirectories
          searchDirectory(filePath);
        }
      }
    }
  }

  searchDirectory(directory);

  routes.sort((a, b) => {
    if (a.route < b.route) {
      return -1;
    } else if (a.route > b.route) {
      return +1;
    } else {
      return 0;
    }
  });

  return routes;
};
