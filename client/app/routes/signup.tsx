// routes/signup.tsx
import { redirect } from "react-router";
import { SignupForm } from "~/components/signup-form";
import { getUserId, signUp } from "~/lib/auth.server";
import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "react-router";

export const meta: MetaFunction = () => {
  return [{ title: "Sign Up" }];
};

export async function loader({ request }: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  if (userId) return redirect("/");
  return new Response(null, { status: 200 });
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || typeof email !== "string" || !password || typeof password !== "string") {
    return new Response(
      JSON.stringify({ error: "Invalid Form Data" }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  const { error, success } = await signUp({ email, password });
  
  if (error) {
    return new Response(
      JSON.stringify({ error }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" }
      }
    );
  }

  // Redirect to login page after successful signup
  return redirect("/login");
}

export default function Page() {
  return (
    <div className="flex h-screen flex-col items-center justify-center overflow-hidden">
      <div className="flex flex-col items-center max-h-screen">
        <div className="mb-2">
          <img src="/favicon.png" alt="UniConneKt Logo" className="h-30 w-auto" />
        </div>
        <div className="w-screen max-w-sm px-6">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}