const { DataTypes, fn, col } = require("sequelize");
const wkx = require("wkx"); // Import wkx to help recognize and handle geometric data

async function getModelAttributes(data, primaryKeycol) {
  const attributes = {};
  const primaryKeys = Object.keys(primaryKeycol);

  for (const [key, value] of Object.entries(data)) {
    const dataType = getDataType(value);
    attributes[key] = { type: mapDataType(dataType) };
    if (dataType === "geometry") {
      data[key] = fn("ST_GeomFromText", value);
    }

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
    case "date":
      return DataTypes.DATE;
    case "geometry":
      return DataTypes.STRING; // Sequelize provides a GEOMETRY data type
    default:
      return DataTypes.STRING; // Default to STRING for unknown types
  }
}

function getDataType(value) {
  // Handle geometric data types
  if (isGeometry(value)) {
    return "geometry";
  }
  if (typeof value === "number") return "number";
  if (typeof value === "string") return "string";
  if (typeof value === "boolean") return "boolean";
  if (value instanceof Date) return "date";

  return "string"; // Default to STRING
}

// Function to check if a value is a geometric type
function isGeometry(value) {
  try {
    const geom = wkx.Geometry.parse(value);
    return geom !== null;
  } catch (error) {
    return false;
  }
}

module.exports = { getModelAttributes };
