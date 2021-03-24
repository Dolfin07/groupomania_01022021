const Joi = require("joi");
const schema = require("../schemas/schema");

module.exports = (schema, property) => {
  return (req, res, next) => {
    const object = req.body;
    const { error } = schema.validate(object);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");

      console.log("error verif-schéma : ", message);
      res.status(422).json({ error: message });
    }
  };
};
