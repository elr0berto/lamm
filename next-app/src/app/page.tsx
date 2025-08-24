import prisma from '@/lib/prisma'

export default async function Home() {
    const users = await prisma.user.findMany();
    return <div>users.length {users.length}</div>;
}