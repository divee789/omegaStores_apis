import { Router } from 'express';
import ProductController from './product';
import GoogleController from './socialAuth/Google';
import FacebookController from './socialAuth/Facebook';

export interface BaseController {
  path: string;
  router: Router;
}

export { ProductController, GoogleController, FacebookController };
