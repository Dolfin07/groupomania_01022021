const express = require("express");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const sql = require("./db");

// Bloque les tentatives de connexion après 100 essais pdt 15 minutes (attaque force brute)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

//Connexion à la bdd Mysql

const app = express();

// Helmet aide à sécuriser les applications Express en définissant divers en-têtes HTTP.
app.use(helmet());

//app.use(limiter);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//Gestion du texte
app.use(express.json());

//Gestion des fichiers images
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/photos", express.static(path.join(__dirname, "photos")));

//  Importer les routes post, commentaires et utilisateurs
const postRoutes = require("./routes/post-routes");
const commentRoutes = require("./routes/comment-routes");
const userRoutes = require("./routes/user-routes");

app.use("/api/post", postRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
