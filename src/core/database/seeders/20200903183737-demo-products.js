'use strict';
const { v4: uuidv4 } = require('uuid');

const owner_id = '018ccd3f-d470-4919-9cf8-58aeb2dc878c';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      return await queryInterface.bulkInsert('products', [
        {
          id: uuidv4(),
          name: 'Lamborghini',
          price: '250000',
          owner_id,
          image_url:
            'https://upload.wikimedia.org/wikipedia/commons/6/6c/Lamborghini_Huracan_20150525_7811.jpg',
          description: 'This is a very good product',
          category: 'vehicle',
          contact: '0901910190',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Black Sweater',
          price: '7800',
          owner_id,
          image_url:
            'https://ae01.alicdn.com/kf/H6a34b869863340da8c5f93308723c4dd3/2020-Latest-Men-Hooded-Sweatshirt-High-Quality-Black-Hoodie-Solid-Color-Clothing-Hip-Hop-Pullover-Hoodies.jpg',
          description: 'This is a very good product',
          category: 'clothing',
          contact: '0901910190',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Lamborghinic',
          price: '250000',
          owner_id,
          image_url:
            'https://upload.wikimedia.org/wikipedia/commons/6/6c/Lamborghini_Huracan_20150525_7811.jpg',
          description: 'This is a very good product',
          category: 'vehicle',
          contact: '0901910190',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Lamborghiniv',
          price: '250000',
          owner_id,
          image_url:
            'https://ae01.alicdn.com/kf/H6a34b869863340da8c5f93308723c4dd3/2020-Latest-Men-Hooded-Sweatshirt-High-Quality-Black-Hoodie-Solid-Color-Clothing-Hip-Hop-Pullover-Hoodies.jpg',
          description: 'This is a very good product',
          category: 'clothing',
          contact: '0901910190',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ]);
    } catch (error) {
      console.log(error);
    }
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('products', null, {});
  },
};
