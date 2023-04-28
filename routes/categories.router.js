const express = require('express');
const { faker } = require('@faker-js/faker');

const router = express.Router();

router.get('/', (req, res) => {
  const categories = [];
  const { size } = req.query;
  const limit = size || 10;
  for (let i = 0; i < limit; i++) {
    categories.push({
      id: faker.datatype.uuid(),
      name: faker.commerce.productAdjective(),
    });
  }
  res.json(categories);
});

module.exports = router;
