const crypto = require("crypto");
const mysql_pool = require("./database");

function encodeRequest(payload) {
  return Buffer.from(JSON.stringify(payload)).toString("base64");
}

function decodeRequest(payload) {
  try {
    let bufferObj = Buffer.from(payload, "base64");
    // Decoding base64 into String
    return JSON.parse(bufferObj.toString("utf8"));
  } catch (error) {
    console.log("Error parsing JSON:", error);
    return null;
  }
}

function signRequest(payload) {
  return crypto.createHash("sha256").update(payload).digest("hex");
}

function executeQuery(query, values, callback) {
  mysql_pool.getConnection((err, connection) => {
    if (err) {
      return callback(err, null);
    }
    connection.query(query, values, (error, results) => {
      connection.release(); // Release the connection back to the pool
      callback(error, results);
    });
  });
}

module.exports = { executeQuery, encodeRequest, signRequest, decodeRequest };

//   var query1 = `SELECT *
// FROM tblCommuter
// WHERE Umobile = ?
// UNION
// SELECT *
// FROM tblCommuter
// WHERE NOT EXISTS (SELECT 1 FROM tblCommuter
// WHERE Umobile = ?)
// ORDER BY Num DESC
// LIMIT 1`;
