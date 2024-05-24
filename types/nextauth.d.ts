import NextAuth, { DefaultSession, Profile } from "next-auth"
import {  User } from "@prisma/client";

declare module "next-auth" {
    interface User {
        id: string
        type: User
        name: string
    }
    interface Session extends DefaultSession {
        user: User
    }
    interface Profile extends Profile {
        picture?: string
    }
}