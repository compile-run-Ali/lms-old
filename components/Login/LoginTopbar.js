import Image from "next/image";
import React from "react";

export default function LoginTopbar({ facultyLogin, setFacultyLogin }) {
  return (
    <div className="absolute bg-white top-0 w-full h-[80px] shadow-lg ">
      <div className="w-full flex justify-between items-center pl-5 pr-14">
        <div className="">
          <Image
            src="/logo.png"
            width={120}
            height={120}
            alt="logo"
            priority="loading"
            className="w-auto h-auto"
          />
        </div>
        <div className="">
          {facultyLogin ? (
            <div
              onClick={() => {
                setFacultyLogin(false);
              }}
            >
              <button className="bg-blue-800 py-3 px-4 rounded-md text-white font-medium font-poppins mr-4">
                Student Login
              </button>
            </div>
          ) : (
            <div
              onClick={() => {
                setFacultyLogin(true);
              }}
            >
              <button className="bg-blue-800 py-3 px-4 rounded-md text-white font-medium font-poppins mr-4">
                Faculty Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
