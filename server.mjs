import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

const mongoUri = process.env.MONGO_URI;

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3000;

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});

const User = mongoose.model("User", userSchema);

// Get Request
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find(); // Fetch users from MongoDB
    res
      .status(200)
      .json({ message: "Fetching all users from the database", data: users });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});
