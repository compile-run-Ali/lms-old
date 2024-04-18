import Image from "next/image";
import Link from "next/link";
import React from "react";
import Styles from "./Login.module.css";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

export default function LoginAlternative({ facultyLogin }) {
  const router = useRouter();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleLogin = async () => {
    const signin = await signIn("credentials", {
      redirect: false,
      username: email,
      password: password,
      role: facultyLogin ? "faculty" : "student",
    });
    console.log(signin);
    if (signin.status === 200) {
      router.push({
        pathname: facultyLogin ? "/faculty" : "/student",
      });
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className={`w-full flex h-screen font-poppins ${Styles.main} pt-10`}>
      <div className="w-1/2 flex h-full justify-center items-center">
        <div className="">
          <Image src="/book.svg" width={500} height={100} alt="book" />
        </div>
      </div>
      <div className="w-1/2 h-full flex items-center justify-center">
        <div
          className={`w-[55%] h-[75%] rounded-[40px] bg-white bg-opacity-20 px-16 flex flex-col justify-center`}
        >
          <span className="text-white font-semibold text-4xl">
            {facultyLogin ? "Faculty Login" : "Student Login"}
          </span>

          <div className="w-full flex flex-col mt-10">
            <label className="text-white text-sm font-medium">
              {facultyLogin ? "Login" : "Army Number"}
            </label>
            <input
              type="text"
              className="w-full h-10 rounded-md bg-white px-4 mt-2 py-4 placeholder:text-[#BCBEC0] text-sm "
              placeholder="username@gmail.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
            />
          </div>

          <div className="w-full flex flex-col mt-7">
            <label className="text-white text-sm font-medium">Password</label>
            <input
              type="password"
              className="w-full h-10 rounded-md bg-white px-4 mt-2 py-4 placeholder:text-[#BCBEC0] text-sm "
              placeholder="Password"
              value={password}
              onKeyDown={handleKeyDown}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </div>

          <div className="w-full flex flex-col mt-4">
            <span className="text-xs text-white font-medium">
              Forget Password?
            </span>
          </div>

          <div className="w-full flex flex-col mt-7">
            <button
              onClick={() => {
                handleLogin();
              }}
              className="w-full h-10 rounded-md bg-blue-800 text-white text-sm font-semibold"
            >
              Login
            </button>
          </div>

          <div className="w-full flex flex-col mt-5">
            <Link href={"/register"}>
              <span className="text-xs text-white">
                Don&#39;t have an account?{" "}
                <span className="text-white font-semibold">Sign Up</span>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
