import { Request, Response } from 'express';
import { AuthService } from '@/services/auth.service';
import { sendSuccess, sendError, sendServerError } from '@/utils/response';
import { AuthenticatedRequest } from '@/types';

const authService = new AuthService();

export class AuthController {
  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { name, email, password } = req.body;
      
      const result = await authService.register(name, email, password);
      
      return sendSuccess(res, result, 'User registered successfully', 201);
    } catch (error) {
      if (error instanceof Error) {
        return sendError(res, error.message, 400);
      }
      return sendServerError(res);
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    try {
      const { email, password } = req.body;
      
      const result = await authService.login(email, password);
      
      return sendSuccess(res, result, 'Login successful');
    } catch (error) {
      if (error instanceof Error) {
        return sendError(res, error.message, 401);
      }
      return sendServerError(res);
    }
  }

  async refreshToken(req: Request, res: Response): Promise<Response> {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return sendError(res, 'Refresh token required', 400);
      }
      
      const tokens = await authService.refreshToken(refreshToken);
      
      return sendSuccess(res, tokens, 'Token refreshed successfully');
    } catch (error) {
      if (error instanceof Error) {
        return sendError(res, error.message, 401);
      }
      return sendServerError(res);
    }
  }

  async getMe(req: AuthenticatedRequest, res: Response): Promise<Response> {
    try {
      if (!req.user) {
        return sendError(res, 'User not authenticated', 401);
      }

      const user = await authService.getUserById(req.user.id);
      
      if (!user) {
        return sendError(res, 'User not found', 404);
      }
      
      return sendSuccess(res, user);
    } catch (error) {
      return sendServerError(res);
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<Response> {
    try {
      // TODO: Implement password reset functionality
      return sendSuccess(res, null, 'Password reset functionality coming soon');
    } catch (error) {
      return sendServerError(res);
    }
  }
}