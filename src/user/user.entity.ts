import { Entity, Column, PrimaryColumn, OneToMany } from 'typeorm';
import { Url } from 'src/url/enitities/url.entity';

@Entity()
export class User {
  @PrimaryColumn({nullable:false})
  username: string;

  @Column({nullable:false})
  password: string;

  @OneToMany(() => Url, url => url.user)
  urls: Url[];

}