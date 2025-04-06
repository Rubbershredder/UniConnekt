import { error } from "console";
import { createCookieSessionStorage, redirect } from "react-router";

const SESSION_SECRET = process.env.SESSION_SECRET || 'default_secret';

const sessionStorage = createCookieSessionStorage({
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

// This function gets the cookie form the session 
export async function getUserSession(request: Request){
    return sessionStorage.getSession(request.headers.get("Cookies"))
}

// This function gets the user id from the session
export async function getUserId(request: Request) {
    const session = await getUserSession(request)
    const userId = session.get("userId");
    if(!userId || typeof userId !== "string") return null // if the userId is not a string or not valid return null
    return userId
}

export async function requireUserId(request: Request ,
    redirectTo: string = new URL(request.url).pathname //(this is used to remeber the original path of the user when he is not logged in), redirect to the login page
){
    const session = await getUserSession(request)
    const userId = session.get("userId")
    // the if statement checks if the userId is not a string or not valid
    if (!userId || typeof userId !== "string") {
        // if the userId is not a string or not valid, redirect the user to the login page
        const searchParams = new URLSearchParams([["redirectTo", redirectTo]])
        throw redirect(`/login?${searchParams}`)
    }
    // if the userId is a string and valid, return the userId
    return userId
}

export async function login ({email , password,}:{ email:string, password: string}){
    //call your backend 
    const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({email, password}),
        credentials: "include",
    })

    if(!response.ok){
        const data = await response.json()
        return { error: data.error || "Login failed" }
    }

    // fetch the cookie to validate the response 
    const validateResponse = await fetch("http://localhost:3000/validate", {
        headers: {
            Cookie: response.headers.get("Set-Cookie") || "",
        }
    })
    //validate the response 
    if(!validateResponse.ok) {
        return {error: "Failed to validate user"}
    }

    const userData = await validateResponse.json()
    return {user: userData.message}
}

// This function signs up the user
export async function signUp({email, password}: {email: string, password: string}){
    const response = await fetch("http://localhost:3000/signup", {
        method: "POST",
        headers:{"Content-Type": "application/json"},
        body: JSON.stringify({email, password}),
    })

    if(!response.ok){
        const data = await response.json()
        return {error: data.error || "Signup failed"} // this is used to return the error
    }

    return {success: true}
}

// This function creates a session for the user
export async function createUserSession( userId:string, redirectTo: string){
    const session = await sessionStorage.getSession()
    session.set("userId", userId) // this is used to set the userId
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await sessionStorage.commitSession(session) // this is used to set the cookie
        }
    })
}

// This function logs out the user
export async function logout(request: Request){
    const session = await getUserSession(request)
    await fetch("http://localhost:3000/logout", {
        method: "POST",
        credentials: "include", // this is used to include the cookie in the request
    })

    return redirect("/login", {
        headers:{
            "Set-Cookie": await sessionStorage.destroySession(session), // this is used to destroy the session
        }
    })
}