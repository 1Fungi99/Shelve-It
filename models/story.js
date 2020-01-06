
module.exports = function (sequelize, DataTypes) {
  var Story = sequelize.define("Story", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [1, 80] // "Title range is from 1 character to 80 max"- Emir
      }
    },
    storyText: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        len: [101] // "Minimun character length set to 101 characters"- Emir
      }
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
      defaultValue: "English" // "Current build is only for English, default value is English"- Emir
    },
    author: {
      type: DataTypes.STRING,
      defaultValue: "Anonymous" // "Need to figure out how to have the defaultValue be the User after they log in"- Emir
    },
    draft: { // "This will default to true everytime a new story is saved as draft, will be false if story is published" - Emir
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    }

  }, {
    freezeTableName: true // Model tableName will be the same as the model name
  }

  );
  // ====> "Commented out Temporarily to Test Form Submissions to database"- Emir <====
  // Story.associate = function (models) {
  //   // We're saying that a Story should belong to an Author
  //   // A Story can't be created without an Author due to the foreign key constraint
  //   Story.belongsTo(models.User, {
  //     foreignKey: {
  //       allowNull: false
  //     }
  //   });
  // };

  return Story;
};
