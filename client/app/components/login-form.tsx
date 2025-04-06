// components/login-form.tsx
import { Form, useActionData, useSearchParams, NavLink } from "react-router";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";

export function LoginForm() {
  const actionData = useActionData() as {error?: string};
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/home";

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-2 border-gray-100 shadow-lg">
        <CardHeader className="border-b border-gray-100 pb-6">
          <CardTitle className="text-2xl font-bold text-[#000000]">Login to your account</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <Form method="post">
            <div className="flex flex-col gap-6">
              {actionData?.error && (
                <div className="text-red-500 text-sm">{actionData.error}</div>
              )}
              <div className="grid gap-3">
                <Label htmlFor="email" className="font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  className="border-gray-300 focus:border-[#0044B1] focus:ring-[#0044B1]"
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password" className="font-medium text-gray-700">Password</Label>
                  <NavLink
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm text-gray-600 underline-offset-4 hover:text-[#0044B1] hover:underline transition-colors duration-200"
                  >
                    Forgot your password?
                  </NavLink>
                </div>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  required 
                  className="border-gray-300 focus:border-[#0044B1] focus:ring-[#0044B1]"
                />
              </div>
              {redirectTo !== "/home" ? (
                <input type="hidden" name="redirectTo" value={redirectTo} />
              ) : null}
              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full bg-[#111111] text-white hover:bg-[#1EC773] transition-colors duration-300"
                >
                  Login
                </Button>
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{" "}
              <NavLink 
                to="/signup" 
                className="font-medium text-[#0044B1] underline-offset-4 hover:text-[#1EC773] hover:underline transition-colors duration-200"
              >
                Sign up
              </NavLink>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}