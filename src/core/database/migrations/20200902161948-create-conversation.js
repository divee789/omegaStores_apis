'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('conversations', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: uuidv4(),
      },
      userOne: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      userTwo: {
        type: Sequelize.UUID,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('conversations');
  },
};
