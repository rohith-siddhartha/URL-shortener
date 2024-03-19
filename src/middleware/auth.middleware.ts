import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    
    const token = req.cookies['token'];

    if (token) {
        verify(token, process.env.JWT_KEY, (error: any, decoded: any) => {
        if (error) {
          res.status(401).json({message:'Unauthorized Request'});
        } else {
          (req as any).user = decoded; // Attach user details to request
          next();
        }
      });
    } else {
      res.status(401).send('Unauthorized Request');
    }

  }
}
