import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '@/config/env';
import { AuthenticatedRequest, JwtPayload } from '@/types';
import prisma from '@/config/database';

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Access token required'
      });
    }

    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    
    // Fetch user from database to ensure they still exist and get latest data
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId }
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'User not found'
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(403).json({
        success: false,
        error: 'Invalid token'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Authentication error'
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: 'Insufficient permissions'
      });
    }

    next();
  };
};

export const requireAdmin = requireRole(['ADMIN']);
export const requireInstructorOrAdmin = requireRole(['INSTRUCTOR', 'ADMIN']);