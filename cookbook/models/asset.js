const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/database'); // Adjust the path as needed
const Recipe = require('./Recipe'); // Adjust the path as needed

class Asset extends Model {}

Asset.init(
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
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contentType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Add other attributes as needed
  },
  {
    sequelize,
    modelName: 'Asset',
    tableName: 'assets', // Specify the table name if it doesn't match the model name
    timestamps: true, // If your table has 'createdAt' and 'updatedAt' fields
  }
);

// Define associations
Asset.belongsTo(Recipe, { foreignKey: 'recipeId' });
Recipe.hasMany(Asset, { foreignKey: 'recipeId' });

module.exports = Asset;
