const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");

const db = new Database("/data/database.sqlite");
const hash = bcrypt.hashSync("T7#vQ9@Lm2$Rx8!Fp4^Zd6&Ns1*Wy", 10);
const username = "executive.producer.studio_92xk47lmq";

const existing = db.prepare("SELECT id FROM User WHERE username = ?").get(username);
if (existing) {
  db.prepare("UPDATE User SET password = ? WHERE username = ?").run(hash, username);
  console.log("Updated user:", username);
} else {
  db.prepare("INSERT INTO User (username, password) VALUES (?, ?)").run(username, hash);
  console.log("Created user:", username);
}
db.close();
