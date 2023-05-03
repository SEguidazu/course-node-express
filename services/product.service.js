const boom = require('@hapi/boom');
const { Op } = require('sequelize');

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

  async find({ limit = 100, offset = 0, price, price_min, price_max }) {
    const options = {
      include: ['category'],
      offset,
      limit,
      where: {},
    };

    if (price) {
      options.where.price = price;
    } else {
      if (price_min) {
        options.where.price = {
          ...options.where.price,
          [Op.gte]: price_min,
        };
      }
      if (price_max) {
        options.where.price = {
          ...options.where.price,
          [Op.lte]: price_max,
        };
      }
    }
    const products = await models.Product.findAll(options);
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
