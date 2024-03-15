import { Controller, Get, Post, Body, Redirect, Param, HttpCode, HttpStatus, BadRequestException } from '@nestjs/common';
import { UrlsService } from './urls.service';
import { Throttle } from '@nestjs/throttler';
import { ApiTags, ApiResponse } from '@nestjs/swagger';

@ApiTags('urls')
@Controller('urls')
export class UrlsController {
  constructor(private readonly urlsService: UrlsService) {}

  @Post('shorten')
  @ApiResponse({ status: 201, description: 'URL successfully shortened' })
  @ApiResponse({ status: 400, description: 'Bad Request' })
  async shortenUrl(@Body('originalUrl') originalUrl: string, @Body('customSlug') customSlug?: string) {
   try  {
    const url = await this.urlsService.shortenUrl(originalUrl, customSlug);
    return { originalUrl: url.originalUrl, shortUrl: `http://localhost:3000/${url.shortId}` };
   } catch (error) {
    throw new BadRequestException(error.message);
   }
  }
  @Throttle({ default: { limit: 3, ttl: 60000 } })// Allows for 20 requests per 60 seconds
  @Get(':shortId')
  @Redirect('', HttpStatus.TEMPORARY_REDIRECT)
  async redirectUrl(@Param('shortId') shortId: string) {
    const url = await this.urlsService.incrementClicks(shortId);
    return { url: url.originalUrl };
  }
}

