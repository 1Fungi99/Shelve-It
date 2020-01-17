var db = require("../models");

module.exports = function (app) {
  // Load home page
  app.get("/", function (req, res) {
    db.user.findAll({}).then(function (data) {
      res.render("index", {});
    });
  });

  // Load author page for user
  app.get("/compose", function (req, res) {
    db.Story.findAll({}).then(function (dbStory) {
      res.render("compose", {
        stories: dbStory
      });
    });
  });

  //Load Reader page for user
  app.get("/stories", function (req, res) {
    res.render("reader", {
      msg: "Reader Homepage"
    });
  });

  // app.get("/about-us", function(req, res) {
  //   res.render("about-us");
  // });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });
};
