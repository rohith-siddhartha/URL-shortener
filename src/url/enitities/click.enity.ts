import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Url } from './url.entity';

@Entity()
export class Click {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  timestamp: Date;

  @Column({nullable:true})
  referralSource: string;

  @Column({nullable:true})
  browser: string;

  @Column({nullable:true})
  deviceType: string;

  @ManyToOne(() => Url, url => url.clicks, {nullable:false})
  url: Url;
}