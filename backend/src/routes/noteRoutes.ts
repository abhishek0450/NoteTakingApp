import express from 'express';
import { createNote, getNotes, deleteNote } from '../controllers/noteController';
import { auth } from '../middlewares/auth';

const router = express.Router();

router.post('/', auth, createNote);
router.get('/', auth, getNotes);
router.delete('/:id', auth, deleteNote);

export default router;
