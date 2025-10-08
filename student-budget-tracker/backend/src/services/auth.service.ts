import prisma from '@/config/database';
import { hashPassword, comparePassword, generateTokens, verifyRefreshToken } from '@/utils/auth';
import { User } from '@prisma/client';

export class AuthService {
  async register(name: string, email: string, password: string): Promise<{ user: Omit<User, 'passwordHash'>, tokens: { accessToken: string, refreshToken: string } }> {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      throw new Error('User already exists with this email');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
      }
    });

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, tokens };
  }

  async login(email: string, password: string): Promise<{ user: Omit<User, 'passwordHash'>, tokens: { accessToken: string, refreshToken: string } }> {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    // Remove password hash from response
    const { passwordHash: _, ...userWithoutPassword } = user;

    return { user: userWithoutPassword, tokens };
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string, refreshToken: string }> {
    try {
      const payload = verifyRefreshToken(refreshToken);
      
      // Verify user still exists
      const user = await prisma.user.findUnique({
        where: { id: payload.userId }
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Generate new tokens
      return generateTokens({
        userId: user.id,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  async getUserById(userId: string): Promise<Omit<User, 'passwordHash'> | null> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return null;
    }

    const { passwordHash: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }
}