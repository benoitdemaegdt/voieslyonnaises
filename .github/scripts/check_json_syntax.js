const fs = require('fs');
const path = require('path');

function checkJsonFiles(directory) {
  fs.readdirSync(directory).forEach(file => {
    const filePath = path.join(directory, file);

    if (fs.statSync(filePath).isDirectory()) {
      checkJsonFiles(filePath);
    } else if (file.endsWith('.json')) {
      try {
        JSON.parse(fs.readFileSync(filePath));
        console.log(`JSON file is valid: ${filePath}`);
      } catch (error) {
        console.error(`Invalid JSON file: ${filePath}`);
        process.exit(1);
      }
    }
  });
}

checkJsonFiles('content');
