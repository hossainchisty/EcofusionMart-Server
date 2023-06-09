// Basic Lib Imports
const app = require('./app');

const port = process.env.PORT || 8000;

const fs = require('fs');
const path = require('path');

// Create 'logs' directory if it doesn't exist
const logsDirectory = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDirectory)) {
  fs.mkdirSync(logsDirectory);
}


app.listen(port, () => console.log(`Server started on port http://127.0.0.1:${port}/`));