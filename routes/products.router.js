const express = require('express');

const ProductsService = require('../services/product.services');

const router = express.Router();
const service = new ProductsService();

router.get('/', async (req, res) => {
  const products = await service.find();
  res.status(200).json(products);
});

router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    const product = await service.findOne(id);
    res.status(200).json(product);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res) => {
  const body = req.body;
  const newProduct = await service.create(body);
  res.status(201).json(newProduct);
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const body = req.body;
    const product = await service.update(id, body);
    res.status(204).json(product);
  } catch (err) {
    res.status(404).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  res.status(204).json(await service.delete(id));
});

module.exports = router;
