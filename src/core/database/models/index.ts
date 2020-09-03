const dotenv = require('dotenv');
dotenv.config();

import User from './user';
import Product from './product';
import Message from './message';
import Conversation from './conversation';
import { sequelize, Op, Sequelize } from './sequelize-config';

const db = {
  sequelize,
  Sequelize,
  Op,
  message: Message,
  conversation: Conversation,
  product: Product,
  user: User,
};

export default db;
