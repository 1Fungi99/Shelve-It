module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("user", {
    pass: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 50]
      }
    },
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    last_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    email_address: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [10, 50]
      }
    }
  });

  // ====> "Commented out Temporarily to Test Form Submissions to database"- Emir <====
  // user.associate = function (models) {
  //   user.hasMany(models.Story, {
  //     onDelete: "cascade"

  //   });

  // }
  return User;
};
