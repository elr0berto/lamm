'use server';

import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function addUser(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const username = formData.get('username') as string;

    if (!email || !username) {
      return { error: 'Email and username are required' };
    }

    const user = await prisma.user.create({
      data: {
        email,
        username,
      },
    });

    revalidatePath('/');
    return { success: true, user };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { error: 'Email or username already exists' };
    }

    return { error: 'Failed to create user' };
  }
}

export async function getUsers() {
  try {
    const users = await prisma.user.findMany();
    return users;
  } catch (error) {
    console.error('Failed to fetch users:', error);
    return [];
  }
}
