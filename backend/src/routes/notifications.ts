import { Router } from 'express';

const router = Router();

// TODO: Implement notifications routes
router.get('/', (req, res) => {
  res.json({ message: 'Get notifications route' });
});

router.patch('/:id/read', (req, res) => {
  res.json({ message: 'Mark notification as read route' });
});

export default router;
