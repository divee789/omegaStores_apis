'use strict';
const { v4: uuidv4 } = require('uuid');

const owner_id = 'f80d8a5c-455f-4509-8c1e-0fb2ae4f6655';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      return await queryInterface.bulkInsert('products', [
        {
          id: uuidv4(),
          name: 'Lamborghini Huracan',
          price: '2500000',
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
          name: 'Samsung Galaxy S20',
          price: '100000',
          owner_id,
          image_url:
            'https://llynmase.com/wp-content/uploads/2020/07/samsung-galaxy-s20-plus-4g-g985-8gb-ram-128gb-dual-sim-negro.jpg',
          description: 'This is a very good product',
          category: 'tech',
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
            'https://ae01.alicdn.com/kf/H6a34b869863340da8c5f93308723c4dd3/2020-Latest-Men-Hooded-Sweatshirt-High-Quality-Black-Hoodie-Solid-Color-fashion-Hip-Hop-Pullover-Hoodies.jpg',
          description: 'This is a very good product',
          category: 'fashion',
          contact: '0901910190',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Lamborghini Huracan',
          price: '2500000',
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
            'https://ae01.alicdn.com/kf/H6a34b869863340da8c5f93308723c4dd3/2020-Latest-Men-Hooded-Sweatshirt-High-Quality-Black-Hoodie-Solid-Color-fashion-Hip-Hop-Pullover-Hoodies.jpg',
          description: 'This is a very good product',
          category: 'fashion',
          contact: '0901910190',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Iphone 11',
          price: '100000',
          owner_id,
          image_url:
            'https://www.gizmochina.com/wp-content/uploads/2019/09/Apple-iPhone-11-1-500x500.jpg',
          description: 'This is a very good product',
          category: 'tech',
          contact: '0901910190',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Lamborghini Huracan',
          price: '2500000',
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
          name: 'Samsung Galaxy S20',
          price: '100000',
          owner_id,
          image_url:
            'https://llynmase.com/wp-content/uploads/2020/07/samsung-galaxy-s20-plus-4g-g985-8gb-ram-128gb-dual-sim-negro.jpg',
          description: 'This is a very good product',
          category: 'tech',
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
            'https://ae01.alicdn.com/kf/H6a34b869863340da8c5f93308723c4dd3/2020-Latest-Men-Hooded-Sweatshirt-High-Quality-Black-Hoodie-Solid-Color-fashion-Hip-Hop-Pullover-Hoodies.jpg',
          description: 'This is a very good product',
          category: 'fashion',
          contact: '0901910190',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Lamborghini Huracan',
          price: '2500000',
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
            'https://ae01.alicdn.com/kf/H6a34b869863340da8c5f93308723c4dd3/2020-Latest-Men-Hooded-Sweatshirt-High-Quality-Black-Hoodie-Solid-Color-fashion-Hip-Hop-Pullover-Hoodies.jpg',
          description: 'This is a very good product',
          category: 'fashion',
          contact: '0901910190',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Iphone 11',
          price: '100000',
          owner_id,
          image_url:
            'https://www.gizmochina.com/wp-content/uploads/2019/09/Apple-iPhone-11-1-500x500.jpg',
          description: 'This is a very good product',
          category: 'tech',
          contact: '0901910190',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Lamborghini Huracan',
          price: '2500000',
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
          name: 'Samsung Galaxy S20',
          price: '100000',
          owner_id,
          image_url:
            'https://llynmase.com/wp-content/uploads/2020/07/samsung-galaxy-s20-plus-4g-g985-8gb-ram-128gb-dual-sim-negro.jpg',
          description: 'This is a very good product',
          category: 'tech',
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
            'https://ae01.alicdn.com/kf/H6a34b869863340da8c5f93308723c4dd3/2020-Latest-Men-Hooded-Sweatshirt-High-Quality-Black-Hoodie-Solid-Color-fashion-Hip-Hop-Pullover-Hoodies.jpg',
          description: 'This is a very good product',
          category: 'fashion',
          contact: '0901910190',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Lamborghini Huracan',
          price: '2500000',
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
            'https://ae01.alicdn.com/kf/H6a34b869863340da8c5f93308723c4dd3/2020-Latest-Men-Hooded-Sweatshirt-High-Quality-Black-Hoodie-Solid-Color-fashion-Hip-Hop-Pullover-Hoodies.jpg',
          description: 'This is a very good product',
          category: 'fashion',
          contact: '0901910190',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Iphone 11',
          price: '100000',
          owner_id,
          image_url:
            'https://www.gizmochina.com/wp-content/uploads/2019/09/Apple-iPhone-11-1-500x500.jpg',
          description: 'This is a very good product',
          category: 'tech',
          contact: '0901910190',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Lamborghini Huracan',
          price: '2500000',
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
          name: 'Samsung Galaxy S20',
          price: '100000',
          owner_id,
          image_url:
            'https://llynmase.com/wp-content/uploads/2020/07/samsung-galaxy-s20-plus-4g-g985-8gb-ram-128gb-dual-sim-negro.jpg',
          description: 'This is a very good product',
          category: 'tech',
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
            'https://ae01.alicdn.com/kf/H6a34b869863340da8c5f93308723c4dd3/2020-Latest-Men-Hooded-Sweatshirt-High-Quality-Black-Hoodie-Solid-Color-fashion-Hip-Hop-Pullover-Hoodies.jpg',
          description: 'This is a very good product',
          category: 'fashion',
          contact: '0901910190',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Lamborghini Huracan',
          price: '2500000',
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
            'https://ae01.alicdn.com/kf/H6a34b869863340da8c5f93308723c4dd3/2020-Latest-Men-Hooded-Sweatshirt-High-Quality-Black-Hoodie-Solid-Color-fashion-Hip-Hop-Pullover-Hoodies.jpg',
          description: 'This is a very good product',
          category: 'fashion',
          contact: '0901910190',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: uuidv4(),
          name: 'Iphone 11',
          price: '100000',
          owner_id,
          image_url:
            'https://www.gizmochina.com/wp-content/uploads/2019/09/Apple-iPhone-11-1-500x500.jpg',
          description: 'This is a very good product',
          category: 'tech',
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
