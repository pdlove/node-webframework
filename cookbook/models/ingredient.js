const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as needed
const Recipe = require('./Recipe'); // Adjust the path as needed

class Ingredient extends Model {}

Ingredient.init(
  {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    recipeId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Recipe,
        key: 'id',
      },
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.FLOAT,
      allowNull: true,
    },
    unit: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    // Add other attributes as needed
  },
  {
    sequelize,
    modelName: 'Ingredient',
    tableName: 'ingredients',
    timestamps: true, // If your table has 'createdAt' and 'updatedAt' fields
  }
);

// Define associations
Ingredient.belongsTo(Recipe, { foreignKey: 'recipeId' });
Recipe.hasMany(Ingredient, { foreignKey: 'recipeId' });

module.exports = Ingredient;
