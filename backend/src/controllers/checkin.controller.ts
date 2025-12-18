import { Request, Response } from 'express';
import { checkinService } from '../services/checkin.service';
import { HttpStatus } from '../utils/httpStatus';

class CheckinController {
  submit = async (req: Request, res: Response) => {
    const userId = req.user?.sub as string;
    const checkin = await checkinService.submit(userId, req.body);
    res.status(HttpStatus.CREATED).json(checkin);
  };

  mySummary = async (req: Request, res: Response) => {
    const userId = req.user?.sub as string;
    const summary = await checkinService.getPatientSummary(userId);
    res.status(HttpStatus.OK).json(summary);
  };

  patients = async (_req: Request, res: Response) => {
    const patients = await checkinService.listPatientsForProvider();
    res.status(HttpStatus.OK).json(patients);
  };
}

export const checkinController = new CheckinController();
