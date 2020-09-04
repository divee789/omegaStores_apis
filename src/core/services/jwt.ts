import fs from 'fs';
import jwt from 'jsonwebtoken';

export default class JWT {
  private static readPublicKey(): string {
    return fs.readFileSync('auth-public.key', 'utf8');
  }

  private static readPrivateKey(): string {
    return fs.readFileSync('auth-private.key', 'utf8');
  }

  /**
   * Encodes the provided payload and returns the token generated
   */
  public static async encode(
    payload: any,
    signOptions: jwt.SignOptions,
  ): Promise<string> {
    const cert = this.readPrivateKey();
    if (!cert) throw new Error('Token generation failure');
    const token = await jwt.sign(
      payload,
      cert as jwt.Secret,
      signOptions,
    );
    return token;
  }

  /**
   * Returns the decoded payload if the signature is valid even if it is expired
   */
  public static async decode(token: string): Promise<any> {
    const cert = this.readPublicKey();
    try {
      const decoded = await jwt.verify(token, cert);
      return decoded;
    } catch (e) {
      return Promise.reject(e);
    }
  }
}
