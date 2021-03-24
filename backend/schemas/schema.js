const Joi = require("joi");

const schemas = {
  schemaUser: Joi.object().keys({
    firstname: Joi.string().min(2).max(45).required(),
    lastname: Joi.string().min(2).max(45).required(),
    department: Joi.string().required(),
    email: Joi.string().email({}).required(),
    password: Joi.string().required(),
    user: Joi.number(),
  }),
  schemaPost: Joi.object().keys({
    titre: Joi.string().max(150).required(),
    userId: Joi.number().required(),
    content: Joi.string().min(2).max(63000).required(),
  }),
  schemaComment: Joi.object().keys({
    userId: Joi.number().required(),
    postId: Joi.number().required(),
    content: Joi.string().min(2).max(63000).required(),
  }),
};

module.exports = schemas;
