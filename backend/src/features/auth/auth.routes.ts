import express from 'express';
import { isAuthme, login, logout, signup } from './auth.controller';
const router = express.Router();
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/me', isAuthme);
export default router;
