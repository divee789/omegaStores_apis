import { Router, Request, Response, NextFunction } from 'express';
import db from '../../core/database/models';
import { validate, ProductSchemas } from '../../core/validations';
import { IProductInterface } from '../../core/validations/interfaces/product';
import authMiddleware from '../middlewares/auth';

class ProductController {
  public path = '/products';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllProducts);
    this.router.get(`${this.path}/:id`, this.getProduct);
    this.router.post(this.path, authMiddleware(), this.createProduct);
    this.router.put(
      `${this.path}/:id`,
      authMiddleware(),
      this.updateProduct,
    );
    this.router.delete(
      `${this.path}/:id`,
      authMiddleware(),
      this.deleteProduct,
    );
  }

  getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const products = await db.product.findAll({
        attributes: ['id', 'name', 'image_url', 'price', 'category'],
      });
      res.json({
        status: true,
        data: { products },
      });
    } catch (error) {
      next(error);
    }
  };

  getProduct = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    const product = await db.product.findByPk(req.params.id);
    res.json({
      status: true,
      data: { product },
    });
  };

  async createProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validatedData: IProductInterface = await validate(
        req.body,
        ProductSchemas.create,
      );
      const product = await res.locals.user.createProduct(
        validatedData,
      );
      res.json({
        status: true,
        data: { product },
      });
    } catch (error) {
      next(error);
    }
  }

  async updateProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const validatedData: IProductInterface = await validate(
        req.body,
        ProductSchemas.create,
      );
      const product = await db.product.findByPk(req.params.id);
      product.image_url = validatedData.image_url;
      product.price = validatedData.price;
      product.category = validatedData.category;
      product.name = validatedData.name;
      product.description = validatedData.description;
      await product.save();
      res.json({
        status: true,
        message: 'Product Updated Successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteProduct(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const product = await db.product.findByPk(req.params.id);
      await product.destroy();
      res.status(200).json({
        status: true,
        message: 'Product Deleted Successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}

export default ProductController;
