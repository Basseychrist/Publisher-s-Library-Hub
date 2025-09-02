const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // adjust path if needed

const Book = sequelize.define(
  "Book",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: DataTypes.STRING,
    author: DataTypes.STRING,
    description: DataTypes.TEXT,
    created_by: DataTypes.INTEGER, // Use this if your table uses created_by
    created_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    user_id: DataTypes.INTEGER, // Optional, if you use it elsewhere
  },
  {
    tableName: "books",
    timestamps: false,
  }
);

module.exports = Book;
