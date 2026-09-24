import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { caseJurisdictionFilter } from '../lib/jurisdiction';

const prisma = new PrismaClient();

export const getAcquisitionCases = async (req: Request, res: Response): Promise<void> => {
  try {
    // Implicitly scope cases to the official's geographic assignment
    const cases = await prisma.acquisitionCase.findMany({
      where: caseJurisdictionFilter(req.user)
    });
    
    res.json({ count: cases.length, cases });
  } catch (error) {
    res.status(500).json({ error: 'Server Error' });
  }
};
