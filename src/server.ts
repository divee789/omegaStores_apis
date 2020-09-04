#!/usr/bin/env node

/**
 * Module dependencies.
 */
import dotenv from 'dotenv';
dotenv.config();

import { Application } from 'express';
import http from 'http';
import app from './app';
import logger from './core/utils/logger';
import db from './core/database/models';

class Server {
  public app: Application;
  public server: http.Server;
  public port: string | number | false;

  constructor() {
    this.app = app;
    this.server = http.createServer(this.app);
    this.port = this.getPort(process.env.APP_PORT);
    this.app.set('port', this.port);
    this.server.on('error', this.onError);
    this.server.on('listening', this.onListening);
    this.connectDB();
  }

  private normalizePort(val: string) {
    const port = parseInt(val, 10);

    if (isNaN(port)) {
      // named pipe
      return val;
    }

    if (port >= 0) {
      // port number
      return port;
    }

    return false;
  }

  private onError(error: any) {
    if (error.syscall !== 'listen') {
      throw error;
    }

    var bind =
      typeof this.port === 'string'
        ? 'Pipe ' + this.port
        : 'Port ' + this.port;

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error(bind + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error(bind + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  }

  private onListening() {
    logger.info(`Listening on port ${process.env.APP_PORT}`);
  }

  private connectDB() {
    db.sequelize.authenticate().then(() => {
      logger.info(
        'MYSQL Connection has been established successfully.',
      );
      this.server.listen(this.port);
      // this.testDB();
    });
  }

  public getPort(port: string) {
    return this.normalizePort(port);
  }

  public async testDB() {
    try {
      // const user1 = await db.user.create({
      //   first_name: 'Divine',
      //   last_name: 'Olokor',
      //   email: 'test@gmail.com',
      //   image_url: 'test',
      // });
      // const user2 = await db.user.create({
      //   first_name: 'Testify',
      //   last_name: 'Olokor',
      //   email: 'test@gmail.com',
      //   image_url: 'test',
      // });
      // const product = await user1.createProduct({
      //   name: 'test1',
      //   price: '50000',
      //   image_url: 'test',
      //   description: 'test',
      //   category: 'test',
      //   contact: 'test',
      // });
      // const convo1 = async () => {
      //   const co = await db.conversation.findOne({
      //     where: {
      //       userOne: {
      //         [db.Op.or]: [user1.id, user2.id],
      //       },
      //       userTwo: {
      //         [db.Op.or]: [user1.id, user2.id],
      //       },
      //     },
      //     include: [db.conversation.associations.messages],
      //     order: [
      //       [
      //         db.conversation.associations.messages,
      //         'createdAt',
      //         'DESC',
      //       ],
      //     ],
      //   });
      //   if (co) {
      //     return co;
      //   } else {
      //     const co = await db.conversation.create(
      //       { userOne: user1.id, userTwo: user2.id },
      //       {
      //         include: [db.conversation.associations.messages],
      //       },
      //     );
      //     return co;
      //   }
      // };
      // const conv = await convo1();
      // const msg = await conv.createMessage({
      //   text: 'hELLO',
      //   sender: {
      //     id: user1.id,
      //     name: user1.first_name + user1.last_name,
      //   },
      // });
      // const myconv1 = await user1.getConversations();
      // const convMessaes = await db.message.findAll({
      //   where: {
      //     conversation_id: conv.id,
      //   },
      //   order: [['createdAt', 'DESC']],
      // });
      // console.log(
      //   user1.toJSON(),
      //   user2.toJSON(),
      //   product,
      //   conv.toJSON(),
      //   msg.toJSON(),
      //   myconv1,
      //   convMessaes,
      // );
    } catch (error) {
      console.log(error);
    }
  }
}

new Server();
