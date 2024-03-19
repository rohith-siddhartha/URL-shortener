import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Url } from "./enitities/url.entity";
import { Repository } from "typeorm";
import { Click } from "./enitities/click.enity";
import { User } from "src/user/user.entity";
import { Cron } from '@nestjs/schedule';
import { LessThanOrEqual } from 'typeorm';

type UserAgent = {
  browser: string;
  version: string;
  isDesktop: boolean;
  isMobile: boolean;
  isTablet: boolean
};

@Injectable()
export class UrlService {

  constructor(
    @InjectRepository(Url)
    private urlRepository: Repository<Url>,
    @InjectRepository(Click)
    private clickRepository: Repository<Click>
  ) {}

    async createUrl(fullUrl:string, expiresOn:Date, user: User): Promise<Url> {

      try {

        const shortUrl = process.env.SERVER_ID + Date.now();

        const url = this.urlRepository.create({
          user: user,
          fullUrl: fullUrl,
          shortUrl: shortUrl,
          expiresOn: expiresOn,
          clicks:[]
        });

        const savedUrl = await this.urlRepository.save(url);
        return savedUrl;
      } catch (error) {
        throw new Error("Internal Server Error");
      }

    }

    async getUrl(shortUrl: string): Promise<Url> {
        
        try {

            const url = await this.urlRepository.findOne({where:{
              shortUrl:shortUrl
            }});
    
            return url;

        } catch (error) {
            console.log(error);
            throw new Error("Internal Server Error");
        }

    }

    async getAllUrls(user: User): Promise<Url[]> {
        
      try {

          const urls = await this.urlRepository.find({where:{
            user:{
              username:user.username
            }
          }});
  
          return urls;

      } catch (error) {
          console.log(error);
          throw new Error("Internal Server Error");
      }

  }

    async getAllClicks(shortUrl: string, user:User): Promise<Click[]> {
            
      try {

          const url = await this.urlRepository.findOne({where:{
            shortUrl,
            user:{
              username:user.username
            }
          }});

          if(!url) {
            throw new Error("Invalid url");
          }

          const clicks = await this.clickRepository.find({
            where:{
              url
            }
          });

          return clicks;

      } catch (error) {
          console.log(error);
          throw new Error("Internal Server Error");
      }

    }

    async createClick(urlId: number, referralSource: string, userAgent: UserAgent): Promise<void> {
          
      try {

          const browser = userAgent.browser + ' ' + userAgent.version;

          const deviceType = userAgent.isDesktop ? 'Desktop' :
                      userAgent.isMobile ? 'Mobile' :
                      userAgent.isTablet ? 'Tablet' : 'Unknown';

          const click = this.clickRepository.create({
            url:{
              id:urlId
            },
            referralSource,
            browser,
            deviceType,
            timestamp: new Date()
          });

          const createdClick = await this.clickRepository.save(click);

      } catch (error) {
          console.log(error);
          throw new Error("Internal Server Error");
      }

    }

    @Cron('0 0 0 * * *')
    async handleCron() {
      try {
        const today = new Date(new Date());
        today.setDate(today.getDate() + 1);
      
          const expiredUrls = await this.urlRepository.find({
            where: {
              expiresOn: LessThanOrEqual(today),
            },
            relations: ['clicks'],
          });

          for (const url of expiredUrls) {
            await this.clickRepository.remove(url.clicks);
          }

          await this.urlRepository.remove(expiredUrls);
  
          console.log('Expired URLs deleted successfully.');
      } catch (error) {
          throw new Error('Failed to delete expired URLs ');
      }
    }

}