const fs = require("fs"); // permet d'accéder au gestionnaire de fichiers ds Node.js (pour image)
const db = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken"); // Permet de créer token d'auth

//Créer d'un nouveau utilisateur (signup)
exports.signup = (req, res) => {
  const userObject = JSON.parse(req.body.stringData);
  bcrypt
    .hash(userObject.password, 10)
    .then((hash) => {
      const insert = {
        photo: `${req.protocol}://${req.get("host")}/photos/${
          req.file.filename
        }`,
        firstname: userObject.firstname,
        lastname: userObject.lastname,
        department: userObject.department,
        email: userObject.email,
        password: hash,
      };
      const reqCreate = "INSERT INTO user SET ?";

      db.query(reqCreate, insert, (error) => {
        if (!error) {
          res.json("Utilisateur créé");
        } else {
          res.json("erreur signup vers bdd :" + error.message);
        }
      });
    })
    .catch((error) =>
      res
        .status(500)
        .json("erreur signup create const insert :" + error.message)
    );
};

// Modifier un utilisateur
exports.modifyUser = (req, res) => {
  const user = JSON.parse(req.body.stringData);
  bcrypt
    .hash(user.password, 10)
    .then((hash) => {
      const insert = [
        (photo =
          req.protocol +
          "://" +
          req.get("host") +
          "/photos/" +
          req.file.filename),
        (firstname = user.firstname),
        (lastname = user.lastname),
        (department = user.department),
        (email = user.email),
        (password = hash),
        (id = req.params.id),
      ];
      const reqModif =
        "UPDATE user SET photo = ?, firstname = ?, lastname = ?, department = ?, email = ?, password = ? WHERE iduser = ?";

      db.query(reqModif, insert, (error) => {
        if (!error) {
          res.json("Utilisateur modifié");
        } else {
          res.json(error.message);
        }
      });
    })
    .catch((error) => res.status(500).json(error.message));
};

// Supprimer un utilisateur
exports.deleteUser = (req, res) => {
  const id = req.params.id;
  const photo = "SELECT photo FROM user WHERE iduser = ?";

  db.query(photo, id, (error, result) => {
    // result = [ RowDataPacket { photo: 'http://localhost:3000/photos/image1' } ]
    if (!error) {
      const filename = result[0].photo.split("/photos/")[1]; // image1.jpg

      fs.unlink(`photos/${filename}`, () => {
        const reqDel = "DELETE FROM user WHERE iduser = ?";
        db.query(reqDel, id, (error, result) => {
          if (!error) {
            res.json("Utilisateur supprimé");
            req.user = "";
          } else {
            res.json(error.message);
            console.log("erreur supprerssion user : " + error.message);
          }
        });
      });
    } else {
      res.json(error.message);
    }
  });
};

// Afficher un utilisateur
exports.getOneUser = (req, res) => {
  const id = req.params.id;
  const reqGetOne = "SELECT * FROM user WHERE iduser = ?";
  db.query(reqGetOne, id, (error, result) => {
    if (!error) {
      res.status(200).json(result);
    } else {
      res.json(error.message);
    }
  });
};

// Afficher tous les utilisateurs
exports.getAllUsers = (res) => {
  const reqGetAll = "SELECT * FROM user";
  db.query(reqGetAll, (error, result) => {
    if (!error) {
      res.json(result);
    } else {
      res.json(error.message);
    }
  });
};

// Connexion
exports.login = (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const reqConnexion = "SELECT * FROM user WHERE email = ?";

  db.query(reqConnexion, email, (error, result) => {
    if (error || result.length == 0) {
      res.status(401).json({ error: "Utilisateur non trouvé !" });
    } else {
      bcrypt
        .compare(password, result[0].password)
        .then((valid) => {
          if (!valid) {
            return res.status(401).json({ error: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            admin: result[0].admin,
            photo: result[0].photo,
            userId: result[0].iduser,
            token: jwt.sign(
              { userId: result[0].iduser },
              "RANDOM_TOKEN_SECRET",
              {
                expiresIn: "60d",
              }
            ),
          });
        })
        .catch((error) => res.status(500).json(error.message));
    }
  });
};
