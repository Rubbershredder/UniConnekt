import { type RouteConfig, index, route } from "@react-router/dev/routes";
import { Route } from "react-router";

export default [index("routes/login.tsx"),
    route("home", "routes/home.tsx"),
] satisfies RouteConfig;
