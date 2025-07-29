export interface SigninFormData {
  email: string;
  password: string;
  otp?: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
  dateOfBirth: string;
}

export interface OtpFormData {
  name?: string;
  email: string;
  password?: string;
  otp: string;
  dateOfBirth?: string;
}

export const signin = (formData: SigninFormData) => API.post('/auth/signin', formData);
export const sendSigninOtp = (formData: SigninFormData) => API.post('/auth/send-signin-otp', formData);
import axios from 'axios';

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

API.interceptors.request.use((req) => {
  if (localStorage.getItem('token')) {
    req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
  }
  return req;
});

export const signup = (formData: SignupFormData) => API.post('/auth/signup', formData);
export const verifyOtp = (formData: OtpFormData) => API.post('/auth/verify-otp', formData);
export const googleSignup = (formData: { token: string }) => API.post('/auth/google-signup', formData);

export const getNotes = () => API.get('/notes');
export interface NoteData {
  title: string;
  content: string;
}
export const createNote = (newNote: NoteData) => API.post('/notes', newNote);
export const deleteNote = (id: string) => API.delete(`/notes/${id}`);
