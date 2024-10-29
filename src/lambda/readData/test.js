const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { readFromGoogleSheet } = require('./readFromGoogleSheet');

// Load event configuration from event.json
function loadEventConfig() {
  try {
    const eventPath = path.join(__dirname, 'event.json');
    const event = JSON.parse(fs.readFileSync(eventPath, 'utf-8'));
    return event;
  } catch (error) {
    console.error('Error loading event.json:', error);
    process.exit(1);
  }
}

// Main function to read and print Google Sheet data
async function testReadGoogleSheet() {
  const { keyFile, spreadsheetId } = loadEventConfig();

  // Authenticate using Google API credentials
  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  try {
    // Call the function to read data from Google Sheets
    const rows = await readFromGoogleSheet(auth, spreadsheetId);
    console.log('Data in Spreadsheet:', rows);
  } catch (error) {
    console.error('Error reading from Google Sheets:', error);
  }
}

// Execute the test function
testReadGoogleSheet();
