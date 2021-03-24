const Joi = require("joi");
const schema = require("../schemas/schema");

module.exports = (schema, property) => {
  return (req, res, next) => {
    const Object = JSON.parse(req.body.stringData);
    const { error } = schema.validate(Object);
    const valid = error == null;

    if (valid) {
      next();
    } else {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      res.status(422).json({ error: message });
    }
  };
};
