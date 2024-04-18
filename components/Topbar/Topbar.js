import React, { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import ClickAwayListener from "react-click-away-listener";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

import ArrowDownSVG from "@/svgs/arrow_down";
import NotificationSVG from "@/svgs/notification";

import NotificationDropdown from "./NotificationDropdown";

import { IoArrowBackSharp } from "react-icons/io5";
import { MdOutlineLogout } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

export default function Topbar() {
  const router = useRouter();
  const [showNotification, setShowNotification] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const session = useSession();
  const [dropdown, setDropdown] = useState(false);
  const logout = async () => {
    signOut({
      callbackUrl: "/",
    });
  };

  useEffect(() => {
    if (session.status === "authenticated") {
      getNotifications();
    }
  }, [session.status]);

  const getNotifications = async () => {
    // get notifications from api for the logged in user
    axios
      .post("/api/faculty/get_notifications", {
        faculty_id: session.data.user.id,
      })
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((err) => {
        console.log("Error in get_notifications", err);
      });
  };

  const handleProfile = () => {
    console.log(session.data.user);
    const user = session.data?.user || {};
    const query =
      user?.role === "faculty"
        ? {
            faculty_id: user.id,
            selfEdit: true,
          }
        : {
            student_id: user.id,
            selfEdit: true,
          };
    router.push({
      pathname: `/${user?.role}/profile`,
      query: query,
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mx-10 h-[110px]">
        <div className="flex">
          {router.pathname !== "/faculty" &&
            router.pathname !== "/admin" &&
            router.pathname !== "/student" && (
              <div
                className="cursor-pointer my-auto"
                onClick={() => router.back()}
              >
                <IoArrowBackSharp className="text-3xl text-blue-900 inline" />
              </div>
            )}
          <div className="cursor-pointer" onClick={() => router.push("/")}>
            <Image
              src="/logo.png"
              width={100}
              height={100}
              alt="logo"
              priority="loading"
              className="w-auto h-auto"
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ClickAwayListener onClickAway={() => setShowNotification(false)}>
            <div className="notification-icon mr-5">
              <div className="relative">
                <NotificationSVG
                  className="fill-blue-900 hover:cursor-pointer"
                  onClick={() => setShowNotification(!showNotification)}
                />
                {notifications.length > 0 && (
                  <span
                    className="absolute bottom-2 left-3 text-red-500 text-7xl hover:cursor-pointer"
                    onClick={() => setShowNotification(!showNotification)}
                  >
                    .
                  </span>
                )}
              </div>

              {showNotification && (
                <div className="absolute right-[180px] max-h-[300px] w-80">
                  <NotificationDropdown
                    notifications={notifications}
                    setNotifications={setNotifications}
                  />
                </div>
              )}
            </div>
          </ClickAwayListener>
          <div className="user-profile flex items-center gap-3">
            {session?.data?.user?.image && (
              <div className="w-8 h-8 rounded-full border border-blue-900 relative hover:scale-[3.0] hover:translate-y-5 hover:-translate-x-5 transition-all">
                <Image
                  src={`/uploads/${session?.data?.user?.image}`}
                  // src="/avatar.png"
                  fill
                  className="rounded-full object-cover object-center"
                  alt="user"
                />
              </div>
            )}

            <div className="user-name">
              <span className="font-medium font-poppins">
                {session?.data?.user?.name}
              </span>
            </div>

            <div
              className="arrow-down cursor-pointer"
              onClick={() => setDropdown(!dropdown)}
            >
              <ArrowDownSVG className="fill-blue-900" />
            </div>
          </div>
        </div>
      </div>
      {dropdown && (
        <div className="flex justify-end mr-10 font-poppins text-black">
          <div className="dropdown absolute -mt-8">
            {((session.data.user?.role === "faculty" &&
              session.data.user?.level < 5) ||
              session.data.user?.role === "student") && (
              <div
                onClick={handleProfile}
                className="flex items-center justify-between  px-4 font-medium bg-white space-x-6 py-2 cursor-pointer border-2 border-blue-800 border-b-0"
              >
                <p>See Profile</p>
                <CgProfile className="text-2xl" />
              </div>
            )}
            <div
              onClick={logout}
              className="flex items-center justify-between  px-4 font-medium bg-white space-x-6 py-2 cursor-pointer border-2 border-blue-800"
            >
              <p>Logout</p>
              <MdOutlineLogout className="text-2xl" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
