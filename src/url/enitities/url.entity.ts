import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { Click } from './click.enity';
import { User } from 'src/user/user.entity';

@Entity()
export class Url {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({nullable:false})
  fullUrl: string;

  @Column({nullable:false, unique: true})
  shortUrl: string;

  @Column({nullable:false})
  expiresOn: Date;

  @ManyToOne(() => User, user => user.urls, {nullable:false})
  user: User;

  @OneToMany(() => Click, click => click.url)
  clicks: Click[];
}