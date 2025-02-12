const { DataTypes } = require('sequelize');
const sequelize = require('./db'); // Assuming you have already defined your Sequelize instance

const Task = sequelize.define('Task', {
  TaskID: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ParentID: { type: DataTypes.INTEGER, allowNull: true },
  ExternalID: { type: DataTypes.STRING, allowNull: true },
  Title: { type: DataTypes.STRING, allowNull: false },
  Priority: { type: DataTypes.INTEGER, allowNull: true },
  Risk: { type: DataTypes.INTEGER, allowNull: true },
  AllocatedTo: { type: DataTypes.STRING, allowNull: true },
  CreatedBy: { type: DataTypes.STRING, allowNull: true },
  Category: { type: DataTypes.STRING, allowNull: true },
  Tags: { type: DataTypes.TEXT, allowNull: true }, // Can store JSON or comma-separated values
  Status: { type: DataTypes.STRING, allowNull: true },
  Comments: { type: DataTypes.TEXT, allowNull: true },
  StartDate: { type: DataTypes.DATE, allowNull: true },
  DueDate: { type: DataTypes.DATE, allowNull: true },
  DoneDate: { type: DataTypes.DATE, allowNull: true },
  TimeEstimate: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  TimeSpent: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  Recurrence: { type: DataTypes.TEXT, allowNull: true }, // Can store complex recurrence patterns in JSON or text format
  Dependencies: { type: DataTypes.TEXT, allowNull: true }, // Can store comma-separated task IDs
  Cost: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  FileLink: { type: DataTypes.TEXT, allowNull: true },
  Version: { type: DataTypes.INTEGER, allowNull: true },
  Color: { type: DataTypes.STRING, allowNull: true },
  PercentComplete: { type: DataTypes.DECIMAL(5, 2), allowNull: true },
  Flagged: { type: DataTypes.BOOLEAN, defaultValue: false },
  Locked: { type: DataTypes.BOOLEAN, defaultValue: false },
  CustomAttributes: { type: DataTypes.TEXT, allowNull: true } // Custom attributes can be stored in JSON format
}, { schema: "todolist", tableName: "tasks" });

// Task associations, if needed
Task.hasMany(Task, { as: 'Subtasks', foreignKey: 'ParentID' });

module.exports = Task;
