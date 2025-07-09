import { Router } from 'express';

const router = Router();

// TODO: Implement events routes
router.get('/', (req, res) => {
  res.json({ message: 'Get events route' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create event route' });
});

router.post('/:id/rsvp', (req, res) => {
  res.json({ message: 'RSVP to event route' });
});

export default router;
