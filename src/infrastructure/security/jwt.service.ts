import jwt, { SignOptions } from 'jsonwebtoken';

export class JwtService {
  private static get secret(): string {
    return process.env.JWT_SECRET || 'dreamout_default_secret_key_change_in_production';
  }

  static generateToken(payload: object, expiresIn: string = '7d'): string {
    const options: SignOptions = {
      expiresIn: expiresIn as SignOptions['expiresIn'],
    };
    return jwt.sign(payload, this.secret, options);
  }

  static verifyToken<T extends object = object>(token: string): T {
    return jwt.verify(token, this.secret) as T;
  }
}
