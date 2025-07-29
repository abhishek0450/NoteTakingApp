import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User';
import { generateToken } from '../utils/jwt';
import { sendOtp, verifyOtp } from '../services/otpService';

// Initialize Google OAuth2 client
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '394117500069-tca5knd5rbpgg20ahs3i872b6ag2jnas.apps.googleusercontent.com';
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

/**
 * @description Start the signup process by sending an OTP
 */
export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, dateOfBirth } = req.body;
    if (!name || !email || !password || !dateOfBirth) {
      return res.status(400).json({ message: 'Name, email, password, and date of birth are required.' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    await sendOtp(email);
    res.status(200).json({ message: 'OTP sent to email.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @description Verify OTP and complete the signup process
 */
export const verifyOtpAndSignup = async (req: Request, res: Response) => {
  try {
    const { name, email, password, otp, dateOfBirth } = req.body;
    if (!name || !email || !password || !otp || !dateOfBirth) {
      return res.status(400).json({ message: 'All fields including name, email, password, DOB, and OTP are required.' });
    }

    if (verifyOtp(email, otp)) {
      const user = new User({ name, email, password, dateOfBirth });
      await user.save();
      const token = generateToken(user._id.toString());
      res.status(201).json({ token, user });
    } else {
      res.status(400).json({ message: 'Invalid OTP.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @description Sign in a user with email and password
 */
export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user._id.toString());
    res.status(200).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @description Send an OTP to an existing user for signing in
 */
export const sendSigninOtp = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      // More secure: don't reveal if a user exists or not.
      return res.status(200).json({ message: 'If a user with that email exists, an OTP has been sent.' });
    }

    await sendOtp(email);
    res.status(200).json({ message: 'If a user with that email exists, an OTP has been sent.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

/**
 * @description Sign in a user by verifying their OTP
 */
export const verifySigninOtp = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required.' });
      }
  
      if (verifyOtp(email, otp)) {
        const user = await User.findOne({ email });
        if (!user) {
          return res.status(400).json({ message: 'Authentication failed.' });
        }
  
        const token = generateToken(user._id.toString());
        res.status(200).json({ token, user });
      } else {
        res.status(400).json({ message: 'Invalid OTP.' });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
};

/**
 * @description Handle user signup or signin via Google OAuth
 */
export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ message: 'Google token is required.' });
    }

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email) {
      return res.status(400).json({ message: 'Invalid Google token.' });
    }

    const { email, name, sub: googleId } = payload;
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        googleId,
        dateOfBirth: new Date('1970-01-01') 
      });
      await user.save();
    }

    const jwtToken = generateToken(user._id.toString());
    res.status(201).json({ token: jwtToken, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error while authenticating with Google.' });
  }
};