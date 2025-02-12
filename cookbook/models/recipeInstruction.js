const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as needed
const Recipe = require('./Recipe'); // Adjust the path as needed

class RecipeInstruction extends Model {}

RecipeInstruction.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    recipeId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Recipe,
        key: 'id',
      },
      field: 'recipe_id',
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    text: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    // Add other attributes as needed
  },
  {
    sequelize,
    modelName: 'RecipeInstruction',
    tableName: 'recipe_instructions',
    timestamps: true, // If your table has 'createdAt' and 'updatedAt' fields
  }
);

// Define associations
RecipeInstruction.belongsTo(Recipe, { foreignKey: 'recipeId' });
Recipe.hasMany(RecipeInstruction, { foreignKey: 'recipeId' });

module.exports = RecipeInstruction;
