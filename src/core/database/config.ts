const dotenv = require('dotenv');
dotenv.config();

const config = {
  development: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'jiji_development',
    host: 'localhost',
    dialect: 'mysql',
    // operatorsAliases: '0',
    // migrationStorage: 'sequelize',
    // migrationStorageTableName: 'sequelize_migration',
    logging: true,
    // pool: {
    //   max: 15,
    //   min: 0,
    //   idle: 10000,
    // },
  },
  production: {
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: 'jiji_production',
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: '0',
  },
};

module.exports = config;
