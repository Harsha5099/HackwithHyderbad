import { Router, Request, Response } from 'express';
import {
  getAllClients,
  getClient,
  createClient,
  getClientInteractions,
  createInteraction,
  chatWithClient,
  generateMeetingBrief,
  getClientMemory,
  submitFeedback
} from '../services/clientService';

const router = Router();

// GET /api/clients - List all clients with stats
router.get('/', (_req: Request, res: Response) => {
  try {
    const clients = getAllClients();
    res.json(clients);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch clients' });
  }
});

// GET /api/clients/:id - Get client by ID
router.get('/:id', (req: Request, res: Response) => {
  try {
    const client = getClient(req.params.id);
    if (!client) {
      return res.status(404).json({ error: 'Client not found' });
    }
    res.json(client);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch client' });
  }
});

// GET /api/clients/:id/interactions - Timeline of interactions
router.get('/:id/interactions', (req: Request, res: Response) => {
  try {
    const interactions = getClientInteractions(req.params.id);
    res.json(interactions);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to fetch interactions' });
  }
});

// POST /api/clients/:id/interactions - Add interaction & retain into Hindsight
router.post('/:id/interactions', async (req: Request, res: Response) => {
  try {
    const { title, content, type, date } = req.body;
    if (!title || !content || !type) {
      return res.status(400).json({ error: 'title, content, and type are required fields' });
    }

    const interaction = await createInteraction(req.params.id, {
      title,
      content,
      type,
      date: date || new Date().toISOString()
    });

    res.status(201).json(interaction);
  } catch (error: any) {
    console.error('Create interaction error:', error);
    res.status(400).json({ error: error.message || 'Failed to create interaction' });
  }
});

// POST /api/clients/:id/chat - AI Assistant grounded in Hindsight memory
router.post('/:id/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'message is required' });
    }

    const result = await chatWithClient(req.params.id, message, history || []);
    res.json(result);
  } catch (error: any) {
    console.error('Chat error:', error);
    res.status(500).json({ error: error.message || 'Failed to process chat message' });
  }
});

// POST /api/clients/:id/meeting-brief - Generate structured brief using Hindsight
router.post('/:id/meeting-brief', async (req: Request, res: Response) => {
  try {
    const result = await generateMeetingBrief(req.params.id);
    res.json(result);
  } catch (error: any) {
    console.error('Meeting brief error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate meeting brief' });
  }
});

// GET /api/clients/:id/memory - Categorized Hindsight Memory Dashboard
router.get('/:id/memory', async (req: Request, res: Response) => {
  try {
    const memory = await getClientMemory(req.params.id);
    res.json(memory);
  } catch (error: any) {
    console.error('Memory fetch error:', error);
    res.status(500).json({ error: error.message || 'Failed to fetch client memory' });
  }
});

// POST /api/clients/:id/feedback - Feedback loop to learn from outcomes
router.post('/:id/feedback', async (req: Request, res: Response) => {
  try {
    const { feedback, helpful, interactionId, context } = req.body;
    if (feedback === undefined || helpful === undefined) {
      return res.status(400).json({ error: 'feedback and helpful boolean are required' });
    }

    await submitFeedback(req.params.id, feedback, helpful, interactionId, context);
    res.json({
      success: true,
      message: 'Feedback retained in Hindsight long-term memory for future reasoning.'
    });
  } catch (error: any) {
    console.error('Feedback error:', error);
    res.status(500).json({ error: error.message || 'Failed to submit feedback' });
  }
});

export { router as clientRoutes };
