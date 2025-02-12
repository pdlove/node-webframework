const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as needed

class Recipe extends Model {}

Recipe.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    // Add other attributes as needed
  },
  {
    sequelize,
    modelName: 'Recipe',
    tableName: 'recipes', // Specify the table name if it doesn't match the model name
    timestamps: true, // If your table has 'createdAt' and 'updatedAt' fields
  }
);

module.exports = Recipe;



