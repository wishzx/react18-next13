import { createJWT, hashPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default async function register(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const user = await db.user.create({
      data: {
        email: req.body.email,
        password: await hashPassword(req.body.password),
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      },
    });

    const jwt = await createJWT(user);
    // better on cookies with next than localstorage because you can check that on the edge
    res.setHeader(
      "Set-Cookie",
      serialize(process.env.COOKIE_NAME, jwt, {
        httpOnly: true, // cant access in js but only network
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      })
    );
    res.status(201);
    res.json({}); // no need to send user because it's becoming free since we have server components and the form doenst need it
  }
}
