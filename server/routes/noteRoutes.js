import express from 'express';
import { 
  createNote, 
  getNotes, 
  getNotesByCategory, 
  getNote, 
  updateNote,
  trashNote, 
  getTrashNotes,
  restoreNote,
  deleteNote 
} from '../controllers/noteController.js';

const router = express.Router();

// 基本笔记路由
router.post('/', createNote);
router.get('/user/:userId', getNotes);
router.get('/:id', getNote);
router.put('/:id', updateNote);
router.put('/trash/:id', trashNote);
router.get('/trash/:userId', getTrashNotes);
router.put('/restore/:id', restoreNote);
router.delete('/:id', deleteNote);

// 分类相关路由
router.get('/categories/:userId/:categoryId', getNotesByCategory);

export default router;