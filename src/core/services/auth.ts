import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import db from '../database/models';
import User from '../database/models/user';
import JWT from './jwt';
import { IUserLogIn, IUserSignUp } from './interfaces/auth';
import { ResourceNotFoundError, BadRequestError } from '../errors';
import Utilities from '../utilities';
import logger from '../utils/logger';

class AuthService {
  public formatUser(user: User) {
    return {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      profile_image: user.image_url,
      email_verified: user.email_verified,
    };
  }

  public async getUser(email: string) {
    const user = await db.user.findOne({
      where: {
        email,
      },
    });
    if (user) {
      return this.formatUser(user);
    }
    return null;
  }

  public async signUpUser(
    data: IUserSignUp,
    email_verified: boolean = false,
  ) {
    const existingUser = await db.user.findOne({
      where: {
        email: data.email,
      },
    });
    if (existingUser) {
      throw new BadRequestError(
        'The email provided belongs to an existing user',
      );
    }
    const hashedPassword = bcrypt.hashSync(data.password, 12);
    const verification_token = crypto.randomBytes(64).toString('hex');
    const user = await db.user.create({
      ...data,
      password: hashedPassword,
      email_verification_token: verification_token,
      email_verified,
    });
    const emailData = {
      to: user.email,
      templateId: process.env.SENDGRID_TEMPLATE_ID,
      dynamic_template_data: {
        link: `${process.env.CLIENT_URL}/user/verification/${user.email_verification_token}`,
      },
    };
    //Send Email With Verification Link
    // Utilities.sendEmail(emailData).catch((err) => {
    //   logger.error('[Sendgrid Email Error] ' + err);
    // });
    const access_token = await this.generateAccessToken(user.id);
    return { access_token, user: this.formatUser(user) };
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
    return { access_token, user: this.formatUser(user) };
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
    return { access_token, user: this.formatUser(user) };
  }

  public async changePassword(
    user: User,
    data: {
      old_password: string;
      new_password: string;
    },
  ) {
    if (!bcrypt.compareSync(data.old_password, user.password)) {
      throw new BadRequestError('Invalid Credentials');
    }
    const hashedPassword = bcrypt.hashSync(data.new_password, 12);
    user.password = hashedPassword;
    await user.save();
  }

  private async generateAccessToken(user_id: string) {
    const signOptions = {
      issuer: 'omegaStores',
      subject: 'omegaStores',
      expiresIn: '168hr',
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
