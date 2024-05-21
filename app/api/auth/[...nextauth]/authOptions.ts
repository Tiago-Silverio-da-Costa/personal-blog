import { Prisma } from "@prisma/client";
import { prisma } from "@/adapter/db";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import GitHub from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { randomUUID } from "crypto";
import { redis } from "@/adapter/redis";
import { AuthAdapter } from "@/adapter/nextauth";
import axios from "axios";
import { GRecaptchaResponseProps } from "../../utils";

const authAdapter = AuthAdapter(redis);

export type TUsersData = Prisma.PromiseReturnType<typeof getUser>;
const getUser = async (email: string, password?: string) => {
  const userFindFirstWhere: Prisma.UserWhereInput = {
    email,
  };

  if (password) {
    const hashedPassword = await bcrypt.hash(
      password,
      process.env.BCRYPT_SALT ?? 10
    );

    userFindFirstWhere.password = hashedPassword;
  }

  const user = await prisma.user.findFirst({
    where: userFindFirstWhere,
    select: {
      uuid: true,
      name: true,
      email: true,
      profileImage: true,
      profession: {
        select: {
          name: true,
        },
      },
    },
  });

  if (user) {
    return {
      id: user.uuid,
      name: user.name,
      email: user.email,
      profession: user.profession?.name,
      profileImage: user.profileImage,
    };
  }

  return null;
};

export const authOptions: NextAuthOptions = {
  adapter: authAdapter,
  pages: {
    signIn: "/register",
    error: "/register",
    newUser: "/register",
    signOut: "/register",
    verifyRequest: "/register",
  },
  debug: process.env.VERCEL_ENV !== "production" && false,
  providers: [
    GitHub({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      type: "credentials",
      credentials: {
        email: {},
        password: {},
        gRecaptchaToken: {},
      },
      async authorize(credentials, req) {
        const { email, password, gRecaptchaToken } = credentials as {
          email: string;
          password: string;
          gRecaptchaToken: string;
        };

        if (
          !email ||
          !(email.length > 0) ||
          !password ||
          !(password.length >= 8)
        )
          return null;

        try {
          const { data } = await axios.post(
            `https://recaptchaenterprise.googleapis.com/v1/projects/${process.env.RECAPTCHA_PROJECT_ID}/assessments?key=${process.env.RECAPTCHA_API_KEY}`,
            {
              event: {
                token: gRecaptchaToken,
                siteKey: process.env.NEXT_PUBLIC_RECAPTCHA_KEY,
                expectedAction: "login",
              },
            }
          );

          const gRecaptchaData = data as GRecaptchaResponseProps;
          const { score, ...riskAnalysis } = gRecaptchaData.riskAnalysis;
          const ip = req.headers?.["cf-connecting-ip"] ?? "no-ip";

          var gRecaptcha = await prisma.adminAuditRecaptcha.create({
            data: {
              action: "login",
              valid: gRecaptchaData.tokenProperties.valid,
              invalidReason: gRecaptchaData.tokenProperties.invalidReason,
              expectedAction: gRecaptchaData.event.expectedAction,
              score,
              riskAnalysis,
              ip,
            },
            select: {
              id: true,
            },
          });

          if (
            !gRecaptchaData.tokenProperties.valid ||
            gRecaptchaData.event.expectedAction !== "login" ||
            score < 0.5
          )
            return null;
        } catch (err) {
          return null;
        }

        const user = await getUser(email, password);

        if (user)
          await prisma.adminAuditRecaptcha.update({
            where: {
              id: gRecaptcha.id,
            },
            data: {
              User: {
                connect: {
                  uuid: user.id,
                },
              },
            },
          });

        return user;
      },
    }),
  ],
  session: {
    strategy: "database",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
    generateSessionToken: async () => {
      return randomUUID();
    },
  },
  jwt: {
    async encode({ token }) {
      if (!token || !token.sub) {
        return "";
      }

      const sessionToken = randomUUID();
      const expires = new Date(Date.now() + 60 * 60 * 24 * 1000);

      authAdapter.createSession &&
        (await authAdapter.createSession({
          sessionToken: sessionToken,
          expires: expires,
          userId: token.sub,
        }));

      return sessionToken;
    },
  },
  // events: {
  //   async signIn({ user, account }) {
  //   }
  // },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account) {
        var getUserData;
        if (account.provider === "github" && profile?.email) {
          getUserData = await getUser(profile.email);
        } else if (account.provider === "credentials" && user) {
          getUserData = user as TUsersData;
        }

        if (getUserData) {
          if (!getUserData.profileImage && profile?.image) {
            await prisma.user.update({
              where: {
                uuid: getUserData.id,
              },
              data: {
                profileImage: profile.image,
              },
            });
            getUserData.profileImage = profile.image;
          }

          const createUser =
            authAdapter.createUser &&
            (await authAdapter.createUser({
              // uuid: getUserData.id,
              email: getUserData.email,
              name: getUserData.name,
              image: getUserData.profileImage,
              emailVerified: null,
            }));

          if (createUser) {
            return true;
          }
        }
      }

      return false;
    },
    async session({ session, user }) {
      const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
      };
      return { ...session, user: userData };
    },
  },
};
