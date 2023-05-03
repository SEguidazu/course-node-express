const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class OrderService {
  constructor() {}

  async create(data) {
    const newOrder = await models.Order.create(data);
    return newOrder;
  }

  async find() {
    const orders = await models.Order.findAll({
      include: ['customer'],
    });
    return orders;
  }

  async findOne(id) {
    const order = await models.Order.findByPk(id, {
      include: [
        {
          association: 'customer',
          include: ['user'],
        },
      ],
    });
    return order;
  }

  async update(id, changes) {
    const response = await models.Order.update(changes, {
      where: { id },
      returning: true,
      plain: true,
    });
    if (!response[1]) {
      throw boom.notFound('Order not found');
    }
    return response[1].dataValues;
  }

  async delete(id) {
    const response = await models.Order.destroy({
      where: { id },
    });
    if (response === 0) {
      throw boom.notFound('Order not found');
    }
    return { id };
  }
}

module.exports = OrderService;
