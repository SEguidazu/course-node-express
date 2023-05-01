const boom = require('@hapi/boom');
const { models } = require('../libs/sequelize');

class CustomerService {
  constructor() {}

  async find() {
    const result = await models.Customer.findAll({
      include: ['user'],
    });
    return result;
  }

  async findOne(id) {
    const customer = await models.Customer.findByPk(id);
    if (!customer) {
      throw boom.notFound('customer not found');
    }
    return customer;
  }

  async create(data) {
    const newCustomer = await models.Customer.create(data, {
      include: ['user'],
    });
    return newCustomer;
  }

  async update(id, changes) {
    const model = await this.findOne(id);
    const result = await model.update(changes);
    return result;
  }

  async delete(id) {
    const model = await this.findOne(id);
    await model.destroy();
    return { result: true };
  }
}

module.exports = CustomerService;
