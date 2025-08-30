import prisma from '@/lib/prisma'
import { GameWithUsers } from '@/lib/ui/GameWithUsers';


export default async function Home() {
    const users = await prisma.user.findMany();

    return <GameWithUsers initialUsers={users} />;
}