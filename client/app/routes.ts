import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
    //public routes
   route("login", "./routes/login.tsx"),
   route("signup", "./routes/signup.tsx"),
   route("logout", "./routes/logout.tsx"),
   

   //protected routes
   layout(".//auth/auth-layout.tsx",[
       index("./routes/home.tsx"),

   ])

] satisfies RouteConfig;
