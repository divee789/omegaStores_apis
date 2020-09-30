/* eslint-disable @typescript-eslint/ban-ts-ignore */
import path from 'path';
import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';

// @ts-ignore
import Datauri from 'datauri';

import Services from '../../core/services';
import { validate, AuthSchemas } from '../../core/validations';
import {
  IUserLogIn,
  IUserSignUp,
  IFacebookAuth,
  IGoogleAuth,
} from '../../core/validations/interfaces/auth';
import authMiddleware from '../middlewares/auth';
import logger from '../../core/utils/logger';
import { upload } from '../../core/utils/multer';
import { BadRequestError } from '../../core/errors';

const cloudinary = require('cloudinary').v2;

const Service = new Services();

class AuthController {
  public path = '/auth';
  public router = Router();

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(`${this.path}/login`, this.logIn);
    this.router.post(`${this.path}/signup`, this.signUp);
    this.router.post(`${this.path}/facebook`, this.authFacebook);
    this.router.post(`${this.path}/google`, this.authGoogle);
    this.router.get(
      `${this.path}/user`,
      authMiddleware(),
      this.getUser,
    );
    this.router.put(
      `${this.path}/user`,
      authMiddleware(),
      this.editUser,
    );
    this.router.put(
      `${this.path}/user/password`,
      authMiddleware(),
      this.changePassword,
    );
    this.router.put(
      `${this.path}/user/image`,
      authMiddleware(),
      upload.single('profile_image'),
      this.uploadProfileImage,
    );
  }

  getUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      res.json({
        status: true,
        data: {
          user: Service.Auth.formatUser(res.locals.user),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  editUser = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { user } = res.locals;
      const { first_name, last_name } = req.body;
      user.first_name = first_name;
      user.last_name = last_name;
      await user.save();
      res.json({
        status: true,
        data: {
          user: Service.Auth.formatUser(user),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  changePassword = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { user } = res.locals;
      const { old_password, new_password } = req.body;
      await Service.Auth.changePassword(user, {
        old_password,
        new_password,
      });
      res.json('OK');
    } catch (error) {
      next(error);
    }
  };

  logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData: IUserLogIn = await validate(
        req.body,
        AuthSchemas.logIn,
      );
      const { access_token, user } = await Service.Auth.logIn(
        validatedData,
      );
      res.json({
        status: true,
        data: {
          access_token,
          user,
        },
      });
    } catch (error) {
      next(error);
    }
  };

  signUp = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const validatedData: IUserSignUp = await validate(
        req.body,
        AuthSchemas.signUp,
      );
      const { access_token, user } = await Service.Auth.signUpUser(
        validatedData,
      );
      res.json({ status: true, data: { access_token, user } });
    } catch (error) {
      next(error);
    }
  };

  uploadProfileImage = async (
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
      cloudinary.config({
        cloud_name: process.env.CLOUDINARY_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
      });
      const { user } = res.locals;
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
          folder: 'OmegaStores',
          width: 1000,
          height: 500,
          crop: 'limit',
          public_id: user.email,
        });
        user.image_url = upload.url;
        await user.save();
      } else {
        throw new BadRequestError('No file found');
      }

      res.json({
        status: true,
        data: {
          user: Service.Auth.formatUser(user),
        },
      });
    } catch (error) {
      next(error);
    }
  };

  authFacebook = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userID, token }: IFacebookAuth = await validate(
        req.body,
        AuthSchemas.facebookAuth,
      );
      const url = `https://graph.facebook.com/v2.11/${userID}?fields=name,picture,email,id&access_token=${token}`;
      const response = await axios.get(url);
      const { email, name, picture } = response.data;
      const oldUser = await Service.Auth.getUser(email);
      let social_token: string;
      let social_user: any;
      if (!oldUser) {
        const { access_token, user } = await Service.Auth.signUpUser(
          {
            email,
            image_url: picture,
            first_name: name,
            last_name: '',
            password: `${email}${name}`,
          },
          true,
        );
        social_token = access_token;
        social_user = user;
      } else {
        const { access_token, user } = await Service.Auth.socialLogIn(
          email,
        );
        social_token = access_token;
        social_user = user;
      }
      res.json({
        status: true,
        data: { access_token: social_token, user: social_user },
      });
    } catch (error) {
      logger.error(`[FACEBOOK AUTH ERROR] ${error}`);
      next(error);
    }
  };

  authGoogle = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { token }: IGoogleAuth = await validate(
        req.body,
        AuthSchemas.googleAuth,
      );
      const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
      const response = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const {
        email,
        email_verified,
        name,
        picture,
      } = response.getPayload();
      if (email_verified) {
        const oldUser = await Service.Auth.getUser(email);
        let social_token: string;
        let social_user: any;
        if (!oldUser) {
          const names = name.split(' ');
          const {
            access_token,
            user,
          } = await Service.Auth.signUpUser(
            {
              email,
              image_url: picture,
              first_name: names[0],
              last_name: names[1],
              password: `${email}${name}`,
            },
            true,
          );
          social_token = access_token;
          social_user = user;
        } else {
          const {
            access_token,
            user,
          } = await Service.Auth.socialLogIn(email);
          social_token = access_token;
          social_user = user;
        }
        return res.json({
          status: true,
          data: { access_token: social_token, user: social_user },
        });
      }
      res.json({
        status: false,
        message:
          'This email has not been verified by Google, Please Use a Verified Account',
      });
    } catch (error) {
      logger.error(`[GOOGLE AUTH ERROR] ${error}`);
      next(error);
    }
  };
}

export default AuthController;
