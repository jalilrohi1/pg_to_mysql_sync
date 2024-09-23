function getType(value) {
  // Determine the basic data type
  if (typeof value === "number") return "number";
  if (typeof value === "string") return "string";
  if (typeof value === "boolean") return "boolean";
  if (value instanceof Date) return "object";
  //if (isWKT(value)) return "wkt"; // Check if it's WKT

  // Determine the Postgres geometry type
  if (value.x !== undefined && value.y !== undefined) return "point";
  if (Array.isArray(value) && value.length === 2 && value[0].x !== undefined)
    return "lseg";
  if (value.center !== undefined && value.radius !== undefined) return "circle";
  if (Array.isArray(value) && value.length > 2 && value[0].x !== undefined)
    return "polygon";
  if (value.start !== undefined && value.end !== undefined) return "line";
  if (Array.isArray(value) && value.length === 4 && value[0].x !== undefined)
    return "box";

  // Default to STRING if no other type matches
  return "string";
}

// Example usage
console.log(getType(42)); // "number"
console.log(getType("hello")); // "string"
console.log(getType(true)); // "boolean"
console.log(getType(new Date())); // "object"
console.log(getType({ x: 1, y: 2 })); // "point"
console.log(getType([{ x: 1, y: 2 },{ x: 3, y: 4 },])); // "lseg"
console.log(getType({ center: { x: 1, y: 2 }, radius: 5 })); // "circle"
console.log(getType([{ x: 1, y: 2 },{ x: 3, y: 4 },{ x: 5, y: 6 },])); // "polygon"
console.log(getType({ start: { x: 1, y: 2 }, end: { x: 3, y: 4 } })); // "line"
console.log(getType([{ x: 1, y: 2 },{ x: 3, y: 4 },{ x: 5, y: 6 },{ x: 7, y: 8 },])); // "box"
