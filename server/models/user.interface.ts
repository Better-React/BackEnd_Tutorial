import {Document, Model} from 'mongoose';

export interface UserInfo extends Document{
    name: string;
    email: string;
    password: string;
    role: number;
    token: string;
    tokenExp: number;
    image: string;
}

export interface IUser extends UserInfo{
    comparePassword: (plainPassword:string, cb:Function)=>Function;
    generateToken: (cb:Function)=>Function;
}

export interface IUserModel extends Model<IUser>{
    findByToken: (token:string, cb: Function) => void;
}