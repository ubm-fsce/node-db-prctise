var mysql = require('mysql2');

const sql1 = 'select * from catalog_short';
const sql2 = 'desc catalog_short';
const sql3 = 'select * from catalog_short where record_key=?';
const sql4 =
  'INSERT into catalog_short(record_key, payload, status, creation_date) values (?,?,?,?)';

const pool = mysql.createPool({
  host: '',
  user: '',
  database: '',
  password: '',
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10, // max idle connections, the default value is the same as `connectionLimit`
  idleTimeout: 60000, // idle connections timeout, in milliseconds, the default value 60000
  queueLimit: 0,
});

async function selectAll(sqlqry) {
  console.log('11111', ' Query : ', sqlqry);
  pool.getConnection(function (err, conn) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to database.');
    conn.query(
      { sql: sqlqry, rowsAsArray: true },
      function (err, results, fields) {
        if (err) {
          console.log(' Query : ', sqlqry, 'err', err);
        }
        console.log(' Query : ', sqlqry, 'results', results);
        // console.log('fields', fields)
      }
    );

    pool.releaseConnection(conn);
  });
  console.log('2222', ' Query : ', sqlqry);
}

async function selectby(sqlqry, byclause) {
  console.log('11111', ' Query : ', sqlqry, ' id : ', byclause);
  pool.getConnection(function (err, conn) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to database.');
    conn.query(sqlqry, [byclause], function (err, results, fields) {
      if (err) {
        console.log(' Query : ', sqlqry, ' id : ', byclause, 'err', err);
      }
      console.log(' Query : ', sqlqry, ' id : ', byclause, 'results', results);
      // console.log('fields', fields)
    });

    pool.releaseConnection(conn);
  });
  console.log('2222', ' Query : ', sqlqry, ' id : ', byclause);
}

async function insertpreppstmt(sqlqry, insertRec) {
  console.log('11111', ' Query : ', sqlqry, ' insertRec : ', insertRec);
  pool.getConnection(function (err, conn) {
    if (err) {
      console.error('Database connection failed: ' + err.stack);
      return;
    }
    console.log('Connected to database.');
    conn.query(sqlqry, insertRec, function (err, results, fields) {
      if (err) {
        console.log(
          ' Query : ',
          sqlqry,
          ' insertRec : ',
          insertRec,
          'err',
          err
        );
      }
      console.log(
        ' Query : ',
        sqlqry,
        ' insertRec : ',
        insertRec,
        'results',
        results
      );
      // console.log('fields', fields)
    });

    pool.releaseConnection(conn);
  });
  console.log('2222', ' Query : ', sqlqry, ' insertRec : ', insertRec);
}
const insertRec = [
  'key123456',
  '1323213213213212313213213213',
  'FAILED',
  Date.now(),
];

// selectAll(sql2);
// selectAll(sql1);
// selectby(sql3, 'key12345');
// insertpreppstmt(sql4, insertRec)
/// <<<< ====================================================================>>>

const handledbReq = (sqlqry, params, queryResponcehandler) => {
  try {
    pool.getConnection((err, conn) => {
      if (err) {
        console.error('Database connection failed: ' + err.stack);
        return (
          queryResponcehandler && queryResponcehandler(err, results, fields)
        );
      }
      console.log('Connected to database.');
      conn.query(sqlqry, params, (err, results, fields) => {
        if (err) {
          console.log('err', err);
        }
        console.log('results', results);
        // console.log('fields', fields)
        return (
          queryResponcehandler && queryResponcehandler(err, results, fields)
        );
      });
      pool.releaseConnection(conn);
    });
  } catch (err) {
    console.log('error form catch block : ', err);
    return queryResponcehandler && queryResponcehandler(err, results, fields);
  }
};

const putodb = (tablename, valuestoupdate, returncallback) => {
  if (!(tablename && valuestoupdate)) {
    return false;
  }
  let columnQuery = ' (';
  let feildQry = 'VALUES (';
  let duplicateClause = 'ON DUPLICATE KEY UPDATE ';
  const columns = [];
  const values = [];
  const clauseValues = [];
  Object.keys(valuestoupdate).forEach((key) => {

    columnQuery += '??, ';
    columns.push(key);
    feildQry += '?, ';
    values.push(valuestoupdate[key]);

    console.log(` putodb key ==>::: ${key}  
    | columnQuery ${columnQuery} |
    | feildQry ${feildQry} | 
    | values ${values} |  `);

  });
  columnQuery = `${columnQuery.slice(0, -2)}) `;
  console.log(` putodb columnQuery.slice ==>::: | columnQuery ${columnQuery}`);
  feildQry = `${feildQry.slice(0, -2)}) `;
  console.log(` putodb feildQry.slice ==>::: | feildQry ${feildQry}`);
  duplicateClause = `duplicateClause.slice(0,-2) `;
  console.log(` putodb duplicateClause.slice ==>::: | duplicateClause ${duplicateClause}`);
  const escapeValues = columns.concat(values.concat(clauseValues));
  console.log(` putodb escapeValues ==>::: | escapeValues ${escapeValues}`);
  const qry = `INSERT INTO ${tablename} ${columnQuery} ${feildQry}`;
  console.log(` putodb ::: qry : ${qry}, |  fieldQuery : ${feildQry}`);
  handledbReq({ sql: qry, timeout: 15000 }, escapeValues, returncallback);
};

const insertRecord = (req, responce) => {
  const payload = req;
  putodb('catalog_short', payload, (error, results, fields) => {
    if (!error) {
      console.log('results : ', results);
    } else {
      console.log('error : ', error);
    }
  });
  console.log('insertRecord Completed ', responce);
};

const responce = {};
const req = {};
const datetime = Date.now();
req.record_key = 'record_key';
req.payload = 'payload';
req.status = 'record_key';
req.creation_date = datetime;

insertRecord(req);


