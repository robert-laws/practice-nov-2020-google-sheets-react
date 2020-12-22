import { useState, useEffect } from 'react';
import './App.scss';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { uuid } from 'uuidv4';

const App = () => {
  const SPREADSHEET_ID = process.env.REACT_APP_SPREADSHEET_ID;
  const SHEET_ID = process.env.REACT_APP_SHEET_ID;
  const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_CLIENT_EMAIL;
  const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_SERVICE_PRIVATE_KEY;

  const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

  const [sheetRows, getSheetRows] = useState([]);

  // const connectSheet = async () => {
  //   try {
  //     // await doc.useServiceAccountAuth(
  //     //   require('./practice-nov-2020-sheet-demo-0613c940e254.json')
  //     // );
  //     await doc.useServiceAccountAuth({
  //       client_email: CLIENT_EMAIL,
  //       private_key: PRIVATE_KEY,
  //     });

  //     await doc.loadInfo(); // loads document properties and worksheets
  //     console.log(doc.title);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // connectSheet();

  useEffect(() => {
    const getRows = async () => {
      try {
        await doc.useServiceAccountAuth({
          client_email: CLIENT_EMAIL,
          private_key: PRIVATE_KEY,
        });

        await doc.loadInfo();
        const sheet = doc.sheetsById[SHEET_ID];
        const rows = await sheet.getRows();
        getSheetRows(rows);
        console.log(rows);
      } catch (error) {
        console.log(error);
      }
    };

    getRows();
  }, []);

  const appendSpreadsheet = async (row) => {
    try {
      await doc.useServiceAccountAuth({
        client_email: CLIENT_EMAIL,
        private_key: PRIVATE_KEY,
      });
      // loads document properties and worksheets
      await doc.loadInfo();

      const sheet = doc.sheetsById[SHEET_ID];
      await sheet.addRow(row);
    } catch (e) {
      console.error('Error: ', e);
    }
  };

  const addNewRow = (row) => {
    const newRow = {
      id: uuid(),
      location_id: 2,
      menu_id: 2,
      date: '12/23/2020',
      time: 22,
      quantity: 4,
      drive_thru: false,
    };

    appendSpreadsheet(newRow);
  };

  return (
    <div className='App'>
      <h1>Google Sheets and React</h1>
      <hr />
      {sheetRows.length > 0 &&
        sheetRows.map((item) => <p key={item.id}>{item.time}</p>)}
      <hr />
      <button onClick={addNewRow}>Add Row</button>
    </div>
  );
};

export default App;
