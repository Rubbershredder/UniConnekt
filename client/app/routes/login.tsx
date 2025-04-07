// routes/login.tsx
import { redirect } from "react-router";
import { LoginForm } from "~/components/login-form";
import { createUserSession, getUserId, login } from "~/lib/auth.server";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{title: "Login"}];
};

export async function loader({request}: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return null;  // Return null instead of empty response
}

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");
  const redirectTo = formData.get("redirectTo") || "/";

  if(!email || typeof email !== "string" || !password || typeof password !== "string"){
    return new Response(
      JSON.stringify({error: "Invalid Form Data"}), 
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  
  const {error, user} = await login({email, password});
  if (error) {
    return new Response(
      JSON.stringify({error}),
      {
        status: 401,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  
  if (!user || !user.ID) {
    return new Response(
      JSON.stringify({error: "User not found"}),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
  
  // Redirect to home page after successful login
  return createUserSession(user.ID.toString(), redirectTo.toString());
}

export default function Page() {
  return (
    <div className="flex h-screen flex-col items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center max-h-screen">
        <div className="mb-2">
          <img src="/favicon.png" alt="UniConneKt Logo" className="h-30 w-auto" />
        </div>
        <div className="w-full max-w-sm px-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}