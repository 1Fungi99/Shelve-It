var db = require("../models");

module.exports = function (app) {
  // Get all examples
  app.get("/api/user", function (req, res) {
    db.User.findAll({}).then(function (data) {
      res.json(data);
    });
  });

  // Create a new story
  app.post("/api/compose", function (req, res) {
    db.Story.create(req.body).then(function (dbStory) {
      res.json(dbStory);
    });
  });

  // Delete an example by id
  app.delete("/api/examples/:id", function (req, res) {
    db.Example.destroy({ where: { id: req.params.id } }).then(function (dbExample) {
      res.json(dbExample);
    });
  });
};
