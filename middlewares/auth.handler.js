const boom = require('@hapi/boom');

const config = require('../config/config');

function checkApiKey(req, res, next) {
  const apiKey = req.headers['api'];
  if (apiKey === config.apiKey) {
    next();
  } else {
    next(boom.unauthorized());
  }
}

function checkRoles(...roles) {
  return (req, res, next) => {
    const { user } = req;
    if (roles.includes(user.role)) {
      next();
    } else {
      next(boom.forbidden('You do not have permissions'));
    }
  };
}

module.exports = { checkApiKey, checkRoles };
