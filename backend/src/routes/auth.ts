import { Router } from 'express';

const router = Router();

// TODO: Implement auth routes
router.post('/login', (req, res) => {
  res.json({ message: 'Auth login route' });
});

router.post('/register', (req, res) => {
  res.json({ message: 'Auth register route' });
});

export default router;
