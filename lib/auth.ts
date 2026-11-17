import { SignJWT, jwtVerify } from 'jose';

const JWT_SECRET =
  process.env.JWT_SECRET || 'codepath-academy-super-secure-jwt-secret-2026-production-ready';

const encodedKey = new TextEncoder().encode(JWT_SECRET);

export const AUTH_COOKIE_NAME = 'codepath_session';

export interface UserTokenPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
}

export async function signAuthToken(payload: UserTokenPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d')
    .sign(encodedKey);
}

export async function verifyAuthToken(token: string): Promise<UserTokenPayload | null> {
  try {
    const { payload } = await jwtVerify(token, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as unknown as UserTokenPayload;
  } catch {
    return null;
  }
}
