const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as needed
const Recipe = require('./Recipe'); // Adjust the path as needed

class Category extends Model {}

Category.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    description: {
      type: DataTypes.TEXT,
    },
    // Add other attributes as needed
  },
  {
    sequelize,
    modelName: 'Category',
    tableName: 'categories', // Specify the table name if it doesn't match the model name
    timestamps: true, // If your table has 'createdAt' and 'updatedAt' fields
  }
);

// Define associations
Category.belongsToMany(Recipe, { through: 'RecipeCategories', foreignKey: 'categoryId' });
Recipe.belongsToMany(Category, { through: 'RecipeCategories', foreignKey: 'recipeId' });

module.exports = Category;
