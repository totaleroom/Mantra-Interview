const fs = require('fs').promises;
const path = require('path');

const DB_FILE = path.join(__dirname, 'database.json');

async function getDbData() {
  try {
    const data = await fs.readFile(DB_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') {
      const initialData = { users: [], profiles: [] };
      await saveDbData(initialData);
      return initialData;
    }
    throw err;
  }
}

async function saveDbData(data) {
  await fs.writeFile(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Ensure it's created
getDbData().catch(err => console.error(err));

module.exports = {
  getDbData,
  saveDbData
};
