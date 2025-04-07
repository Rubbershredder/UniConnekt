import { redirect, type LoaderFunctionArgs } from "react-router";
import { getUserId, logout } from "~/lib/auth.server";

// This loader prevents direct access to the logout route
export async function loader({request}: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  
  // If there's no logged in user, redirect to login
  if (!userId) {
    return redirect("/login");
  } 
  // Otherwise, redirect to home - we don't want a logout page to be displayed
  return redirect("/");
}

// This action function handles the logout POST request
export async function action({request}: LoaderFunctionArgs) {
  return await logout(request);
}