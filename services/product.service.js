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
    if (!product) throw boom.notFound('Product not found');
    return product;
  }

  async update(id, changes) {
    const product = await this.findOne(id);
    const result = await product.update(changes);
    return result.dataValues;
  }

  async delete(id) {
    const product = await this.findOne(id);
    await product.destroy();
    return { id };
  }
}

module.exports = ProductsService;
