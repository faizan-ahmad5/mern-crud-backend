import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const PORT = 3000;

// MongoDB Connection
const mongoUri = process.env.MONGO_URI;

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 30000, // Increase timeout to 30 seconds
    socketTimeoutMS: 45000, // Increase socket timeout to 45 seconds
  })
  .then(() => {
    console.log("Connected to MongoDB Atlas");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

// Define User Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  age: Number,
});

// Create User Model
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

// Post Request
app.post("/api/users", async (req, res) => {
  try {
    const body = req.body;
    const newUser = new User(body); // Create new user document

    await newUser.save(); // Save the new user to MongoDB
    res.status(201).json({ message: "New user created!", data: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

// Put Request
app.put("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = req.body;

    const user = await User.findByIdAndUpdate(userId, updatedUser, {
      new: true,
    }); // Update user in MongoDB

    if (user) {
      res
        .status(200)
        .json({ message: `PUT request - Updating user ${userId}`, data: user });
    } else {
      res.status(404).json({ message: `User with ID ${userId} not found` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

// Delete Request
app.delete("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId); // Delete user from MongoDB

    if (deletedUser) {
      res.status(200).json({
        message: `DELETE request - Deleting user ${userId}`,
        deletedUser,
      });
    } else {
      res.status(404).json({ message: `User with ID ${userId} not found` });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
