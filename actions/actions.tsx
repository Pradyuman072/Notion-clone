"use server"

import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server"

export async function createNewDocument() {
    const { sessionClaims } = await auth.protect();
    const docCollectionRef = adminDb.collection("documents");
    const docRef = await docCollectionRef.add({
        title: "New Document",

    })
    if(!sessionClaims){
        throw new Error("Unauthorized:No sessuin claimes found")
    }
    if (sessionClaims && typeof sessionClaims.email === 'string')
    await adminDb.collection('users').doc(sessionClaims.email).collection('rooms').doc(docRef.id).set({
        userId: sessionClaims?.email!,
        role: "owner",
        createdAt: new Date(),
        roomId: docRef.id,
    })
    return { docId: docRef.id }
}


export async function deleteDocument(roomId: string) {
    await auth.protect();
    try {
        await adminDb.collection("documents").doc(roomId).delete();
        const query = await adminDb.collectionGroup("rooms").where("roomId", "==", roomId).get();
        const batch = adminDb.batch();
        query.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();
        await liveblocks.deleteRoom(roomId);
        return { success: true };
    } catch (error) {
        console.error(error);
        return { success: false }
    }
}
export async function inviteUser(roomId: string, email: string) {
    try {
        await adminDb.collection("users").doc(email).collection("rooms").doc(roomId).set({
            userId: email,
            role: "editor",
            createdAt: new Date(),
            roomId,
        });
        return { success: true }
    } catch (error) {
        console.error(error);
        return { success: false }
    }
}
export async function removeUserFromDocument(roomId: string, email: string) {
    await auth.protect();
    console.log("removed user from document", roomId, email)
    try {
        await adminDb.collection("users").doc(email).collection("rooms").doc(roomId).delete();
        return { success: true }
    } catch (error) {
        console.error(error)
        return { success: false }
    }
}