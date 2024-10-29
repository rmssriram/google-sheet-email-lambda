const fs = require('fs');
const { google } = require('googleapis');

async function appendToGoogleSheet(auth, spreadsheetId, values) {
  const sheets = google.sheets({ version: 'v4', auth });
  const range = 'Events!A:Z';

  const request = {
    spreadsheetId,
    range,
    valueInputOption: 'RAW',
    insertDataOption: 'INSERT_ROWS',
    resource: {
      values: [values],
    },
  };

  try {
    const response = await sheets.spreadsheets.values.append(request);
    console.log(`Appended: ${response.data.updates.updatedRange}`);
  } catch (err) {
    console.error('Error appending to Google Sheet or sending email:', err);
  }
}

module.exports = { appendToGoogleSheet };
