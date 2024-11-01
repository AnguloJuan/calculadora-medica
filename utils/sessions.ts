import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest } from 'next/server'
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

export async function decrypt(session: any) {
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    return payload
  } catch (error) {
    console.error(error);
    
    console.log('Failed to verify session')
  }
}

export async function createSession(role: string) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  const session = await encrypt({ role, expiresAt })
  await (await cookies()).set(
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
  const cookieStore = await cookies()
  cookieStore.delete('session')
}

export async function getSessionData(request: NextRequest) {
  // (await cookies()).get('session')?.value
  const encryptedSessionData = cookies().get('session')?.value
  
  const decryptedData = encryptedSessionData ? await decrypt(encryptedSessionData) : null;
  
  return decryptedData ? decryptedData : null;
}