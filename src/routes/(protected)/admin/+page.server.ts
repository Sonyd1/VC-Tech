import { PrismaClient } from '@prisma/client';
import type { PageServerLoad, Actions } from './$types';

const prisma = new PrismaClient();

export const load: PageServerLoad = async () => {
  const pendingUsers = await prisma.user.findMany({
    where: { isApproved: false },
    include: { role: true }
  });

  const approvedUsers = await prisma.user.findMany({
    where: { isApproved: true },
    include: { role: true }
  });

  return { pendingUsers, approvedUsers };
};

export const actions: Actions = {
  approve: async ({ request }) => {
    const data = await request.formData();
    const userId = data.get('userId') as string;
    
    try {
      await prisma.user.update({
        where: { id: userId },
        data: { isApproved: true }
      });
      return { success: true };
    } catch (error) {
      console.error('Error approving user:', error);
      return { success: false, error: 'Failed to approve user' };
    }
  },

  decline: async ({ request }) => {
    const data = await request.formData();
    const userId = data.get('userId') as string;
    
    try {
      await prisma.user.delete({
        where: { id: userId }
      });
      return { success: true };
    } catch (error) {
      console.error('Error declining user:', error);
      return { success: false, error: 'Failed to decline user' };
    }
  },

  deleteApproved: async ({ request }) => {
    const data = await request.formData();
    const userId = data.get('userId') as string;
    
    try {
      await prisma.user.delete({
        where: { id: userId }
      });
      return { success: true };
    } catch (error) {
      console.error('Error deleting approved user:', error);
      return { success: false, error: 'Failed to delete approved user' };
    }
  }
};