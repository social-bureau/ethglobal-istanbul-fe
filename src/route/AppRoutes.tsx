import { RouteObject, useRoutes } from "react-router-dom";
import AppLayout from "../layout/AppLayout";
import ChatFeed from "../page/chat-feed/ChatFeed";
import Error404 from "../page/miscellaneous/Error404";

const routes: RouteObject = {
  path: "/",
  children: [
    {
      path: "/",
      element: <AppLayout />,
      children: [
        {
          path: ":tab?/:id?",
          element: <ChatFeed />,
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
