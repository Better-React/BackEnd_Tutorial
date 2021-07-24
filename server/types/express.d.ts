import { IUser } from "../models/user.interface";

declare module 'express-serve-static-core'{
    export interface Request{
        tokenExp: Number;
        token: string;
        user: IUser;
    }
};