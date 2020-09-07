import { Router, Request, Response, NextFunction } from 'express';
import axios from 'axios';
import { OAuth2Client } from 'google-auth-library';
import Services from '../../core/services';
import Validation from '../../core/validations';
import logger from '../../core/utils/logger';

const Service = new Services();

class AuthController {
  public path = '/auth';
  public router = Router();
  public Validations: Validation;

  constructor() {
    this.initializeRoutes();
    this.Validations = new Validation();
  }

  public initializeRoutes() {
    this.router.post(`${this.path}/login`, this.logIn);
    this.router.post(`${this.path}/signup`, this.signUp);
    this.router.post(`${this.path}/facebook`, this.authFacebook);
    this.router.post(`${this.path}/google`, this.authGoogle);
  }

  logIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const access_token = await Service.Auth.logIn(req.body);
      res.json({ access_token });
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
      const access_token = await Service.Auth.signUpUser(req.body);
      res.json({ status: true, access_token });
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
      const { userID, token } = req.body;
      const url = `https://graph.facebook.com/v2.11/${userID}?fields=name,picture,email,id&access_token=${token}`;
      const response = await axios.get(url);
      const { email, name, picture } = response.data;
      const oldUser = await Service.Auth.getUser(email);
      let access_token: string;
      if (!oldUser) {
        access_token = await Service.Auth.signUpUser(
          {
            email,
            image_url: picture,
            first_name: name,
            last_name: '',
            password: `${email}${name}`,
          },
          true,
        );
      } else {
        access_token = await Service.Auth.socialLogIn(email);
      }
      res.json({ status: true, access_token });
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
      const { token } = req.body;
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
        let access_token: string;
        if (!oldUser) {
          access_token = await Service.Auth.signUpUser(
            {
              email,
              image_url: picture,
              first_name: name,
              last_name: '',
              password: `${email}${name}`,
            },
            true,
          );
        } else {
          access_token = await Service.Auth.socialLogIn(email);
        }
        res.json({ status: true, access_token });
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
