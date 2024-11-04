'use server'
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import 'server-only'

const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)
type SessionPayload =
  | { [key: string]: any }
  | undefined

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey)
}

export async function decrypt(session: string | undefined = "") {
  if (!session) return null
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.error(error);
    return null
  }
}

export async function createSession(rol: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ rol, expiresAt })
  cookies().set(
    'session',
    session,
    {
      httpOnly: true,
      secure: true,
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    }
  )
}

export async function deleteSession() {
  cookies().delete('session')
}

export async function getSessionData() {
  const encryptedSessionData = cookies().get('session')?.value
  const decryptedData = encryptedSessionData ? await decrypt(encryptedSessionData) : null;
  return decryptedData ? decryptedData : null;
}