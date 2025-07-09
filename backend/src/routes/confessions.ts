import { Router } from 'express';

const router = Router();

// TODO: Implement confession routes
router.get('/', (req, res) => {
  res.json({ message: 'Get confessions route' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create confession route' });
});

export default router;
