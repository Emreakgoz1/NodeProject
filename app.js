import "./utils/env.js";
import express from "express";
import dotenv from "dotenv";
import session from "express-session";
import fileUpload from "express-fileupload";
import db from "./db.js";
import { logger } from "./utils/logger.js";

//routes
import auth from "./routes/auth.js";
import { decrypt } from "./utils/crypto.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 7002;

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.use("/assets", express.static("assets"));
app.use("/upload", express.static("upload"));
app.use(fileUpload());

app.use((req, res, next) => {
  //global olarak hem değişkenleri hemde methodlari res.locals altında halletmemiz gerekir
  res.locals.session = req.session;
  //descrypti buraya atıyarak idmi decrypt etmiş oldum
  res.locals.decrypt = decrypt;
  next();
});
app.get("/", (req, res) => {
  res.render("index", {
    title: "deneme başlık",
    greetings: "hoşgeldin gardaş",
  });
});

app.use("/auth", auth);

app.use((err, req, res, next) => {
  logger.error(`${req.method} ${req.url} - ${err.message}`, {
    timestamp: new Date(),
    stack: err.stack,
  });

  res.status(500).send("Bir hata meydana geldi!");

  //next()
});

app.listen(port, () => {
  console.log(`http://localhost:${port} portundan dinleniyor`);
});
