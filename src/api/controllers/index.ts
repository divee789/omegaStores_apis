import { Router } from 'express';
import ProductController from './product';
import AuthController from './auth';
import ChatController from './chat';
export interface BaseController {
  path: string;
  router: Router;
}

export { AuthController, ProductController, ChatController };
