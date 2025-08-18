const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Book = require("./booksModel");

const BookPdf = sequelize.define(
  "BookPdf",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    book_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "books",
        key: "id",
      },
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    filepath: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    uploaded_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },
    uploaded_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "book_pdfs",
    timestamps: false,
  }
);

BookPdf.belongsTo(Book, { foreignKey: "book_id" });
Book.hasMany(BookPdf, { foreignKey: "book_id" });

module.exports = BookPdf;
