import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Url } from './schema/url.schema';
import * as shortid from 'shortid';
import * as QRCode from 'qrcode';

@Injectable()
export class UrlsService {
    constructor(@InjectModel(Url.name) private urlModel: Model<Url>) {}
    
    async shortenUrl(originalUrl: string, customSlug?: string): Promise<Url> {
        const shortId = customSlug || shortid.generate();
        const existingUrl = await this.urlModel.findOne({ shortId }).exec();
    if (existingUrl) {
      throw new ConflictException('This slug is already in use.');
    }
        const url = new this.urlModel({ originalUrl, shortId });
        await url.save();
        return url;
      }
      async incrementClicks(shortId: string): Promise<Url> {
        const url = await this.urlModel.findOneAndUpdate(
          { shortId },
          { $inc: { clicks: 1 } },
          { new: true },
        );
        if (!url) {
          throw new NotFoundException('URL not found.');
        }
        return url;
      }

  async getUrl(shortId: string): Promise<Url> {
    return this.urlModel.findOne({ shortId }).exec();
  }
  async generateQRCode(url: string): Promise<string> {
    return QRCode.toDataURL(url);
  }
}
