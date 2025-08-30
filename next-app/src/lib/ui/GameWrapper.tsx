'use client';

import dynamic from "next/dynamic";

const PhaserWrapperWithoutSSR = dynamic(() => import("@/lib/ui/PhaserWrapper"), { ssr: false });

export function GameWrapper() {
    return <PhaserWrapperWithoutSSR />;
}