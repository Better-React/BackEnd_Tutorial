import {Request, Response, NextFunction} from 'express';
import { User } from '../models/user.model';
import { IUser } from '../models/user.interface';

export let auth = (req: Request, res: Response, next: NextFunction)=>{
    let token:string =req.cookies.w_auth;
    User.findByToken(token, (err: Error, user: IUser) =>{
        if(err) throw err;
        if(!user)
            return res.json({
                isAuth: false,
                error: true
            });
        req.token=token;
        req.user=user;
        next();
    });
};