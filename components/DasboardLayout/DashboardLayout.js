import React, { useContext } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Styles from "./DashboardLayout.module.css";
import Topbar from "../Topbar/Topbar";

import { SidebarContext } from "../../context/SidebarContext/GlobalProvider";

export default function DashboardLayout({ admin, children }) {
  const { showSidebar, setShowSidebar } = useContext(SidebarContext);

  const toggleSidebar = () => {
    setShowSidebar((prev) => !prev);
  };

  return (
    <div className="w-full min-h-screen pb-20">
      {/* <div
        className={`hidden md:flex w-[270px] ${
          Styles.sideBar
        } ease-in-out duration-300 ${
          showSidebar ? "translate-x-0" : "-translate-x-[170px]"
        }`}
      >
        <div
          className={`flex mt-10 items-center ease-in-out duration-300 ${
            showSidebar ? "translate-x-0" : "translate-x-[160px]"
          }  h-full`}
        >
          <div className="pl-10">
            <div className="cursor-pointer " onClick={toggleSidebar}>
              <div className="w-8 h-0 border border-white" />
              <div className="w-8 h-0 border mt-2 border-white" />
              <div className="w-8 h-0 border mt-2 border-white" />
            </div>
          </div>
        </div>
        <Sidebar fullSidebar={showSidebar} />
      </div> */}

      <div
        className={`w-full`}
      >
        <Topbar admin />
        {children}
      </div>
    </div>
  );
}
