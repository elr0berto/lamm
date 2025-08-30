'use client';

import dynamic from "next/dynamic";

const PhaserWrapperWithoutSSR = dynamic(() => import("@/lib/ui/PhaserWrapper"), { ssr: false });

interface GameWrapperProps {
    usersCount: number;
}

export function GameWrapper({ usersCount }: GameWrapperProps) {
    return <PhaserWrapperWithoutSSR usersCount={usersCount} />;
}