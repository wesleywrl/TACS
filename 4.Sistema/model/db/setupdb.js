// Require or import the dependencies
const dotenv = require('dotenv');
const result = dotenv.config();
const fs = require('fs');
const { Pool } = require('pg')
const connectionString = process.env.DB_URL;

console.log('DB URL:', process.env.DB_URL)

const pool = new Pool({
  connectionString,
});

// Read the SQL file
const dataSql = fs.readFileSync('./model/db/migration.sql').toString();

// Convert the SQL string to array so that you can run them one at a time.
// You can split the strings using the query delimiter i.e. `;`
const dataArr = dataSql.toString().split(';');

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack)
  }

  dataArr.forEach((query) => {
    if(query) {
      // Add the delimiter back to each query before you run them
      query += ';';
  
      client.query(query, (err) => {
        if (err) throw err;
      });
    }
  });

  release()
  return console.error('Perhaps successfully executed query.');
});