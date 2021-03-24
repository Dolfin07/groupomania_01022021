const db = require("../db");

exports.adminUser = (req, res, next) => {
  const userId = req.user;
  const idReq = req.params.id;

  const reqPrepare = "SELECT admin FROM user WHERE iduser = ? ";
  db.query(reqPrepare, userId, (error, result) => {
    if (!error && result.length > 0) {
      if ((result[0].admin === "TRUE") | (idReq == userId)) {
        next();
      } else {
        res.status(401).json("action non autorisée");
      }
    } else {
      res.status(404).json("Impossible de vérifier les droits admin");
    }
  });
};

exports.adminPost = (req, res, next) => {
  const userId = req.user;
  const idReq = req.params.id;
  const reqSelectUser = "SELECT post.userId FROM post WHERE idpost = ? ";
  db.query(reqSelectUser, idReq, (error, result) => {
    if (!error && result.length > 0) {
      if (userId == result[0].userId) {
        next();
      } else {
        const reqSelectAdmin = "SELECT user.admin FROM user WHERE iduser = ?";
        db.query(reqSelectAdmin, userId, (error, result) => {
          if (!error && result.length > 0) {
            next();
          } else {
            res.status(401).json("action non autorisée");
          }
        });
      }
    } else {
      res.status(401).json("Impossible de vérifier les droits admin");
    }
  });
};

exports.adminComment = (req, res, next) => {
  const userId = req.user;
  const idReq = req.params.id;
  const reqSelectUser =
    "SELECT comment.userId FROM comment WHERE idcomment = ? ";
  db.query(reqSelectUser, idReq, (error, result) => {
    if (!error && result.length > 0) {
      if (userId == result[0].userId) {
        next();
      } else {
        const reqSelectAdmin = "SELECT user.admin FROM user WHERE iduser = ?";
        db.query(reqSelectAdmin, userId, (error, result) => {
          if (!error && result.length > 0) {
            next();
          } else {
            res.status(401).json("action non autorisée");
          }
        });
      }
    } else {
      res.status(401).json("Impossible de vérifier les droits admin");
    }
  });
};
