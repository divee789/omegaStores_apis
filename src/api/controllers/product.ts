import { Router, Request, Response, NextFunction } from 'express';
import db from '../../core/database/models';

class ProductController {
  public path = '/products';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllProducts);
    this.router.post(this.path, this.createProduct);
  }

  getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const products = await db.product.findAll();
      res.json({
        status: true,
        data: products,
      });
    } catch (error) {
      next(error);
    }
  };

  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const data = req.body;
      const user = await db.user.findByPk(req.body.id);
      const product = await user.createProduct({ ...req.body });
      res.json({
        status: true,
        data: product,
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ProductController;
