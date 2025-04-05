import { href } from "react-router";
import type { Route } from "./+types/home";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
    {
      tagName: "link",
      rel: "icon",
      href: `/favicon.png`,
      type: "image/png",
    }
  ];
}

export default function Home() {
  return <h1>Hello, world!</h1>
}
