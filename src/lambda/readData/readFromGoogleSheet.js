const { google } = require('googleapis');

// Function to read data from Google Sheet
async function readFromGoogleSheet(auth, spreadsheetId) {
  const sheets = google.sheets({ version: 'v4', auth });
  const range = 'Events!A:Z';

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range,
    });
    const rows = response.data.values;
    return rows || [];
  } catch (err) {
    console.error('Error reading from Google Sheet:', err);
    return [];
  }
}

module.exports = { readFromGoogleSheet };
