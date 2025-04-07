import express from 'express';
import { addUser,getUsers } from '../controllers/auth.controller';
import { loginController,logout } from '../controllers/auth.controller';

const router = express.Router();

router.post('/add', addUser);
router.post('/login', loginController);
router.get("/getUser", getUsers);
router.post("/logout", logout);

export default router;





