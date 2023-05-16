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

  async sendMail(email) {
    const user = await service.findByEmail(email);
    if (!user) throw boom.unauthorized();

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: config.userSMTP,
        pass: config.passSMTP,
      },
    });

    await transporter.sendMail({
      from: config.userSMTP, // sender address
      to: `${user.email}`, // list of receivers
      subject: 'This is a new email',
      text: 'Hi Santi plain text', //plain text body
      html: '<i>Hi Santi <b>html body</b><i>', //html body
    });

    return { message: 'mail sent successfully' };
  }
}

module.exports = AuthService;
