module.exports = function(sequelize, DataTypes) {
  var users = sequelize.define("users", {
    username: {
      type: STRING,
      validate: {
        len: [1, 50]
      }
    },
    pass: {
      type: STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    first_name: {
      type: STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    middle_initial: {
      type: STRING,
      validate: {
        len: [1]
      },
      allowNull: true
    },
    last_name: {
      type: STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    email_address: {
      type: STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    description: {
      type: STRING,
      allowNull: true,
      validate: {
        len: [1, 2000]
      }
    }
  });
  return users;
};
