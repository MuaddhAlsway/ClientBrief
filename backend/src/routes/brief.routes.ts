import { Router } from 'express';
import { submitBrief } from '../controllers/brief.controller.js';
import { briefLimiter } from '../middleware/rateLimit.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const briefRouter = Router();

briefRouter.post('/brief', briefLimiter, asyncHandler(submitBrief));
