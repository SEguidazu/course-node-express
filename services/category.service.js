const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class CategoryService {
  constructor() {}

  async create(data) {
    const newCategory = await models.Category.create(data);
    return newCategory;
  }

  async find() {
    const categories = await models.Category.findAll();
    return categories;
  }

  async findOne(id) {
    const category = await models.Category.findByPk(id, {
      include: ['products'],
    });
    return category;
  }

  async update(id, changes) {
    const response = await models.Category.update(changes, {
      where: { id },
      returning: true,
      plain: true,
    });
    if (!response[1]) {
      throw boom.notFound('Category not found');
    }
    return response[1].dataValues;
  }

  async delete(id) {
    const response = await models.Category.destroy({
      where: { id },
    });
    if (response === 0) {
      throw boom.notFound('Category not found');
    }
    return { id };
  }
}

module.exports = CategoryService;
