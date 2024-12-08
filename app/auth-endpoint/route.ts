import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { sessionClaims } = await auth.protect();
    const { room } = await req.json();
    if (sessionClaims && typeof sessionClaims.email === 'string' && typeof sessionClaims.fullName=== 'string'  ) {
        const session = liveblocks.prepareSession(sessionClaims?.email, {
            userInfo: {
                name: sessionClaims.fullName,
                email: sessionClaims.email,
               avatar:"default"
            }
        })
        const usersInRoom = await adminDb.collectionGroup("rooms").where("userId", "==", sessionClaims?.email!)
            .get();
        const userInRoom = usersInRoom.docs.find((doc) => doc.id === room)
        if (userInRoom?.exists) {
            session.allow(room, session.FULL_ACCESS);
            const { body, status } = await session.authorize();
            console.log("You are Authorised")
            return new Response(body, { status })
    
        }
        else {
            NextResponse.json({ message: "You are not in this room" },
                { status: 403 }
            )
        }
    
    }
    }
    