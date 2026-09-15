import bcrypt from 'bcryptjs';

export class PasswordService {
  private static readonly SALT_ROUNDS = 10;

  static async hash(password: string): Promise<string> {
    if (!password) return '';
    return bcrypt.hash(password, this.SALT_ROUNDS);
  }

  static async compare(password: string, hash: string): Promise<boolean> {
    if (!password || !hash) return false;
    return bcrypt.compare(password, hash);
  }
}
