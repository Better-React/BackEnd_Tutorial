import { Request, Response, Router } from "express";
import { User } from "../models/user.model";
import { IUser } from "../models/user.interface";
import { auth } from "../middleware/auth.middleware";

const router = Router();

router.get("/auth", auth, (req: Request, res: Response) => {
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role ===0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        role: req.user.role,
        image: req.user.image,
    })
})
router.post("/register", (req: Request, res: Response) => {
    const user: IUser = new User( req.body );
    user.save((err: Error|null, userData: IUser)=>{
        if (err) return res.json({
            success: false,
            err
        });
        return res.status(200).json({
            success: true,
            userData: userData
        });
    }); 
});
router.post("/login", (req: Request, res: Response) => {
    User.findOne({email: req.body.email}, (err: Error, user:IUser) => {
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "email not found"
            });
        }
        user.comparePassword(req.body.password, (err: Error, isMatch: boolean) => {
            if(!isMatch){
                return res.json({
                    loginSuccess: false,
                    message: "wrong password"
                });
            }
            user.generateToken((err:Error, user: IUser) => {
                if(err) return res.status(400).send(err);
                res.cookie("w_authExp", user.tokenExp);
                res.cookie("w_auth", user.token);
                res.status(200).json({
                    loginSuccess: true,
                    userId: user._id
                });
            });
        });
    });
});
router.get("/logout", auth, (req: Request, res: Response) => {
    User.findOneAndUpdate({_id: req.user._id}, {token:"", tokenExp: 0},  { rawResult: true }, (err,doc)=>{
        if(err) return res.json({
            success: false,
            err
        });
        return res.status(200).send({
            success: true
        });
    });
});

module.exports = router;