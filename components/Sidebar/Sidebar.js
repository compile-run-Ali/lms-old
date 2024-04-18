import React from "react";

export default function Sidebar({ fullSidebar }) {
  if (!fullSidebar) {
    return (
      <div className="w-full flex justify-end">
        <div className="w-[100%]  flex flex-col items-center justify-between">
          <div className="nav-items"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="w-full flex flex-col justify-between ">
      <div className="nav-items"></div>
      <div className="md:hidden h-20"></div>
    </div>
  );
}
