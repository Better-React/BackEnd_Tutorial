import {Schema, model, HookNextFunction} from 'mongoose';
import {UserInfo , IUser, IUserModel} from './user.interface';
import bcrypt from 'bcrypt';
import moment from 'moment';

const jwt=require('jsonwebtoken');
const saltRounds = 10;

const userSchema : Schema<UserInfo> = new Schema({
    name: {
        type: String,
        required: true,
        maxlength: 50
    },
    email: {
        type: String,
        required: true,
        unique: 1
    },
    password: {
        type: String,
        required: true,
        minglength: 5
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    },
    image: {
        type: String
    }
})

userSchema.pre<IUser>('save', function(next:HookNextFunction){
    if(this.isModified('password')){
        bcrypt.genSalt(saltRounds, (err: Error, salt:string) => {
            if(err) return next(err);
            bcrypt.hash(this.password, salt, (err: Error, hash: string) => {
                if(err) return next(err);
                this.password = hash;
                next();
            })
        })
    }else{
        next();
    }
})


userSchema.methods.comparePassword = function(plainPassword: string, cb: Function){
    bcrypt.compare(plainPassword, this.password, function(err: Error, isMatch: boolean){
        cb(err, isMatch);
    })
}

userSchema.methods.generateToken = function(cb: Function){
    this.token = jwt.sign(this._id.toHexString(),'secret');
    this.tokenExp = moment().add(1, 'hour').valueOf();
    this.save((err: Error|null, user: UserInfo) => {
        cb(err,user);
    })
}

userSchema.statics.findByToken = function(token: string, cb: Function){
    jwt.verify(token, 'secret', (err: Error|null, decode?:object)=>{
        this.findOne({"_id": decode, "token": token}, (err: Error, user: IUser) => {
            cb(err, user);
        })
    })
}
export const User: IUserModel = model<IUser, IUserModel>('Login_User', userSchema);

export default User;