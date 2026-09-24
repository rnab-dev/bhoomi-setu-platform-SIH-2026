import { Request, Response, NextFunction } from 'express';
import { PrismaClient, AppUser, OfficialProfile, Person } from '@prisma/client';
import * as jose from 'jose';

const prisma = new PrismaClient();

declare global {
  namespace Express {
    interface Request {
      user?: AppUser & {
        person?: Person | null;
        officialProfile?: OfficialProfile | null;
      };
    }
  }
}

export const requireAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
       res.status(401).json({ error: 'Missing authorization header' });
       return;
    }
    
    const token = authHeader.split(' ')[1];
    
    if (!process.env.SUPABASE_JWT_SECRET) {
       console.error("SUPABASE_JWT_SECRET is not set.");
       res.status(500).json({ error: 'Server configuration error' });
       return;
    }

    const secret = new TextEncoder().encode(process.env.SUPABASE_JWT_SECRET);

    let payload;
    try {
      const { payload: jwtPayload } = await jose.jwtVerify(token, secret);
      payload = jwtPayload;
    } catch (e) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    const supabaseUserId = payload.sub;
    if (!supabaseUserId) {
      res.status(401).json({ error: 'Token missing user identity' });
      return;
    }
    
    const appUser = await prisma.appUser.findUnique({
      where: { auth_user_id: supabaseUserId },
      include: {
        person: true,
        officialProfile: true
      }
    });

    if (!appUser) {
       res.status(401).json({ error: 'User not registered in database' });
       return;
    }

    req.user = appUser;
    next();
  } catch (error) {
    res.status(500).json({ error: 'Internal authentication error' });
  }
};
