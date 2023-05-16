const boom = require('@hapi/boom');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const config = require('../config/config');

const UserService = require('./user.service');

const service = new UserService();

class AuthService {
  async getUser(email, password) {
    const user = await service.findByEmail(email);
    if (!user) throw boom.unauthorized();

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw boom.unauthorized();

    delete user.dataValues.password;
    return user;
  }

  signToken(user) {
    const payload = {
      sub: user.id,
      role: user.role,
    };
    const token = jwt.sign(payload, config.jwtSecret);
    return {
      user,
      token,
    };
  }

  async sendRecoveryMail(email) {
    const user = await service.findByEmail(email);
    if (!user) throw boom.unauthorized();

    const payload = { sub: user.id };
    const token = jwt.sign(payload, config.jwtSecret, { expiresIn: '10min' });

    const link = `https://myfrontend.com/recovery?token=${token}`;

    await service.update(user.id, { recoveryToken: token });

    const mail = {
      from: config.userSMTP,
      to: `${user.email}`,
      subject: 'Password recovery email',
      html: `<b>Enter this link => ${link}</b>`,
    };

    const result = await this.sendMail(mail);
    return result;
  }

  async sendMail(infoMail) {
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.userSMTP,
        pass: config.passSMTP,
      },
    });
    await transporter.sendMail(infoMail);
    return { message: 'mail sent successfully' };
  }
}

module.exports = AuthService;
