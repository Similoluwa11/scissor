import { Test, TestingModule } from '@nestjs/testing';
import { UrlsService } from './urls.service';
import { getModelToken } from '@nestjs/mongoose';
import { Url } from './schema/url.schema';
import * as QRCode from 'qrcode';

jest.mock('qrcode', () => ({
  toDataURL: jest.fn(),
}));

describe('UrlsService', () => {
  let service: UrlsService;
  const mockUrl = {
    originalUrl: 'https://example.com',
    shortId: 'abcd1234',
    clicks: 0,
    
  };

  beforeEach(async () => {
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [UrlsService, {
        provide: getModelToken(Url.name),
        useValue: {
          new: jest.fn().mockResolvedValue(mockUrl),
          constructor: jest.fn().mockResolvedValue(mockUrl),
          find: jest.fn(),
          findOne: jest.fn().mockImplementation(({ shortId }) =>
              Promise.resolve(shortId === mockUrl.shortId ? mockUrl : null)),
          findOneAndUpdate: jest.fn().mockImplementation(({ shortId }, update) =>
              Promise.resolve({ ...mockUrl, clicks: mockUrl.clicks + 1 })),
          create: jest.fn().mockResolvedValue(mockUrl),
        },
      }],
    }).compile();

    service = module.get<UrlsService>(UrlsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should shorten url', async () => {
    const originalUrl = 'https://example.com';
    const result = await service.shortenUrl(originalUrl);
    expect(result).toEqual(mockUrl);
    expect(result.originalUrl).toEqual(originalUrl);
  });
  it('should get URL by shortId', async () => {
    const result = await service.getUrl(mockUrl.shortId);
    expect(result).toEqual(mockUrl);
  });

  it('should increment clicks', async () => {
    const result = await service.incrementClicks(mockUrl.shortId);
    expect(result.clicks).toEqual(mockUrl.clicks + 1);
  });

  it('should generate QR code', async () => {
    const url = 'http://localhost:3000/urls/abcd1234';
    const mockQRCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA';
    QRCode.toDataURL.mockResolvedValue(mockQRCode);

    const result = await service.generateQRCode(url);
    expect(QRCode.toDataURL).toHaveBeenCalledWith(url);
    expect(result).toEqual(mockQRCode);
  });
});
