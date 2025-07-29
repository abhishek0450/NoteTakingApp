import nodemailer from 'nodemailer';
import otpGenerator from 'otp-generator';
import dotenv from 'dotenv';

dotenv.config();

const otpStore = new Map<string, string>();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendOtp = async (email: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const otp = otpGenerator.generate(6, { upperCaseAlphabets: false, specialChars: false });
  otpStore.set(normalizedEmail, otp);

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is ${otp}. 
    NOTE: This code is valid for 5 minutes. If you did not request this, please ignore this email.`,
  };

  await transporter.sendMail(mailOptions);
  setTimeout(() => otpStore.delete(normalizedEmail), 5 * 60 * 1000); 
};

export const verifyOtp = (email: string, otp: string) => {
  const normalizedEmail = email.trim().toLowerCase();
  const storedOtp = otpStore.get(normalizedEmail);
  const isValid = storedOtp === otp;
  if (!isValid) {
    console.log(`OTP verification failed for email: ${normalizedEmail}. Provided: ${otp}, Stored: ${storedOtp}`);
  }
  return isValid;
};
