import { Router } from 'express';
import ProductController from './product';

export interface BaseController {
  path: string;
  router: Router;
}

export { ProductController };
