import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlController } from './url.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from './enitities/url.entity';
import { Click } from './enitities/click.enity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Url]),
        TypeOrmModule.forFeature([Click])
    ],
    controllers: [UrlController],
    providers:[UrlService]
})
export class UrlModule {}
