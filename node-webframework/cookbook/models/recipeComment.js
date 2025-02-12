const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as needed
const Recipe = require('./Recipe'); // Adjust the path as needed
const User = require('../users/User'); // Adjust the path as needed

class RecipeComment extends Model {}

RecipeComment.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    recipeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Recipe,
        key: 'id',
      },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: User,
        key: 'id',
      },
    },
    // Add other attributes as needed
  },
  {
    sequelize,
    modelName: 'RecipeComment',
    tableName: 'recipe_comments',
    timestamps: true, // If your table has 'createdAt' and 'updatedAt' fields
  }
);

// Define associations
RecipeComment.belongsTo(Recipe, { foreignKey: 'recipeId' });
Recipe.hasMany(RecipeComment, { foreignKey: 'recipeId' });

RecipeComment.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(RecipeComment, { foreignKey: 'userId' });

module.exports = RecipeComment;
