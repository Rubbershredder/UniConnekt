// components/signup-form.tsx
import { Form, useActionData, NavLink } from "react-router";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export function SignupForm() {
  const actionData = useActionData() as {error?: string};

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-2 border-gray-100 shadow-lg">
        <CardHeader className="border-b border-gray-100 pb-6">
          <CardTitle className="text-2xl font-bold text-[#000000]">Create an account</CardTitle>
          <CardDescription className="text-gray-600">
            Enter your information below to create your account
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
                <Label htmlFor="password" className="font-medium text-gray-700">Password</Label>
                <Input 
                  id="password" 
                  name="password"
                  type="password" 
                  required 
                  className="border-gray-300 focus:border-[#0044B1] focus:ring-[#0044B1]"
                />
              </div>
              <div className="grid gap-3">
                <Label htmlFor="confirmPassword" className="font-medium text-gray-700">Confirm Password</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword"
                  type="password" 
                  required 
                  className="border-gray-300 focus:border-[#0044B1] focus:ring-[#0044B1]"
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button 
                  type="submit" 
                  className="w-full bg-[#111111] text-white hover:bg-[#1EC773] transition-colors duration-300"
                >
                  Sign Up
                </Button>
              </div>
            </div>
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <NavLink 
                to="/login" 
                className="font-medium text-[#0044B1] underline-offset-4 hover:text-[#1EC773] hover:underline transition-colors duration-200"
              >
                Login
              </NavLink>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}