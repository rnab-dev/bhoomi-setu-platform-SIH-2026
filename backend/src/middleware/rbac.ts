import { Request, Response, NextFunction } from 'express';
import { OfficialRole } from '@prisma/client';

export const requireRole = (allowedRoles: OfficialRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.user_type !== 'OFFICIAL' || !req.user.officialProfile) {
      res.status(403).json({ error: 'Access restricted to Officials' });
      return;
    }

    if (!allowedRoles.includes(req.user.officialProfile.role)) {
      res.status(403).json({ error: 'Insufficient permissions for this action' });
      return;
    }

    next();
  };
};

export const requireUserType = (allowedType: 'CITIZEN' | 'OFFICIAL') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (req.user?.user_type !== allowedType) {
      res.status(403).json({ error: `Access restricted to ${allowedType}s` });
      return;
    }
    next();
  };
};
