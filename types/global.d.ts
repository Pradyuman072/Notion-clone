import { User } from "@clerk/nextjs/server";

declare global {
    interface CustonSessionClaims extends User {

    }
}