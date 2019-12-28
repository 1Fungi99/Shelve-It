
module.exports = function (sequelize, DataTypes) {
  var Story = sequelize.define("Story", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1]
      }
    },
    story: {
      type: DataTypes.TEXT,
      allowNull: false,
      len: [1]
    },
    draft: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      validate: {
        len: [1]
      }
    },
    submitted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    category: {
      type: DataTypes.STRING,
      defaultValue: "Other"
    },
    storyType: {
      type: DataTypes.STRING,
      defaultValue: "Other"
    },
    language: {
      type: DataTypes.STRING,
      defaultValue: "English"
    },
    author: {
      type: DataTypes.STRING,
      defaultValue: "Anonymous"
    }

  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  }

  );

  Story.associate = function (models) {
    // We're saying that a Post should belong to an Author
    // A Post can't be created without an Author due to the foreign key constraint
    Story.belongsTo(models.User, {
      foreignKey: {
        allowNull: false
      }
    });
  };

  return Story;
};
