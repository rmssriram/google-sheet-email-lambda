const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const { appendToGoogleSheet } = require('./appendToGoogleSheet');

// Load event configuration from event.json
function loadEventConfig() {
  const eventPath = path.join(__dirname, 'event.json');
  return JSON.parse(fs.readFileSync(eventPath, 'utf-8'));
}

// Main function to append data to Google Sheet
async function testAppendGoogleSheet() {
  const { keyFile, spreadsheetId, values } = loadEventConfig();

  // Authenticate using Google API credentials
  const auth = new google.auth.GoogleAuth({
    keyFile,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  try {
    await appendToGoogleSheet(auth, spreadsheetId, values);
    console.log('Data successfully appended to the spreadsheet.');
  } catch (error) {
    console.error('Error appending to Google Sheets or sending email:', error);
  }
}

// Execute the test function
testAppendGoogleSheet();
