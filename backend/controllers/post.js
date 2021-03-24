const { CONNREFUSED } = require("dns");
const fs = require("fs"); // permet d'accéder au gestionnaire de fichiers ds Node.js (pour image)
const db = require("../db");

// Créer d'un nouveau post
exports.createPost = (req, res) => {
  const postObject = JSON.parse(req.body.stringData);
  const insert = {
    ...postObject,
    image:
      req.protocol + "://" + req.get("host") + "/images/" + req.file.filename,
  };
  const reqCreate = "INSERT INTO post SET ?";

  db.query(reqCreate, insert, (error) => {
    if (!error) {
      res.json("Post créé");
    } else {
      res.json(error.message);
      console.log(error.message);
    }
  });
};

// Modifier un post
exports.modifyPost = (req, res) => {
  const postObject = JSON.parse(req.body.stringData);
  delete postObject.userId;
  const insert = [
    (titre = postObject.titre),
    (content = postObject.content),
    (image =
      req.protocol + "://" + req.get("host") + "/images/" + req.file.filename),
    (id = req.params.id),
  ];
  const reqModify =
    "UPDATE post SET titre = ?, content = ?, image = ? WHERE idpost = ?";

  db.query(reqModify, insert, (error) => {
    if (!error) {
      res.json("Post modifié");
    } else {
      res.json(error.message);
    }
  });
};

// Supprimer un post
exports.deletePost = (req, res) => {
  const id = req.params.id;
  const reqDel = "SELECT image FROM post WHERE idpost = ?";

  db.query(reqDel, id, (error, result) => {
    // result = [ RowDataPacket { image: 'http://localhost:3000/images/image1' } ]
    if (!error) {
      const urlImage = result[0].image; // http://localhost:3000/images/image1
      const filename = urlImage.split("/images/")[1]; // image1.jpg

      fs.unlink(`images/${filename}`, () => {
        const del = "DELETE FROM post WHERE idpost = ?";
        db.query(del, id, (error, result) => {
          if (!error) {
            res.json("Post supprimé");
          } else {
            res.json(error.message);
          }
        });
      });
    } else {
      res.json(error.message);
    }
  });
};

// Afficher un post
exports.getOnePost = (req, res) => {
  const id = req.params.id;
  const reqGqetOne =
    "SELECT post.idpost, post.userId, post.content, post.image, post.liked, post.nb_comments, post.date, post.titre, user.firstname, user.lastname FROM post INNER JOIN user ON post.userId = user.iduser WHERE post.idpost= ?";

  db.query(reqGqetOne, id, (error, result) => {
    if (!error) {
      res.json(result);
    } else {
      res.json(error.message);
    }
  });
};

// Afficher tous les posts par date
exports.getAllPostsByDate = (req, res) => {
  const reqGetAllPostsByDate =
    "SELECT post.idpost, post.userId, post.content, post.image, post.liked, post.nb_comments, post.date, post.titre, user.firstname, user.lastname FROM post INNER JOIN user ON post.userId = user.iduser ORDER BY post.date DESC";

  db.query(reqGetAllPostsByDate, (error, result) => {
    if (!error) {
      res.json(result);
    } else {
      res.json(error.message);
    }
  });
};

// Afficher tous les posts par nb de like
exports.getAllPostsByLiked = (req, res) => {
  const reqGetAllPostsByLiked =
    "SELECT post.idpost, post.userId, post.content, post.image, post.liked, post.nb_comments, post.date, post.titre, user.firstname, user.lastname FROM post INNER JOIN user ON post.userId = user.iduser ORDER BY post.liked DESC LIMIT 5";

  db.query(reqGetAllPostsByLiked, (error, result) => {
    if (!error) {
      res.json(result);
    } else {
      res.json(error.message);
    }
  });
};

// Afficher tous les posts pour un même auteur
exports.getAllPostsByAutor = (req, res) => {
  const id = req.params.id;
  const reqGetAllPostsByAutor =
    "SELECT post.idpost, post.userId, post.content, post.image, post.liked, post.nb_comments, post.date, post.titre, user.firstname, user.lastname FROM post INNER JOIN user ON post.userId = user.iduser WHERE post.userId = ? ORDER BY post.date DESC";

  db.query(reqGetAllPostsByAutor, id, (error, result) => {
    if (!error) {
      res.json(result);
    } else {
      res.json(error.message);
    }
  });
};

// Mettre à jour les like d'un post
exports.updateLikePost = (req, res) => {
  const insert = [(idpost = req.params.id), (userId = req.body.userId)];
  const verif = "SELECT * FROM liked WHERE idPosts = ? AND idUsers = ?";

  db.query(verif, insert, (error, result) => {
    if (!error) {
      if (result.length > 0) {
        res.json("Like déjà pris en compte");
      } else {
        const reqUpdateLiked = "INSERT INTO liked SET idPosts = ?, idUsers = ?";
        db.query(reqUpdateLiked, insert, (error, result) => {
          if (!error) {
            const upLikePost =
              "UPDATE post SET liked = liked + 1 WHERE idpost = ?";
            db.query(upLikePost, insert[0], (error, result) => {
              if (!error) {
                res.json("Table liked et like mis à jour");
              } else {
                res.json(error.message);
              }
            });
          } else {
            console.log(error.message);
            res.json(error.message);
          }
        });
      }
    } else {
      res.json(error.message);
    }
  });
};

exports.updateNbComments = (req, res) => {
  console.log("updateNbComments", req.body.postId);
  const id = req.body.postId;
  const update =
    " UPDATE post SET nb_comments = nb_comments - 1 WHERE idpost = ?";

  db.query(update, id, (error) => {
    if (!error) {
      res.json("Nombre de commentaires mis à jour");
    } else {
      res.json(error.message);
    }
  });
};
