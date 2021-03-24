const fs = require("fs"); // permet d'accéder au gestionnaire de fichiers ds Node.js (pour image)
const db = require("../db");

// Créer d'un nouveau commentaire
exports.createComment = (req, res) => {
  const commentObject = req.body;
  const insert = { ...commentObject };
  const reqCreate = "INSERT INTO comment SET ?";

  db.query(reqCreate, insert, (error) => {
    if (!error) {
      const id = insert.postId;
      const updateComment =
        " UPDATE post SET nb_comments = nb_comments + 1 WHERE idpost = ?";

      db.query(updateComment, id, (error, result) => {
        if (!error) {
          res.json("nb de commentaires mis à jour");
        } else {
          res.json(error.message);
        }
      });
    } else {
      res.json(error.message);
    }
  });
};

// Modifier un commentaire
exports.modifyComment = (req, res) => {
  const insert = [
    (userId = req.body.user),
    (postId = req.body.postId),
    (content = req.body.content),
    (idcomment = req.params.id),
  ];
  const reqModif =
    "UPDATE comment SET userId = ?, postId = ?, content = ? WHERE idcomment = ? ";

  db.query(reqModif, insert, (error) => {
    if (!error) {
      res.json("Commentaire modifié");
    } else {
      res.json(error.message);
    }
  });
};

// Supprimer un commentaire
exports.deleteComment = (req, res) => {
  const id = req.params.id;
  const reqDel = "DELETE FROM comment WHERE idcomment = ?";

  db.query(reqDel, id, (error) => {
    if (!error) {
      res.json("Commentaire supprimé");
    } else {
      res.json(error.message);
    }
  });
};

// Afficher tous les commentaires
exports.getAllComments = (req, res) => {
  const id = req.params.id;

  const reqGetAll =
    "SELECT comment.idcomment, comment.userId, comment.postId, comment.content, comment.date, user.firstname, user.lastname, user.photo FROM comment INNER JOIN user ON comment.userId = user.iduser WHERE comment.postId = ? ORDER BY comment.date DESC";

  db.query(reqGetAll, id, (error, result) => {
    if (!error) {
      res.json(result);
    } else {
      res.json("erreur getAllComments" + error.message);
    }
  });
};
