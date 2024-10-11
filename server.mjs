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

// POST request
app.post("/api/users", async (req, res) => {
  try {
    const body = req.body;
    const newUser = new User(body);
    await newUser.save();
    res.status(201).json({ message: "New user created!", data: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
});

// PUT request
app.put("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const updatedUser = req.body;
    const user = await User.findByIdAndUpdate(userId, updatedUser, {
      new: true,
    });

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

// DELETE request
app.delete("/api/users/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    const deletedUser = await User.findByIdAndDelete(userId);

    if (deletedUser) {
      res
        .status(200)
        .json({
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
