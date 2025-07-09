import { Router } from 'express';

const router = Router();

// TODO: Implement admin routes
router.get('/users', (req, res) => {
  res.json({ message: 'Get users (admin) route' });
});

router.get('/analytics', (req, res) => {
  res.json({ message: 'Get analytics (admin) route' });
});

router.post('/moderate/:type/:id', (req, res) => {
  res.json({ message: 'Moderate content (admin) route' });
});

export default router;
