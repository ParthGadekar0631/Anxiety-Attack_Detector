import { Request, Response } from 'express';
import { analyticsService } from '../services/analytics.service';
import { HttpStatus } from '../utils/httpStatus';

class AnalyticsController {
  summary = async (_req: Request, res: Response) => {
    const summary = await analyticsService.getSystemSummary();
    res.status(HttpStatus.OK).json(summary);
  };
}

export const analyticsController = new AnalyticsController();
