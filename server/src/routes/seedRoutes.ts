import { Router, Request, Response } from 'express';
import { seedDatabase, getSeedStatus } from '../services/clientService';

const router = Router();

// POST /api/seed - Idempotent seed endpoint
router.post('/', async (req: Request, res: Response) => {
  try {
    const force = req.query.force === 'true' || req.body?.force === true;
    const result = await seedDatabase(force);
    res.json(result);
  } catch (error: any) {
    console.error('Seed error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to seed database'
    });
  }
});

// GET /api/seed/status - Get current seed / bank status
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const status = await getSeedStatus();
    res.json(status);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to retrieve seed status' });
  }
});

export { router as seedRoutes };
