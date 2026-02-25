import { Router } from 'express';
import multer from 'multer';
import { submit_voice } from '../controller/submit-voice.js';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post('/submit-voice', upload.single('voice'), submit_voice);

export { router as voice_router };
