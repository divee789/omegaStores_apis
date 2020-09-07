import { Router, Request, Response, NextFunction } from 'express';
import db from '../../core/database/models';
import Validation from '../../core/validations';
import { ICreateInterface } from '../../core/validations/interfaces/product';
import authMiddleware from '../middlewares/auth';

class ProductController {
  public path = '/products';
  public router = Router();
  public Validations: Validation;

  constructor() {
    this.initializeRoutes();
    this.Validations = new Validation();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllProducts);
    this.router
      .all(`${this.path}/*`, authMiddleware)
      .post(this.path, this.createProduct);
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
      const validatedData: ICreateInterface = await this.Validations.validate(
        req.body,
        this.Validations.productSchema.create,
      );
      const user = await db.user.findByPk(req.body.id);
      const product = await user.createProduct({ ...validatedData });
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
