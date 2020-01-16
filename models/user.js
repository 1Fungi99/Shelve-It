module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    first_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [2, 50]
      }
    },
    pass: {
      type: DataTypes.STRING,
      allowNull: true,
      validate: {
        len: [1, 50]
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
    },
    logged_in: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  });

  // ====> "Commented out Temporarily to Test Form Submissions to database"- Emir <====
  // User.associate = function (models) {
  //   User.hasMany(models.Story, {
  //     onDelete: "cascade",
  //     foreignKey: "author_id"
  //   });
  // };
  return User;
};
