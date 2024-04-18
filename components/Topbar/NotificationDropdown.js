import { getNotificationTime } from "@/utils/NotificationTime";
import axios from "axios";
import React, { useState } from "react";
import { IoMdMailOpen, IoMdMailUnread, IoMdEye } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { useRouter } from "next/router";

export default function NotificationDropdown({
  notifications,
  setNotifications,
}) {
  const router = useRouter();

  console.log(notifications);

  const markAsRead = async (id) => {
    const res = await axios.post("/api/faculty/markNotificationRead", {
      notification_id: id,
    });
  };

  return (
    <div className=" w-full h-full mt-2 bg-white rounded-md shadow-lg z-20 ">
      <div className="">
        {notifications
          .sort((a, b) => new Date(b.time) - new Date(a.time))
          .map((notification, index) => (
            <div
              key={index}
              className="flex items-center justify-between px-4 py-3 border-b hover:bg-gray-100 -mx-2"
              // onClick={() => markAsRead(notification.notification_id)}
            >
              {notification.exam_id && (
                <p>
                  <IoMdEye
                    className="ml-2 text-xl  text-blue-700 cursor-pointer"
                    onClick={() => {
                      router.push(`/faculty/mark_exam/${notification.exam_id}`);
                    }}
                  />
                </p>
              )}
              <p className="text-gray-600 text-sm mx-2 flex items-end">
                <span className="font-poppins text-black" href="#">
                  {notification.notification}
                </span>
                <span className="ml-2 text-xs mb-1 text-gray-400">
                  {getNotificationTime(notification.time)}
                </span>
              </p>
              <p className="mr-2 mt-1">
                {notification.read ? (
                  <IoMdMailOpen className="ml-2 text-xs mb-1 text-gray-400" />
                ) : (
                  <MdDelete
                    className="ml-2 text mb-2 text-red-600 cursor-pointer"
                    onClick={() => {
                      markAsRead(notification.notification_id);
                      setNotifications(
                        notifications.filter(
                          (item) =>
                            item.notification_id !==
                            notification.notification_id
                        )
                      );
                    }}
                  />
                )}
              </p>
            </div>
          ))}
      </div>

      {notifications.length === 0 && (
        <div className="text-center text-gray-400 font-poppins text-xs py-4">
          No notifications yet
        </div>
      )}
    </div>
  );
}
