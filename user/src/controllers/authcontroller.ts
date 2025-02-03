import { Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user';

dotenv.config();

export const signup = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400).json({ error: 'Email already exists' });
      return;
    }

    const newUser = new User({
      username,
      email,
      password,
    });

    await newUser.save();

    // Generate JWT
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Check if password is correct
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(400).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    res.status(200).json({
      message: 'Login successful',
      token,
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
export const userdetails = async (req: Request, res: Response): Promise<void> => {
  

  try {
    const user = await User.findById(req.params.id).select('-password'); // Excluding password for security
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return
    }
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};
export const editprofile = async (req: Request, res: Response): Promise<void> => {
  

  try {
    const { username, phone, nickname, location, profileimg } = req.body;

    const user = await User.findById(req.params.id);
    if (!user) {
       res.status(404).json({ error: 'User not found' });
       return
    }

    // Update fields if provided
    if (username) user.username = username;
    if (phone) user.phone = phone;
    if (nickname) user.nickname = nickname;
    if (location) user.location = location;
    if (profileimg) user.profileimg = profileimg;

    await user.save();

    res.status(200).json({ message: 'Profile updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

