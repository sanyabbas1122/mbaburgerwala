import express, { urlencoded } from "express";
import dotenv from "dotenv";
import {connectPassport} from './utils/Provider.js'
import session from "express-session"
import passport from 'passport'
import cookieparcer from 'cookie-parser'
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import cors from 'cors'
//import { Passport } from "passport";
//import { errorMiddleware } from "./middlewares/errorMiddleware.js";




const app = express();
export default app;


dotenv.config({
    path: "./config/config.env",
});


// Using Middlewares

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,

    cookie:{
        secure:process.env.MODE_ENV === "development" ? false : true,
        httpOnly:process.env.MODE_ENV === "development" ? false : true,
        sameSite:process.env.MODE_ENV === "development" ? false : "none",

    }
}));


app.use(cookieparcer());
app.use(express.json());
app.use(
    urlencoded({
        extended: true,
    })
);

app.use(cors({
    credentials:true,
    origin:process.env.FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
}))

//session use ky bad passport ko use krna hai foran

app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());
app.enable("trust proxy");


connectPassport();



//Importing Routes
import userRoute from './routes/user.js'
import orderRoute from './routes/order.js'



app.use("/api/v1", userRoute);
app.use("/api/v1", orderRoute );



// Using Error MiddleWare in last must
app.use(errorMiddleware);