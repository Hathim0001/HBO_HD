import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import http from "http";
import mongoose from "mongoose";
import dotenv from "dotenv";
import routes from "./src/routes/index.js";

const app = express();
dotenv.config()
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/v1", routes);

const port = process.env.PORT || 5001;

const server = http.createServer(app);

mongoose.connect("mongodb+srv://hathim:hathim2226@ratedmovies.vvfhh.mongodb.net/?retryWrites=true&w=majority&appName=RatedMovies").then(() => {
  console.log("Mongodb connected");
  server.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
  });
}).catch((err) => {
  console.log({ err });
  process.exit(1);
});

//test