const Joi = require('joi');
const { Roles } = require('../config/constants');

const id = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string().min(8);
const role = Joi.string()
  .valid(...Object.values(Roles))
  .default(Roles.CUSTOMER);

const createUserSchema = Joi.object({
  email: email.required(),
  password: password.required(),
  role,
});

const updateUserSchema = Joi.object({
  email: email,
  role: role,
});

const getUserSchema = Joi.object({
  id: id.required(),
});

module.exports = { createUserSchema, updateUserSchema, getUserSchema };
