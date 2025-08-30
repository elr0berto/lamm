import { GameWithUsers } from '@/lib/ui/GameWithUsers';

// Mock users for demo when database is not available
const mockUsers = [
  { id: 1, email: 'demo@example.com', username: 'demo_user' },
  { id: 2, email: 'test@example.com', username: 'test_user' },
];

export default async function Home() {
    // Comment out Prisma call for now due to network restrictions
    // const users = await prisma.user.findMany();
    const users = mockUsers;

    return <GameWithUsers initialUsers={users} />;
}