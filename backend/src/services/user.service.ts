import { User, Prisma } from '@prisma/client';
import prisma from '@/config/database';
import { RegisterRequest } from '@/types';

class UserService {
  async findById(id: number): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { id }
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { email }
    });
  }

  async findByUsername(username: string): Promise<User | null> {
    return await prisma.user.findUnique({
      where: { username }
    });
  }

  async create(userData: RegisterRequest & { password_hash: string }): Promise<User> {
    return await prisma.user.create({
      data: userData
    });
  }

  async update(id: number, data: Partial<User>): Promise<User> {
    return await prisma.user.update({
      where: { id },
      data
    });
  }

  async updateLastLogin(id: number): Promise<void> {
    await prisma.user.update({
      where: { id },
      data: { last_login: new Date() }
    });
  }

  async getUserProfile(id: number): Promise<Omit<User, 'password_hash'> | null> {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        username: true,
        profile_pic_url: true,
        bio: true,
        year_of_study: true,
        major: true,
        profile_visibility: true,
        is_verified: true,
        is_admin: true,
        is_active: true,
        created_at: true,
        updated_at: true,
        last_login: true,
        sso_provider: true
      }
    });

    return user;
  }
}

export const userService = new UserService();