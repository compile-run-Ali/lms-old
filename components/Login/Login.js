import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { FaQuestionCircle } from "react-icons/fa";
import Spinner from "../Loader/Spinner";
import getUserIP from "@/utils/getIP";

export default function Login({ facultyLogin, setFacultyLogin }) {
  const router = useRouter();
  const [ip, SetIp] = useState();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState({
    show: false,
    message: "",
  });


  useEffect(()=>{
    getUserIP(function(ip){
      if(ip && ip.includes("192")){
        SetIp(ip);
        console.log("Ip: ",ip)
      }
    });
  },[])

  const handleLogin = async () => {
    setLoading({
      message: "Logging in...",
    });
    const signin = await signIn("credentials", {
      redirect: false,
      username: email,
      password: password,
      role: facultyLogin ? "faculty" : "student",
      ip: facultyLogin ? ip : "none"
    });
    console.log(signin);
    if (signin.status === 200) {
      router.push({
        pathname: facultyLogin ? "/faculty" : "/student",
      });
    } else {
      setLoading({});
      alert("Invalid Credentials");
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="w-full h-screen font-poppins flex flex-col justify-center items-center mt-10 ">
      <Spinner loading={loading} />
      <div className="w-2/3 lg:w-2/3 h-[90%] flex flex-col bg-blue-900 border border-slate-300 shadow-xl">
        <div className="flex justify-center">
          <Image
            src="/logo.png"
            width={300}
            height={300}
            alt="logo"
            priority="loading"
            className="w-auto h-auto"
          />
        </div>
        <div className="h-1/5 text-4xl text-center mt-2 font-medium  text-white">
          <h1>ASC SCHOOL e EXAM SYSTEM</h1>
          <h2 className="mt-1 text-2xl">Student Portal</h2>
        </div>
        <div className="w-full h-4/5 mt-2 pt-5  border-t border-slate-300 relative z-10 flex justify-between items-end pb-20 pr-40 bg-white ">
          <div className="w-[40%] ml-14">
            <form>
              <div>
                <label
                  htmlFor="username"
                  className="block text-sm font-medium text-blue-900"
                >
                  {!facultyLogin ? "Army Number" : "Email"}
                </label>
                <input
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  id="username"
                  name="username"
                  type="text"
                  autoComplete="off"
                  required
                  className="relative block w-full mt-2 appearance-none rounded-none bg-transparent
                   border border-gray-300 px-3  py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>
              <div className="mt-5">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-blue-900"
                >
                  Password
                </label>
                <input
                  onChange={(e) => {
                    setPassword(e.target.value);
                  }}
                  onKeyDown={handleKeyDown}
                  id="password"
                  name="password"
                  type="Password"
                  autoComplete="off"
                  required
                  className="relative block w-full mt-3 appearance-none rounded-none bg-transparent autofill:bg-white
                                        border border-gray-300 px-3  py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-blue-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <div className="mt-5">
                <button
                  onClick={handleLogin}
                  type="button"
                  className="group relative flex w-full justify-center border border-transparent
                 bg-blue-900 py-2 px-4 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Login
                </button>
              </div>
            </form>
          </div>
          <div className="">
            <div className="">
              <a href="#" className="hover:text-blue-500 text-slate-700">
                <span>Forgotten your username or </span>
                <br />
                <span>password?</span>
              </a>
            </div>
            <div className=" mt-2">
              <span>Cookies must be enabled in your </span>
              <span className="flex items-center  ">
                browser{" "}
                <FaQuestionCircle className="h-4 w-4 ml-1 mt-[0.5px] text-green-500 " />
              </span>
            </div>

            {!facultyLogin && (
              <div className="mt-3 cursor-pointer">
                <Link href={"/register"}>
                  <button
                    className="group relative flex w-full justify-center border border-transparent
                 bg-blue-900 py-2 px-4 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Register as Student
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
