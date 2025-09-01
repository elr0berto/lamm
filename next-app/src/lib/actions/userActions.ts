'use server';

// import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addUser(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const username = formData.get('username') as string;

    if (!email || !username) {
      return { error: 'Email and username are required' };
    }

    // Mock user creation when database is not available
    const user = {
      id: Math.floor(Math.random() * 1000),
      email,
      username,
    };

    revalidatePath('/');
    return { success: true, user };
  } catch (_error: unknown) {
    return { error: 'Failed to create user' };
  }
}

export async function getUsers() {
  try {
    // Mock users when database is not available
    const users = [
      { id: 1, email: 'demo@example.com', username: 'demo_user' },
      { id: 2, email: 'test@example.com', username: 'test_user' },
    ];
    return users;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}
