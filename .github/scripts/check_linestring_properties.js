const fs = require('fs');
const path = require('path');

function checkLineStringProperties(directory) {
  fs.readdirSync(directory).forEach(file => {
    const filePath = path.join(directory, file);

    if (fs.statSync(filePath).isDirectory()) {
      checkLineStringProperties(filePath);
    } else if (file.endsWith('.json')) {
      const content = fs.readFileSync(filePath, 'utf8');
      try {
        const geojson = JSON.parse(content);

        if (geojson.type === 'FeatureCollection') {
          for (const feature of geojson.features) {
            if (feature.geometry.type === 'LineString') {
              const properties = feature.properties || {};

              // 1 - Check if all required properties are present
              const requiredKeys = ['line', 'color', 'name', 'distance', 'status'];
              for (const key of requiredKeys) {
                if (!properties.hasOwnProperty(key)) {
                  console.error(`Missing key '${key}' in LineString properties of file: ${filePath}`);
                  process.exit(1);
                }
              }

              // 2 - Check if status is valid
              const validStatus = ['done', 'wip', 'planned', 'postponed', 'unknown', 'variante', 'variante-postponed'];
              if (!validStatus.includes(properties.status)) {
                console.error(`Invalid status '${properties.status}' in LineString properties of file: ${filePath}`);
                process.exit(1);
              }

              // 3 - Check if all done section have a doneAt property
              if (properties.status === 'done') {
                if (!properties.hasOwnProperty('doneAt')) {
                  console.error(`Missing key 'doneAt' in LineString properties of file: ${filePath}`);
                  process.exit(1);
                }
              }
            }
          }
        }
      } catch (error) {
        console.error(`Error parsing GeoJSON file: ${filePath}`);
        process.exit(1);
      }
    }
  });
}

checkLineStringProperties('content/voies-lyonnaises');
