import { Router, Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import axios from 'axios';
import db from '../../../core/database/models';
import JWT from '../../../core/services/jwt';
import logger from '../../../core/utils/logger';

class FacebookController {
  public path = '/auth/facebook';
  public router = Router();

  constructor() {
    this.router.post(this.path, this.authenticate);
  }

  authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { userID, token } = req.body;
      const url = `https://graph.facebook.com/v2.11/${userID}?fields=name,picture,email,id&access_token=${token}`;
      const response = await axios.get(url);
      const { email, name, picture } = response.data;

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
    } catch (error) {
      logger.error(`[FACEBOOK AUTH ERROR] ${error}`);
      next(error);
    }
  };
}

export default FacebookController;
