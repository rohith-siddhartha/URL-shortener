import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Response } from 'express';

@Controller('user')
export class UserController {

    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() user:User, @Res() res: Response) {
        
        try {
            const createdUser:User = await this.userService.create(user);
            const token = await this.userService.login(user.username, user.password);
            res.cookie('token', token, { httpOnly: true });
            res.status(201).json(createdUser);
        } catch (error) {
            res.status(error.status).send({ message: error.message });
        }        

    }


    @Post('login')
    async login(@Body() user:User, @Res() res: Response) {
        const { username, password } = user;
        try {
            const token = await this.userService.login(username, password);
            res.cookie('token', token, { httpOnly: true });
            return res.status(200).json({ message: 'Login successful' });
        } catch (error) {
            return res.status(error.status).send({ message: error.message });
        }
    }

}
