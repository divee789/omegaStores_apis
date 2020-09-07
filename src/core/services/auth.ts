import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import db from '../database/models';
import JWT from './jwt';
import { IUserLogIn, IUserSignUp } from './interfaces/auth';
import { ResourceNotFoundError } from '../errors';
import Utilities from '../utilities';
import logger from '../utils/logger';

class AuthService {
  public async getUser(email: string) {
    return await db.user.findOne({
      where: {
        email,
      },
    });
  }

  public async signUpUser(
    data: IUserSignUp,
    email_verified: boolean = false,
  ) {
    const hashedPassword = await bcrypt.hashSync(data.password, 12);
    const verification_token = await crypto
      .randomBytes(64)
      .toString('hex');
    const user = await db.user.create({
      ...data,
      password: hashedPassword,
      email_verification_token: verification_token,
      email_verified: email_verified ? true : false,
    });
    const emailData = {
      to: user.email,
      templateId: process.env.SENDGRID_TEMPLATE_ID,
      dynamic_template_data: {
        link: `${process.env.CLIENT_URL}/user/verification/${user.email_verification_token}`,
      },
    };
    //Send Email With Verification Link
    Utilities.sendEmail(emailData).catch((err) => {
      logger.error('[Sendgrid Email Error] ' + err);
    });
    const access_token = await this.generateAccessToken(user.id);
    return access_token;
  }

  public async socialLogIn(email: string) {
    const user = await db.user.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ResourceNotFoundError('Invalid Credentials');
    }
    const access_token = await this.generateAccessToken(user.id);
    return access_token;
  }

  public async logIn(data: IUserLogIn) {
    const user = await db.user.findOne({
      where: {
        email: data.email,
      },
    });
    if (!user || !bcrypt.compareSync(data.password, user.password)) {
      throw new ResourceNotFoundError('Invalid Credentials');
    }

    const access_token = await this.generateAccessToken(user.id);
    return access_token;
  }

  private async generateAccessToken(user_id: string) {
    const signOptions = {
      issuer: 'omegaStores',
      subject: 'omegaStores',
      expiresIn: '24hr',
      algorithm: 'RS256' as any,
    };
    const access_token = await JWT.encode(
      { id: user_id },
      signOptions,
    );
    return access_token;
  }
}

export default AuthService;
