const passwordValidator = require("password-validator");

module.exports = (req, res, next) => {
  // Create a schema
  const schemaPassword = new passwordValidator();

  // Add properties to it
  schemaPassword
    .is()
    .min(8) // Minimum length 8
    .is()
    .max(25) // Maximum length 100
    .has()
    .uppercase() // Must have uppercase letters
    .has()
    .lowercase() // Must have lowercase letters
    .has()
    .digits(1) // Must have at least 1 digit
    .has()
    .not()
    .spaces(); // Should not have spaces

  const userObject = JSON.parse(req.body.stringData);
  const password = userObject.password;
  const error = schemaPassword.validate(password);
  const valid = error == true;

  if (valid) {
    next();
  } else {
    res.json(error);
    console.log(
      "Le mot de passe doit contenir entre 8 et 25 caractères avec au moins 1 majuscule, 1 minuscule et 1 chiffre, sans espace"
    );
  }
};
