import prisma from '@/lib/prisma'
import {GameWrapper} from "@/lib/ui/GameWrapper";


export default async function Home() {

    const users = await prisma.user.findMany();
    return <div>
        users.length {users.length}
        <GameWrapper/>
    </div>;
}