import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import mongoose from "mongoose";
import path from "path";
import cookieParser from "cookie-parser";
dotenv.config();
const config = require("./config/key");

if(!process.env.PORT){
    process.exit(1);
}

const PORT: number = parseInt(process.env.PORT as string ,10);
const app = express();
const connect = mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB Connected ...'))
  .catch(err => console.log(err));


app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use("/api/users", require('./routes/user.route'));

if(process.env.NODE_ENV === "production"){
    app.use(express.static("client/build"));
    app.get("*", (req: Request, res: Response) => {
        res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
    });
}

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})