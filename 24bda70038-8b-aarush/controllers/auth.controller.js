import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error('User already exists');
      error.statusCode = 400;
      throw error;
    }

    const hashedPassword = await argon2.hash(password);
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const isMatch = await argon2.verify(user.password, password);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: process.env.JWT_EXPIRES_IN || '5m' });
    
    res.status(200).json({ success: true, token });
  } catch (error) {
    next(error);
  }
};
