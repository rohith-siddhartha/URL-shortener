import { Body, Controller, Get, HttpException, HttpStatus, Inject, Param, Post, Req, Res, UseGuards, UseInterceptors } from '@nestjs/common';
import { Url } from './enitities/url.entity';
import { Request, Response } from 'express';
import { UrlService } from './url.service';
import { CACHE_MANAGER, Cache, CacheInterceptor, CacheTTL} from '@nestjs/cache-manager';
import { Click } from './enitities/click.enity';

@Controller()
export class UrlController {

    constructor(private readonly urlService: UrlService, @Inject(CACHE_MANAGER) private cache: Cache) {}

    @Post('url')
    async createUrl(@Req() req: Request, @Body() body:{fullUrl:string, expiresAt:Date}) {
        
        try {
            const { fullUrl, expiresAt } = req.body;
            const user = (req as any).user;
            const url = await this.urlService.createUrl(fullUrl, expiresAt, user);
            return url;
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }

    @Get('url/all')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(60)
    async getAllUrls(@Req() req: Request): Promise<Url[]> {
        try {
            const user = (req as any).user;
            const urls: Url[] = await this.urlService.getAllUrls(user);
            return urls;
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':shortUrl/clicks')
    @UseInterceptors(CacheInterceptor)
    @CacheTTL(60)
    async getAllClicks(@Param('shortUrl') shortUrl: string, @Req() req: Request): Promise<Click[]> {
        try {
            
            const user = (req as any).user;
            const clicks = await this.urlService.getAllClicks(shortUrl, user);

            return clicks;
        } catch (error) {
            throw new HttpException(error.message || 'Internal Server Error', error.status || HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get(':shortUrl')
    async redirect(@Param('shortUrl') shortUrl: string, @Req() req: Request, @Res() res: Response): Promise<void> {
        try {

            const cachedUrl: string = await this.cache.get(shortUrl);
            if (cachedUrl) {
                res.redirect(cachedUrl);
                return;
            }

            const url = await this.urlService.getUrl(shortUrl);

            const referralSource = req.headers.referer;
            const userAgent = req.useragent;
            
            await this.urlService.createClick(url.id, referralSource, userAgent);

            await this.cache.set(shortUrl, url.fullUrl, 3600);

            res.redirect(url.fullUrl);
        } catch (error) {
            res.status(error.status || HttpStatus.INTERNAL_SERVER_ERROR).json({
                message:error.message || 'Internal Server Error'
            });
        }
    }

}
