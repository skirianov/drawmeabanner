export const convertArrayToMap = (coordinatesArray) => {
  const coordinatesMap = new Map();
  coordinatesArray.forEach((coordinate) => {
    coordinatesMap.set(coordinate.id, coordinate);
  });
  return coordinatesMap;
}