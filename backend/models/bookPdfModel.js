const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");
const Book = require("./booksModel");

const BookPdf = sequelize.define(
  "book_pdfs",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
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

// Remove or comment out these lines:
// BookPdf.belongsTo(Book, { foreignKey: "book_id" });
// Book.hasMany(BookPdf, { foreignKey: "book_id" });

module.exports = BookPdf;
