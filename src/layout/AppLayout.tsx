import { Outlet } from "react-router-dom";
import Navbar from "../component/navbar/Navbar";

export default function AppLayout() {
  return (
    <>
      <Navbar />
      <div className="flex items-start pt-16 h-screen">
        <Outlet />
      </div>
    </>
  );
}
