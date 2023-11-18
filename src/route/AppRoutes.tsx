import { RouteObject, useRoutes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import AuthGuard from "../guard/AuthGuard";
import GuestGuard from "../guard/GuestGuard";
import Error404 from "../page/miscellaneous/Error404";
import ChatFeed from "../page/chat-feed/ChatFeed";
import Unauthorized from "../page/unauthorize/Unauthorized";

const routes: RouteObject = {
  path: "/",
  children: [
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: ":tab?/:id?",
          element: (
            <AuthGuard>
              <ChatFeed />
            </AuthGuard>
          ),
        },
        {
          path: "unauthorized",
          element: (
            <GuestGuard>
              <Unauthorized />
            </GuestGuard>
          ),
        },
      ],
    },
    {
      path: "*",
      element: <Error404 />,
    },
  ],
};

export default function AppRoutes() {
  return useRoutes([routes]);
}
