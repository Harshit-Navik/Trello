// in this file we define our server instance not run it , it will run in index.js file which is its entry point 
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true   // to allow cookie and authentication data , from cross origin resourses
}));

app.use(express.json({ limit: "16kb" }));  // to limit json data , express.json is a middleware to parse json data 
app.use(express.urlencoded());   // it is a middleware converts (parses) that raw data( basically form data ) into a usable JavaScript object 

// app.use(express.urlencoded({ extends: true}));  extends: true allows supports nested objects

app.use(express.static("public")); // to Make a folder publicly accessible over HTTP 

app.use(cookieParser());  // basically to perform CRUD operations over clients cookie from clients browser , means to access or set cookies 



export default app; 