// This line requires the models
var db = require("../models");

// This is the routes
module.exports = function (app) {
  // Get all users
  app.get("/api/user", function (req, res) {
    db.User.findAll({}).then(function (data) {
      res.json(data);
    });
  });
  //to get all the story data
  app.get("/api/reader", function (req, res) {
    db.Story.findAll({}).then(function (data) {

      res.json(data);
    });
  });
  //to get all the story data - trial 2
  app.get("/stories", function (req, res) {
    // findAll returns all entries for a table when used with no options
    db.Story.findAll({}).then(function (data) {
      console.log(data);
      // We have access to the todos as an argument inside of the callback function
      var storyObject = {
        stories: data,
        msg: "Reader Homepage"
      };
      res.render("reader", storyObject);

    });
  });

  //============================ Story API Routes ==============================//

  // POST route for creating a new story
  app.post("/api/compose", function (req, res) {
    db.Story.create(req.body).then(function (dbStory) {
      res.json(dbStory);
    });
  });

  // GET route for getting all of the stories
  app.get("/api/compose", function (req, res) {
    db.Story.findAll({}).then(function (dbStory) {
      res.json(dbStory);
    });
  });

  // GET route for retrieving a single story
  app.get("/api/compose/:id", function (req, res) {
    db.Story.findOne({
      where: {
        id: req.params.id
      }
    }).then(function (dbStory) {
      res.json(dbStory);
    });
  });

  // DELETE route for deleting a story by id
  app.delete("/api/compose/:id", function (req, res) {
    db.Story.destroy({
      where: {
        id: req.params.id
      }
    }).then(function (dbStory) {
      res.json(dbStory);
    });
  });

  // PUT route for updating a story
  app.put("/api/compose", function (req, res) {
    db.Story.update(req.body, {
      where: {
        id: req.body.id
      }
    }).then(function (dbStory) {
      res.json(dbStory);
    });
  });

  //============================ Story API Routes ==============================//

  app.get("/api/login/:email", function (req, res) {
    db.user
      .findOne({
        where: {
          email_address: req.params.email
        }
      })
      .then(function (dbUser) {
        console.log(dbUser.dataValues);
        res.json(dbUser.dataValues);
      });
  });

  // Submitting sign up information
  app.post("/api/signup", function (req, res) {
    db.user
      .create({
        pass: req.body.pass,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email_address: req.body.email_address
      })
      .then(function (dbUser) {
        res.json(dbUser);
      });
  });
};
