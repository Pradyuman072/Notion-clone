"use client"

import { useMyPresence, useOthers } from "@liveblocks/react/suspense";
import FollowPointer from "./FollowPointer";

function LiveCursorProvider({ children }: {
    children: React.ReactNode;
}) {
    const [myPresence, updateMyPrecense] = useMyPresence();
    const others = useOthers();
    console.log(myPresence)
    function handlePointerMove(e: React.PointerEvent<HTMLDivElement>) {
        const cursor = { x: Math.floor(e.pageX), y: Math.floor(e.pageY) };
        updateMyPrecense({ cursor });
    }
    const handlePointerLeave = () => {
        updateMyPrecense({ cursor: null });
    }
    return (
        <div onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}>
            {others.filter((other) => other.presence.cursor !== null).map(({ connectionId, presence, info }) => (
                <FollowPointer key={connectionId} info={info} x={presence.cursor!.x} y={presence.cursor!.y} />
            ))}
            {children}
        </div>
    )
}

export default LiveCursorProvider
