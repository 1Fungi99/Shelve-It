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
      console.log(data)
      // We have access to the todos as an argument inside of the callback function
      var storyObject = {
        stories: data
      };
      res.render("reader", storyObject);
    });
  });

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

  // DELETE route for deleting a story by id
  app.delete("/api/compose/:id", function (req, res) {
    db.Story.destroy({
      where: {
        id: req.params.id
      }
    }).then(function () {
      res.end();
    });
  });

  // PUT route for updating a story
  app.put("/api/compose", function (req, res) {
    db.Story.update({
      title: req.body.title,
      storyText: req.body.storyText,
      category: req.body.category,
      storyType: req.body.storyType
    },
      {
        where: {
          id: req.body.id
        }
      }).then(function () {
        res.end();
      });
  });

  // Submitting sign up information
  app.post("/api/new", function (req, res) {

    console.log('Login data collected: ' + req.body);

    User.create({
      username: req.body.username,
      pass: req.body.pass,
      fname: req.body.fname,
      middle_initial: req.body.middle_initial,
      last_name: req.body.last_name,
      email_address: req.body.email_address,
      description: req.body.description

    });

  });
};
