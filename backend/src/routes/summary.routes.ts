import express from 'express';
import { getSummary } from '../controllers/summary.controller';

const router = express.Router();

router.get('/get/:groupId', getSummary);
export default router;

