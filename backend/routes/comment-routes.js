const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth"); // gestion de l'authentification
const multer = require("../middleware/multer-config-image"); // gestion fichiers images
const joi = require("../middleware/verif-schema-comment"); // vérification schéma user pour bdd
const admin = require("../middleware/admin"); // gère la partie admin

const schemas = require("../schemas/schema");

const commentCtrl = require("../controllers/comment");

router.get("/:id", auth, commentCtrl.getAllComments);
router.post("/", multer, joi(schemas.schemaComment), commentCtrl.createComment);
router.delete(
  "/:id",
  multer,
  auth,
  admin.adminComment,
  commentCtrl.deleteComment
);

module.exports = router;
