const express = require('express');
const passport = require('passport');

const AuthService = require('../services/auth.service');

const validatorHandler = require('../middlewares/validator.handler');

const {
  recoveryUserSchema,
  changePasswordUserSchema,
} = require('../schemas/user.schema');

const router = express.Router();
const service = new AuthService();

router.post(
  '/login',
  passport.authenticate('local', { session: false }),
  async (req, res, next) => {
    try {
      const { user } = req;
      res.status(200).json(service.signToken(user));
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/recovery',
  validatorHandler(recoveryUserSchema),
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const result = await service.sendRecoveryMail(email);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/change-password',
  validatorHandler(changePasswordUserSchema),
  async (req, res, next) => {
    try {
      const { token, newPassword } = req.body;
      const result = await service.changePassword(token, newPassword);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

module.exports = router;
