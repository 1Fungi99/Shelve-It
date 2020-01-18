module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("user", {
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
  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  });


  User.associate = function (models) {
    User.hasMany(models.Story, {
      onDelete: "cascade"
    });

  };
  return User;
};
