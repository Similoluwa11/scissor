import { Test, TestingModule } from '@nestjs/testing';
import { UrlsController } from './urls.controller';
import { UrlsService } from './urls.service';


describe('UrlsController', () => {
  let controller: UrlsController;
  let service: UrlsService;
  const mockUrl = {
    originalUrl: 'https://example.com',
    shortId: 'example',
    clicks: 0,
  };

  beforeEach(async () => {
    
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UrlsController],
      providers: [
        {
          provide: UrlsService,
          useValue: {
            shortenUrl: jest.fn().mockResolvedValue(mockUrl),
            // Other methods as needed
          },
        },
      ],
    }).compile();

    controller = module.get<UrlsController>(UrlsController);
    service = module.get<UrlsService>(UrlsService);

  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  it('should shorten url', async () => {
    const originalUrl = 'https://example.com';
    const customSlug = 'example';
    const response = await controller.shortenUrl(originalUrl, customSlug);
    expect(response).toEqual({ originalUrl: mockUrl.originalUrl, shortUrl: expect.any(String) });
  });
});
