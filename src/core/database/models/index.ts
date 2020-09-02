const dotenv = require('dotenv');
dotenv.config();

import { Sequelize } from 'sequelize';
import { instantiateProduct } from './product';
import { instantiateUser } from './user';
const env = 'development';
const settings = require('../config');
const config = settings[env];

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    dialect: config.dialect,
    host: config.host,
  },
);

const db = {
  sequelize,
  Sequelize,
  Product: instantiateProduct(sequelize),
  User: instantiateUser(sequelize),
};

Object.values(db).forEach((model: any) => {
  if (model.associate) {
    model.associate(db);
  }
});

export default db;
