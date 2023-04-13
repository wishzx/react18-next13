import bcrypt from "bcrypt"; // manage salt internally

import { SignJWT, jwtVerify } from "jose";
import { db } from "./db";

// clerk.dev or supertokens.com next-auth.js for production check on next.js docs for various providers

export const comparePasswords = (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};
export const hashPassword = (password: string) => {
  return bcrypt.hash(password, 10);
};

export const createJWT = (user: { id: string; email: string }) => {
  // return jwt.sign({ id: user.id }, 'cookies')

  // should make them expire or it's a security threath
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + 60 * 60 * 24 * 7;

  // keep the payload minimal
  return new SignJWT({ payload: { id: user.id, email: user.email } })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setExpirationTime(exp)
    .setIssuedAt(iat)
    .setNotBefore(iat)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
};

export const validateJWT = async (jwt: string) => {
  const { payload } = await jwtVerify(
    jwt,
    new TextEncoder().encode(process.env.JWT_SECRET)
  );

  return payload.payload as any;
};

export const getUserFromCookie = async (cookies) => {
  const jwt = cookies.get(process.env.COOKIE_NAME);

  const { id } = await validateJWT(jwt.value);

  const user = await db.user.findUnique({ where: { id: id } });
  return user;
};
