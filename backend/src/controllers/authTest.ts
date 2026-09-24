import { Request, Response } from 'express';

export const citizenDashboard = async (req: Request, res: Response): Promise<void> => {
  // Verify Citizen: Login -> JWT -> Express -> AppUser -> Person
  if (req.user?.user_type !== 'CITIZEN' || !req.user.person) {
     res.status(403).json({ error: 'Citizen access required' });
     return;
  }
  
  res.json({
    message: 'Welcome Citizen',
    personId: req.user.person.id,
    fullName: req.user.person.full_name
  });
};

export const officialDashboard = async (req: Request, res: Response): Promise<void> => {
  // Verify Official: Login -> JWT -> Express -> AppUser -> OfficialProfile
  if (req.user?.user_type !== 'OFFICIAL' || !req.user.officialProfile) {
     res.status(403).json({ error: 'Official access required' });
     return;
  }
  
  res.json({
    message: 'Welcome Official',
    role: req.user.officialProfile.role,
    jurisdiction: req.user.officialProfile.jurisdiction_level
  });
};
