const Joi = require('joi');
const { Roles } = require('../config/constants');

const id = Joi.number().integer();
const email = Joi.string().email();
const password = Joi.string().min(8);
const token = Joi.string().token();
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

const recoveryUserSchema = Joi.object({
  email: email.required(),
});

const changePasswordUserSchema = Joi.object({
  token: token.required(),
  newPassword: password.required(),
});

const getUserSchema = Joi.object({
  id: id.required(),
});

module.exports = {
  createUserSchema,
  updateUserSchema,
  getUserSchema,
  recoveryUserSchema,
  changePasswordUserSchema,
};
