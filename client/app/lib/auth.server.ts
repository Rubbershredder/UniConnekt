import { createCookieSessionStorage } from "react-router";

const SESSION_SECRET = process.env.SESSION_SECRET || 'default_secret';

const sessionCreate = createCookieSessionStorage({
    cookie: {
        name: "__auth",
        httpOnly: true,
        maxAge: 60 * 60 * 24 * 30,
        path: "/",
        sameSite: "lax",
        secrets: [SESSION_SECRET],
        secure: process.env.NODE_ENV === "production",
    }
})