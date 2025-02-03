import express from 'express';
import { editprofile, login, signup, userdetails } from '../controllers/authcontroller';


const router = express.Router();

// Signup Route
router.post('/signup', signup);

// Login Route
router.post('/login', login);
router.get('/user/:id',userdetails)
router.post('/update/:id',editprofile)

export default router;
