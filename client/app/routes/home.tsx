import { href } from "react-router";
import type { Route } from "./+types/home";

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

export default function Home() {
  return (
    <main className="flex-1 pt-16 p-4 pb-20 sm:pb-4 w-full overflow-auto">
    <h1>Home</h1>
  </main>
  )
}
