import { Request, Response } from "express";
import User from "../models/user.ts";
import bcrypt from "bcrypt";

// register
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    // Create the user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    // setting user data in session
    req.session.isLoggedIn = true;
    req.session.userId = newUser._id;

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        name: newUser.name,
        email: newUser.email,
        _id: newUser._id,
        tier: newUser.tier,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// login
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    // setting user data in session
    req.session.isLoggedIn = true;
    req.session.userId = user._id;

    return res.status(200).json({
      message: "User logged in successfully",
      user: {
        name: user.name,
        email: user.email,
        _id: user._id,
        tier: user.tier,
      },
    });
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
};

// logout
export const logoutUser = async (req: Request, res: Response) => {
  try {
    req.session.destroy((error: any) => {
      if (error) {
        console.log(error);
        return res
          .status(500)
          .json({ message: error?.message || "Internal server error" });
      }
    });
    return res.status(200).json({ message: "User logged out successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// user verify
export const verifyUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.session;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(400).json({ message: "Invalid user" });
    }
    return res.status(200).json({
      message: "User verified successfully",
      user,
    });
  } catch (error: any) {
    console.error(error);
    return res
      .status(500)
      .json({ message: error?.message || "Internal server error" });
  }
};
