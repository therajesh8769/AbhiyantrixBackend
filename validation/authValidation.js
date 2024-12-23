const Joi = require('joi');

const registerValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  Name: Joi.string().required(),
  
  
});

const loginValidation = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

module.exports = { registerValidation, loginValidation };

