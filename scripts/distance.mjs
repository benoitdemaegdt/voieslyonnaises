import fs from 'fs';
import path from 'path';

/**
 * Ce script permet de faire les health check sur les distances
 *
 * required : NodeJS >= 18
 * run : node ./scripts/distance.mjs
 */

(async () => {
  const voies = getVoies();
  const sections = getSections(voies)

  for (const section of sections) {
    const distance = section.properties.distance;
    const computedDistance = getLineStringDistance(section.geometry);
    if (Math.abs(distance - computedDistance) > 100) {
      console.log({name: section.properties.name, line: section.properties.line, distance, computedDistance})
    }
  }
})();

function getVoies() {
  const directoryPath = './content/voies-lyonnaises';
  const files = fs.readdirSync(directoryPath).filter(file => file.endsWith('.json'));

  return files.map(file => {
    const filePath = path.join(directoryPath, file);
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  });
}

function getSections(voies) {
  return voies
    .map(voie => voie.features)
    .flat()
    .filter(feature => feature.geometry.type === 'LineString')
}

function haversine(lat1, lon1, lat2, lon2) {
  // Convert latitude and longitude from degrees to radians
  const toRadians = (angle) => (angle * Math.PI) / 180;
  lat1 = toRadians(lat1);
  lon1 = toRadians(lon1);
  lat2 = toRadians(lat2);
  lon2 = toRadians(lon2);

  // Haversine formula
  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.asin(Math.sqrt(a));

  // Radius of the Earth in meters
  const radius = 6371000;

  // Calculate the distance in meters
  return Math.round(radius * c);
}

function getLineStringDistance(lineString) {
  let distance = 0;
  const coordinates = lineString.coordinates;

  for (let i = 0; i < coordinates.length - 1; i++) {
    const [lon1, lat1] = coordinates[i];
    const [lon2, lat2] = coordinates[i + 1];
    distance += haversine(lat1, lon1, lat2, lon2);
  }

  return distance;
}