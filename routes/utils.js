// utils.js

const { DataTypes } = require("sequelize"); // Import DataTypes from Sequelize

function getModelAttributes(data, primaryKeycol) {
  const attributes = {};
  const primaryKeys = Object.keys(primaryKeycol);
  for (const [key, value] of Object.entries(data)) {
    attributes[key] = { type: mapDataType(getDataType(value)) };

    if (primaryKeys.includes(key)) {
      attributes[key].primaryKey = true;
    }
  }
  return attributes;
}

function mapDataType(dataType) {
  switch (dataType) {
    case "number":
      return DataTypes.INTEGER;
    case "string":
      return DataTypes.STRING;
    case "boolean":
      return DataTypes.BOOLEAN;
    case "object": // Handle dates and other types
      return DataTypes.DATE;
    default:
      return DataTypes.STRING; // Default to STRING for unknown types
  }
}

function getDataType(value) {
  if (typeof value === "number") return "number";
  if (typeof value === "string") return "string";
  if (typeof value === "boolean") return "boolean";
  if (value instanceof Date) return "object";
  return "string"; // Default to STRING
}

module.exports = { getModelAttributes };
