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
  public port: string;

  constructor() {
    this.app = app;
    this.server = http.createServer(this.app);
    this.port = process.env.APP_PORT;
    this.app.set('port', this.getPort());
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
      this.server.listen(this.getPort());
    });
  }

  public getPort() {
    return this.normalizePort(this.port);
  }
}

new Server();
