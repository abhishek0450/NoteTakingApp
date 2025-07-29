import express from 'express';
import {
  signup,
  verifyOtpAndSignup,
  signin,
  sendSigninOtp,
  verifySigninOtp,
  googleAuth
} from '../controllers/authController';

const router = express.Router();

router.post('/signup', signup);
router.post('/verify-otp', verifyOtpAndSignup);
router.post('/signin', signin);

router.post('/send-signin-otp', sendSigninOtp);
router.post('/verify-signin-otp', verifySigninOtp);

router.post('/google', googleAuth);
router.post('/google-signup', googleAuth);

export default router;