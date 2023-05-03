const boom = require('@hapi/boom');

const { models } = require('../libs/sequelize');

class ProductsService {
  constructor() {
    this.generate();
  }

  generate() {}

  async create(data) {
    const newProduct = await models.Product.create(data);
    return newProduct;
  }

  async find() {
    const products = await models.Product.findAll({
      include: ['category'],
    });
    return products;
  }

  async findOne(id) {
    const product = await models.Product.findByPk(id, {
      include: ['category'],
    });
    return product;
  }

  async update(id, changes) {
    const response = await models.Product.update(changes, {
      where: { id },
      returning: true,
      plain: true,
    });
    if (!response[1]) {
      throw boom.notFound('Product not found');
    }
    return response[1].dataValues;
  }

  async delete(id) {
    const response = await models.Product.destroy({
      where: { id },
    });
    if (response === 0) {
      throw boom.notFound('Product not found');
    }
    return { id };
  }
}

module.exports = ProductsService;
