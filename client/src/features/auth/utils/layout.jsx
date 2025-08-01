import { Outlet } from "react-router-dom";
import SideBar from "../../communComponents/SideBar";

export const Layout = ({ children }) => {
  return (
    <div className="App h-[100vh]">
      <div className="whitespace-nowrap box-border sideBarComp">
        <SideBar />
      </div>

      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
        <Outlet />
      </div>
    </div>
  );
};
