import React from "react";
import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import {useAuth} from "./feature/auth/hook/UseAuth";
import { useEffect } from "react";

const App = () => {

  const  auth = useAuth();

  useEffect(() => {
    auth.fetchCurrentUser().catch((error) => {
      console.error("Failed to restore session:", error);
    });
  }, []);

  return <RouterProvider router={router} />;

}

export default App;
