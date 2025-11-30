import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import postRoutes from "./routes/posts.routes.js"
import userRoutes from "./routes/user.routes.js"

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use(postRoutes);
app.use(userRoutes);
app.use(express.static("uploads"))

const start = async () => {
    const connectDB = await mongoose.connect("mongodb+srv://maurya50706_db_user:11KIeSAlDFbCBInM@devconnector.pyzxpl0.mongodb.net/?appName=devconnector")

    app.listen(9090, () =>{
        console.log("server is running on port 9090");
    })
}


start();