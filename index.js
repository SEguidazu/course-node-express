/* eslint-disable no-console */
const express = require('express');
const cors = require('cors');
const routerApi = require('./routes');
const { Roles } = require('./config/constants');

const {
  logErrors,
  ormErrorHandler,
  boomErrorHandler,
  errorHandler,
} = require('./middlewares/error.handler');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

const whitelist = ['http://localhost:8080', 'http://myapp.com'];
const options = {
  origin: (origin, callback) => {
    if (whitelist.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
};
app.use(cors(options));

app.get('/', (req, res) => {
  console.log('==========================');
  console.log('tipo: ', typeof Roles);
  console.log('roles: ', Roles);
  console.log('values: ', Roles.values);
  console.log('values: ', ...Object.values(Roles));
  console.log('==========================');
  res.send('Hello World!');
});

require('./utils/auth');

routerApi(app);

app.use(logErrors);
app.use(ormErrorHandler);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.info(`Server listening on port: ${port}`);
});
