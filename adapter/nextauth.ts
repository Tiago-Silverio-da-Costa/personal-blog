import {
  AdapterUser,
  AdapterAccount,
  AdapterSession, type Adapter
} from "next-auth/adapters"

import type { Redis } from "@upstash/redis"

export const options = {
  baseKeyPrefix: "auth:",
  accountKeyPrefix: "user:account:",
  accountByUserIdPrefix: "user:account:by-user-uuid:",
  emailKeyPrefix: "user:email:",
  sessionKeyPrefix: "user:session:",
  sessionByUserUuidKeyPrefix: "user:session:by-user-uuid:",
  userKeyPrefix: "user:",
}

const isoDateRE =
  /(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/

function isDate(value: any) {
  return value && isoDateRE.test(value) && !isNaN(Date.parse(value))
}

function hydrateDates(json: object) {
  return Object.entries(json).reduce((acc, [key, val]) => {
      acc[key] = isDate(val) ? new Date(val as string) : val
      return acc
  }, {} as any)
}

export function AuthAdapter(client: Redis): Adapter {

  const { baseKeyPrefix } = options
  const sessionKeyPrefix = baseKeyPrefix + options.sessionKeyPrefix
  const userKeyPrefix = baseKeyPrefix + options.userKeyPrefix
  const emailKeyPrefix = baseKeyPrefix + options.emailKeyPrefix
  const accountKeyPrefix = baseKeyPrefix + options.accountKeyPrefix
  const accountByUserIdPrefix =
      baseKeyPrefix + options.accountByUserIdPrefix


  const setRedisObject = async (key: string, obj: any, expires?: number) => {
      if (expires) {
          await client.set(key, JSON.stringify(obj), { ex: expires })
      } else {
          await client.set(key, JSON.stringify(obj))
      }
  }

  const setSession = async (
      id: string,
      session: AdapterSession
  ): Promise<AdapterSession> => {
      var expires = Math.round((session.expires.getTime() - (new Date()).getTime()) / 1000);

      const sessionKey = sessionKeyPrefix + id

      await setRedisObject(sessionKey, session, expires)
      await client.set(options['baseKeyPrefix'] + options['sessionByUserUuidKeyPrefix'] + session.userId, sessionKey, { ex: expires })
      return session
  }

  const getSession = async (id: string) => {
      const session = await client.get<AdapterSession>(sessionKeyPrefix + id)
      if (!session) return null
      return hydrateDates(session)
  }

  const setUser = async (
      id: string,
      user: AdapterUser
  ): Promise<AdapterUser> => {
      // expires in 7 days
      const expires = 60 * 60 * 24 * 7;

      await setRedisObject(userKeyPrefix + id, user, expires)
      await client.set(emailKeyPrefix + user.email, id)
      return user
  }

  const getUser = async (id: string) => {
      const user = await client.get<AdapterUser>(userKeyPrefix + id)
      if (!user) return null
      return hydrateDates(user)
  }

  const setAccount = async (id: string, account: AdapterAccount) => {
      const accountKey = accountKeyPrefix + id

      const accountData: AdapterAccount = {
          userId: account.userId,
          providerId: account.providerId,
          providerAccountId: account.providerAccountId,
          provider: account.provider,
          type: account.type,
      }

      if (account.expires_at) {
          var expires = Math.round(account.expires_at - ((new Date()).getTime() / 1000));
          await setRedisObject(accountKey, accountData, expires)
          await client.set(accountByUserIdPrefix + account.userId, accountKey, { ex: expires })
      } else {
          await setRedisObject(accountKey, accountData)
          await client.set(accountByUserIdPrefix + account.userId, accountKey)
      }

      return accountData
  }

  const getAccount = async (id: string) => {
      const account = await client.get<AdapterAccount>(accountKeyPrefix + id)
      if (!account) return null
      return account
  }

  return {
      // async createUser(user) {
      //     if (!user.uuid) {
      //         throw new Error("User object must have a `uuid` property")
      //     }

      //     const id = user.uuid
      //     delete user.uuid

      //     return await setUser(id, { ...user, id })
      // },
      async getUser(id) {
          return getUser(id)
      },
      async getUserByEmail(email) {
          const userId = await client.get<string>(emailKeyPrefix + email)
          if (!userId) {
              return null
          }
          return await getUser(userId)
      },
      async getUserByAccount({ providerAccountId, provider }) {
          const dbAccount = await getAccount(
              `${provider}:${providerAccountId}`
          )
          if (!dbAccount) return null
          return await getUser(dbAccount.userId)
      },
      async updateUser(updates) {
          const userId = updates.id as string
          const user = await getUser(userId)
          return await setUser(userId, { ...(user as AdapterUser), ...updates })
      },
      async linkAccount(account) {
          const id = `${account.provider}:${account.providerAccountId}`
          return await setAccount(id, { ...account, id })
      },
      async createSession(session) {
          return await setSession(session.sessionToken, session)
      },
      async getSessionAndUser(sessionToken) {
          const session = await getSession(sessionToken)
          if (!session) return null

          const user = await getUser(session.userId)
          if (!user) return null

          return { session, user }
      },
      async updateSession(updates) {
          const session = await getSession(updates.sessionToken)
          if (!session) return null
          return await setSession(updates.sessionToken, { ...session, ...updates })
      },
      async deleteSession(sessionToken) {
          await client.del(sessionKeyPrefix + sessionToken)
      },
  }
}