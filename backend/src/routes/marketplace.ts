import { Router } from 'express';

const router = Router();

// TODO: Implement marketplace routes
router.get('/items', (req, res) => {
  res.json({ message: 'Get marketplace items route' });
});

router.post('/items', (req, res) => {
  res.json({ message: 'Create marketplace item route' });
});

router.get('/categories', (req, res) => {
  res.json({ message: 'Get marketplace categories route' });
});

export default router;
