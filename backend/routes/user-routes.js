const express = require("express");
const router = express.Router();

const multer = require("../middleware/multer-config-photo"); // gestion fichiers images
const auth = require("../middleware/auth"); // gestion de l'authentification
const joi = require("../middleware/verif-schema"); // vérification schéma user pour bdd
const passwordValidator = require("../middleware/password-validator");
const admin = require("../middleware/admin"); // gère la partie admin

const schemas = require("../schemas/schema");

const userCtrl = require("../controllers/user");

router.get("/", auth, userCtrl.getAllUsers);
router.get("/:id", auth, userCtrl.getOneUser);
router.post(
  "/signup",
  multer,
  passwordValidator,
  joi(schemas.schemaUser),
  userCtrl.signup
);
router.post("/login", userCtrl.login);
router.put(
  "/:id",
  multer,
  auth,
  admin.adminUser,
  joi(schemas.schemaUser),
  userCtrl.modifyUser
);
router.delete("/:id", auth, admin.adminUser, userCtrl.deleteUser);

module.exports = router;
