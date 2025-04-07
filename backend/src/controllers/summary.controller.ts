import { Request, Response } from 'express';
import summaryService from '../services/summary.service';

export const getSummary = async (req: Request, res: Response) => {
    try {
        const { groupId } = req.params;

        const summary = await summaryService.getSummary(groupId);

        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching summary', error });
    }
};
