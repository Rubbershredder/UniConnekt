import { LoginForm } from "~/components/login-form";

export default function Page() {
  return (
    <div className="flex min-h-svh flex-col items-center">
      <div className="mt-8 mb-2">
        <img src="/favicon.png" alt="UniConneKt Logo" className="h-80 w-auto" />
      </div>
      <div className="w-full max-w-sm px-6">
        <LoginForm />
      </div>
    </div>
  );
}