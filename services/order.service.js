const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class OrderService {
  constructor() {}

  async create(userId) {
    const customer = await models.Customer.findOne({
      where: {
        '$user.id$': userId,
      },
      include: ['user'],
    });
    if (!customer) {
      throw boom.notFound('Customer not found');
    } else {
      const newOrder = await models.Order.create({
        customerId: customer.dataValues.id,
      });
      return newOrder;
    }
  }

  async addItem(data) {
    const newItem = await models.OrderProduct.create(data);
    return newItem;
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
        'items',
      ],
    });
    if (!order) throw boom.notFound('Order not found');
    return order;
  }

  async findByUser(userId) {
    const orders = await models.Order.findAll({
      where: {
        '$customer.user.id$': userId,
      },
      include: [
        {
          association: 'customer',
          include: ['user'],
        },
      ],
    });
    return orders;
  }

  async update(id, changes) {
    const order = await this.findOne(id);
    const result = await order.update(changes);
    return result.dataValues;
  }

  async delete(id) {
    const order = await this.findOne(id);
    await order.destroy();
    return { id };
  }
}

module.exports = OrderService;
