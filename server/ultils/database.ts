const mysql = require("mysql2");

let pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "12345678",
  database: "hanniefitness",
  port: 3306,
});

export default pool.promise();

module.exports = pool.promise();
