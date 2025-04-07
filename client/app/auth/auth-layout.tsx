import { Outlet, redirect } from "react-router";
import { getUserId } from "../lib/auth.server";
import type { LoaderFunctionArgs } from "react-router";

export async function loader({request} : LoaderFunctionArgs){
    const userId = await getUserId(request)
    
    if (!userId){
        const url = new URL(request.url)
        const redirectTo = url.pathname + url.search
        const searchParams = new URLSearchParams([["redirectTo", redirectTo]])

        return redirect(`/login?${searchParams}`)
    }
    return {userId}
}

export default function AuthLayout() {
    return <Outlet />
}