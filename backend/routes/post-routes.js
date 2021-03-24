const express = require("express");
const router = express.Router();

const multer = require("../middleware/multer-config-image"); // gestion fichiers images
const auth = require("../middleware/auth"); // gestion de l'authentification
const joi = require("../middleware/verif-schema"); // vérification schéma user pour bdd
const admin = require("../middleware/admin"); // gère la partie admin
const schemas = require("../schemas/schema");

const postCtrl = require("../controllers/post");

router.get("/date", auth, postCtrl.getAllPostsByDate);
router.get("/liked", auth, postCtrl.getAllPostsByLiked);
router.get("/autor/:id", postCtrl.getAllPostsByAutor);
router.post("/", multer, auth, joi(schemas.schemaPost), postCtrl.createPost);
router.get("/:id", auth, postCtrl.getOnePost);
router.put(
  "/:id",
  multer,
  auth,
  admin.adminPost,
  joi(schemas.schemaPost),
  postCtrl.modifyPost
);
router.delete("/:id", auth, admin.adminPost, postCtrl.deletePost);
router.post("/like/:id", postCtrl.updateLikePost);
router.post("/nb_comments", postCtrl.updateNbComments);

module.exports = router;
