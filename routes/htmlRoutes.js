var db = require("../models");

module.exports = function (app) {
  // Load home page
  app.get("/", function (req, res) {
    db.User.findAll({}).then(function (data) {
      res.render("index", {
      });
    });
  });

  // Load author page for user
  app.get("/compose", function (req, res) {
    res.render("compose", {
    });
  });

  //Load Reader page for user
  app.get("/reader", function (req, res) {
    res.render("reader", {
      msg: "this is the reader homepage"
    });
  });

  // Render 404 page for any unmatched routes
  app.get("*", function (req, res) {
    res.render("404");
  });

};
