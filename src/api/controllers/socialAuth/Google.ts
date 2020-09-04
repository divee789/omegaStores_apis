import { Router, Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import db from '../../../core/database/models';
import JWT from '../../../core/services/jwt';
import logger from '../../../core/utils/logger';

class GoogleController {
  public path = '/auth/google';
  public router = Router();
  private client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  private GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

  constructor() {
    this.initializeRoutes();
  }

  public initializeRoutes() {
    this.router.post(this.path, this.authenticate);
  }

  authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { token } = req.body;
      const response = await this.client.verifyIdToken({
        idToken: token,
        audience: this.GOOGLE_CLIENT_ID,
      });

      const {
        email,
        email_verified,
        name,
        picture,
      } = response.getPayload();
      if (email_verified) {
        const user = await db.user.findOne({
          where: {
            email,
          },
        });
        if (!user) {
          const newUser = await db.user.create({
            first_name: name,
            last_name: '',
            email,
            password: bcrypt.hashSync(`${email} ${name}`, 12),
            image_url: picture,
          });
          const accessToken = await JWT.encode(
            { id: newUser.id },
            {
              expiresIn: '24hrs',
            },
          );
          res.json({
            status: true,
            data: {
              accessToken,
            },
          });
          return;
        }
        const accessToken = await JWT.encode(
          { id: user.id },
          {
            expiresIn: '24hrs',
          },
        );
        res.json({
          status: true,
          data: {
            accessToken,
          },
        });
      }
    } catch (error) {
      logger.error(`[GOOGLE AUTH ERROR] ${error}`);
      next(error);
    }
  };
}

export default GoogleController;
