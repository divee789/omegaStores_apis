import { Router, Request, Response, NextFunction } from 'express';
import path from 'path';
// @ts-ignore
import Datauri from 'datauri';
import {
  BadRequestError,
  ResourceNotFoundError,
} from '../../core/errors';
import db from '../../core/database/models';
import { validate, ProductSchemas } from '../../core/validations';
import { IProductInterface } from '../../core/validations/interfaces/product';
import { upload } from '../../core/utils/multer';
import authMiddleware from '../middlewares/auth';

const cloudinary = require('cloudinary').v2;

class ProductController {
  public path = '/products';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.get(this.path, this.getAllProducts);
    this.router.post(this.path, authMiddleware(), this.createProduct);
    this.router.get(`${this.path}/:id`, this.getProduct);
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
    this.router.get(
      `${this.path}/user/products`,
      authMiddleware(),
      this.getUserProducts,
    );
    this.router.put(
      `${this.path}/:id/image`,
      authMiddleware(),
      upload.single('product_image'),
      this.uploadProductImage,
    );
  }

  getAllProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    let condition = {};
    if (req.query.category as string) {
      condition = {
        category: req.query.category,
      };
    }
    try {
      const products = await db.product.findAll({
        attributes: ['id', 'name', 'image_url', 'price', 'category'],
        where: condition,
      });
      res.json({
        status: true,
        data: { products },
      });
    } catch (error) {
      next(error);
    }
  };

  uploadProductImage = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    interface MulterRequest extends Request {
      file: {
        key: string; // Available using `S3`.
        path: string; // Available using `DiskStorage`.
        mimetype: string;
        originalname: string;
        size: number;
        buffer: any;
      };
    }
    const request = req as MulterRequest;
    try {
      const product = await db.product.findOne({
        where: {
          id: req.params.id,
        },
      });
      if (!product) {
        throw new ResourceNotFoundError('Product Not Found');
      }
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      const dUri = new Datauri();
      if (request.file) {
        if (request.file.size > 800 * 800) {
          throw new BadRequestError('Upload a smaller image please');
        }
        const dataUri = (): any =>
          dUri.format(
            path.extname(request.file.originalname).toString(),
            request.file.buffer,
          );
        const file = dataUri().content;
        const upload = await cloudinary.uploader.upload(file, {
          folder: 'OmegaStores/products',
          width: 1000,
          height: 500,
          crop: 'limit',
          public_id: product.id,
        });
        product.image_url = upload.url;
        await product.save();
      } else {
        throw new BadRequestError('No file found');
      }

      res.json({
        status: true,
        data: {
          product,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  getUserProducts = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const userProducts = await db.product.findAll({
        where: {
          owner_id: res.locals.user.id,
        },
      });
      res.json({
        status: true,
        data: {
          products: userProducts,
        },
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
    const product = await db.product.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: db.user as any,
          as: 'owner',
          attributes: ['first_name', 'last_name', 'image_url'],
        },
      ],
    });
    if (!product) {
      throw new ResourceNotFoundError('Product Not Found');
    }
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
      if (!req.params.id) {
        throw new BadRequestError('Please provide the product ID');
      }
      const product = await db.product.findByPk(req.params.id);
      if (!product) {
        throw new ResourceNotFoundError('Product Not Found');
      }
      product.price = validatedData.price;
      product.category = validatedData.category;
      product.name = validatedData.name;
      product.description = validatedData.description;
      await product.save();
      res.json({
        status: true,
        message: 'Product Updated Successfully',
        data: {
          product,
        },
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
      if (!req.params.id) {
        throw new BadRequestError('Please provide the product ID');
      }
      const product = await db.product.findByPk(req.params.id);
      if (!product) {
        throw new ResourceNotFoundError('Product Not Found');
      }
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
