// importData.js

import dotenv from 'dotenv';
dotenv.config();  // Make sure this is at the very top of your file

import mongoose from "mongoose";

import axios from "axios";
import Favorite from "./src/models/favorite.model.js"; // Favourite model
import Review from "./src/models/review.model.js"; // Review model
import User from "./src/models/user.model.js"; // User model



// Connect to MongoDB database
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Database connected!");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

// Fetch data from TMDb API
const fetchDataFromTMDb = async () => {
  try {
    const response = await axios.get(
      `https://api.themoviedb.org/3/movie/popular?api_key=${process.env.TMDB_API_KEY}&language=en-US&page=1`
    );
    return response.data.results;
  } catch (error) {
    console.error("Error fetching data from TMDb:", error.message);
    process.exit(1);
  }
};

// Import data into models
const importData = async () => {
  try {
    const movies = await fetchDataFromTMDb();

    // Insert data into the Favorite model
    await Favorite.insertMany(
      movies.map((movie) => ({
        user: "SomeUserId", // Replace with actual user ObjectId if available
        mediaType: "movie",
        mediaId: movie.id.toString(),
        mediaTitle: movie.title,
        mediaPoster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        mediaRate: movie.vote_average,
      }))
    );

    // Insert data into the Review model
    await Review.insertMany(
      movies.map((movie) => ({
        user: "SomeUserId", // Replace with actual user ObjectId if available
        content: `This is a review for ${movie.title}`,
        mediaType: "movie",
        mediaId: movie.id.toString(),
        mediaTitle: movie.title,
        mediaPoster: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
      }))
    );

    // Insert data into the User model
    await User.insertMany(
      movies.map((movie, index) => ({
        username: `user${index + 1}`,
        displayName: `User ${index + 1}`,
        password: "password123", // Ideally, generate passwords securely
        salt: "someSalt", // Ideally, generate salt securely
      }))
    );

    console.log("Data imported successfully!");
    process.exit();
  } catch (error) {
    console.error("Error importing data:", error.message);
    process.exit(1);
  }
};

// Run the script
(async () => {
  await connectDB();
  await importData();
})();
