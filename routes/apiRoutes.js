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
  //join data with Story and User tables
  app.get("/api/name", function (req, res) {
    db.Story.findAll({ include: [db.User] }).then(function (data) {
      res.json(data);
    });
  });
  //to get all the story data
  app.get("/api/reader", function (req, res) {
    db.Story.findAll({}).then(function (data) {
      res.json(data);
    });
  });

  // GET route for getting all of the posts with user association
  app.get("/api/masterpieces", function (req, res) {
    let query = {};
    if (req.query.user_id) {
      query.UserId = req.query.user_id;
    }
    // Join here to include users to their posts
    db.Story.findAll({
      where: query,
      include: [db.User]
    }).then(function (dbStory) {
      res.json(dbStory);
    });
  });
  //============================ Story API Routes Below ==============================//

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
      },
      include: [db.User]
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

  //============================ Story API Routes Above ==============================//
  app.get("/api/data/:email", function (req, res) {
    db.user
      .findOne({
        where: {
          email_address: req.params.email
        }
      })
      .then(function (dbUser) {
        console.log(dbUser);
        res.json(dbUser);
      });
  });

  app.get("/api/login/:email", function (req, res) {
    db.user
      .findOne({
        where: {
          email_address: req.params.email
        }
      })
      .then(function (dbUser) {
        console.log(dbUser);
        res.json(dbUser);
      });
  });

  // Submitting sign up information
  app.post("/api/signup", function (req, res) {
    db.User
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
