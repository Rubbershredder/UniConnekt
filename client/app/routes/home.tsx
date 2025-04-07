import { redirect, type LoaderFunctionArgs } from "react-router";
import type { Route } from "./+types/home";
import Navbar from "~/components/navbar";
import { getUserId } from "~/lib/auth.server";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
    {
      tagName: "link",
      rel: "icon",
      href: `/favicon.ico`,
      type: "image/png",
    }
  ];
}

export async function loader({request}: LoaderFunctionArgs) {
  const userId = await getUserId(request);
  // If no user, redirect to login
  if (!userId) {
    return redirect("/login");
  }
  // Return the userId so it's available to the component
  return { userId };
}

export default function Home() {
  return (
    <div>
      <Navbar/>
      <main>
        <h1>Home</h1>
      </main>
    </div>
  );
}