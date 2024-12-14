const mysql = require("mysql2");
const config = require("./config");

console.log(`...config.db:`, config.db);

const mysql_pool = mysql.createPool({
  connectionLimit: 100,
  ...config.db,
});

module.exports = mysql_pool;
