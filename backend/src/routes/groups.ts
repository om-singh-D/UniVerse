import { Router } from 'express';

const router = Router();

// TODO: Implement groups routes
router.get('/', (req, res) => {
  res.json({ message: 'Get groups route' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create group route' });
});

router.post('/:id/join', (req, res) => {
  res.json({ message: 'Join group route' });
});

export default router;
