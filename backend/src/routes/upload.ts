import { Router } from 'express';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// TODO: Implement upload routes
router.post('/image', upload.single('image'), (req, res) => {
  res.json({ message: 'Upload image route' });
});

router.post('/file', upload.single('file'), (req, res) => {
  res.json({ message: 'Upload file route' });
});

export default router;
