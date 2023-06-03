import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "badge_db",
  charset: "utf8mb4",
  namedPlaceholders: true,
});

export default pool;

// db.connect((err) => {
//   if (err) {
//     throw err;
//   } else {
//     console.log("mysql baglantısı başarılı");
//   }
// });

// export default db;
