async function main() {
  console.log(`BEGIN  `);
  // get the client
  const mysql = require('mysql2');
  // create the connection
  // const connection = await mysql.createConnection({ host: '', user: '', database: '' });
  console.log(`222222222222222  `);
  const pool = mysql.createPool({
    host: '',
    user: '',
    password: '',
    database: '',
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
    idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
    queueLimit: 0
  });
  console.log(`connection ==> 1111111111111`);
  // query database
  try {
    const [rows, fields] = pool.execute('SELECT * FROM `table` WHERE `name` = ? AND `age` > ?', ['Morty', 14],
      function (err, rows, fields) {
        console.log(`connection ==> 3333333333333333`);
        if (err) {
          console.log(`[err, err] ==> ${err} | ${err}`);
          return err;
        }
      });
    console.log(`[rows, fields] ==> ${rows} | ${fields}`);
  } catch (err) {
    console.log('connection ==> 44444 || ', err);
    return err;
  }

}
console.log('From main  ', main());