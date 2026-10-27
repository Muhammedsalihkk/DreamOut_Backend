import crypto from 'crypto';
import { config } from '../config/env';

export class BackendCloudinaryService {
  /**
   * Extract public ID from a Cloudinary URL or return the public ID as is
   */
  static extractPublicId(urlOrPublicId: string): string | null {
    if (!urlOrPublicId || typeof urlOrPublicId !== 'string') return null;

    if (!urlOrPublicId.startsWith('http://') && !urlOrPublicId.startsWith('https://')) {
      return urlOrPublicId.trim();
    }

    try {
      // Cloudinary URL format: .../image/upload/(v12345/)?(folder/subfolder/public_id)(.ext)?
      const match = urlOrPublicId.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.[a-zA-Z0-9]+)?$/);
      if (match && match[1]) {
        return match[1];
      }
    } catch {
      // Return null on regex error
    }

    return null;
  }

  /**
   * Check if a given URL is a Cloudinary hosted asset
   */
  static isCloudinaryUrl(url?: string | null): boolean {
    if (!url || typeof url !== 'string') return false;
    return url.includes('cloudinary.com') || url.includes('res.cloudinary.com');
  }

  /**
   * Delete an asset from Cloudinary securely using server-side signed API
   */
  static async deleteAsset(urlOrPublicId: string): Promise<{ success: boolean; message: string }> {
    const publicId = this.extractPublicId(urlOrPublicId);
    if (!publicId) {
      return { success: false, message: 'Invalid or missing public_id.' };
    }

    const { cloudinaryCloudName, cloudinaryApiKey, cloudinaryApiSecret } = config;

    if (!cloudinaryCloudName || !cloudinaryApiKey || !cloudinaryApiSecret) {
      // Informative fallback: credentials not configured on backend yet
      console.warn(
        `[BackendCloudinaryService] Cannot delete asset "${publicId}" from Cloudinary: CLOUDINARY_API_KEY/CLOUDINARY_API_SECRET not set in backend .env.`
      );
      return {
        success: false,
        message: 'Cloudinary server credentials not configured in backend environment.',
      };
    }

    try {
      const timestamp = Math.floor(Date.now() / 1000);
      const toSign = `public_id=${publicId}&timestamp=${timestamp}${cloudinaryApiSecret}`;
      const signature = crypto.createHash('sha1').update(toSign).digest('hex');

      const formData = new URLSearchParams();
      formData.append('public_id', publicId);
      formData.append('timestamp', timestamp.toString());
      formData.append('api_key', cloudinaryApiKey);
      formData.append('signature', signature);

      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/destroy`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString(),
        }
      );

      const result: any = await response.json();
      if (result.result === 'ok') {
        return { success: true, message: `Asset "${publicId}" deleted successfully.` };
      }

      return {
        success: false,
        message: result.result || result.error?.message || 'Failed to delete asset from Cloudinary',
      };
    } catch (err: any) {
      console.error(`[BackendCloudinaryService] Error deleting asset "${publicId}":`, err);
      return { success: false, message: err?.message || 'Network error deleting Cloudinary asset.' };
    }
  }
}
