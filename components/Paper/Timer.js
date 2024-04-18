import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { useSession } from "next-auth/react";

import {
  convertDateTimeToStrings,
  getPaperDateTime,
  getRemainingTime,
} from "@/lib/TimeCalculations";

export default function Timer({ paper }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [startTimeString, setStartTimeString] = useState("");

  const clearPaperFromLocal = () => {
    const papers = JSON.parse(localStorage.getItem("papers")) || {};
    delete papers[paper];
    localStorage.setItem("papers", JSON.stringify(papers));
    console.log(
      "papers after deleting",
      JSON.parse(localStorage.getItem("papers"))
    );
    localStorage.removeItem(`attempted_questions_${paper.paper_id}`);

  };

  const updateStatus = () => {
    //update spa status to Attempted
    const timeCompleted = new Date();
    // get gmt offset in hours, and add that in startTime
    const gmtOffset = new Date().getTimezoneOffset();
    timeCompleted.setMinutes(timeCompleted.getMinutes() - gmtOffset);
    axios
      .post(`/api/student/paper/update_attempt_status`, {
        studentId: session.user.id,
        paperId: paper.paper_id,
        status: "Incomplete Submission",
        timeCompleted: timeCompleted.toISOString(),
      })
      .then((res) => {
        console.log("updated attempt status ", res.data);
      })
      .catch((err) => {
        console.log("error updating attempt status", err);
      });
  };

  useEffect(() => {
    if (session?.user?.id && paper.paper_id) {
      axios
        .get("/api/student/paper/get_single_attempt", {
          params: {
            p_number: session.user.id,
            paper_id: paper.paper_id,
          },
        })
        .then((res) => {
          const paperStartTime = res.data.timeStarted;
          if (paperStartTime) {
            setStartTimeString(paperStartTime);
            setStartTime(
              convertDateTimeToStrings(
                getPaperDateTime(paperStartTime, paper.duration, paper.objDuration).start
              )
            );
            setEndTime(
              convertDateTimeToStrings(
                getPaperDateTime(paperStartTime, paper.duration, objDuration).end
              )
            );
          }
        });
    }
  }, [session]);

  useEffect(() => {
    if (startTimeString) {
      const interval = setInterval(() => {
        setTimeLeft(
          getRemainingTime(
            getPaperDateTime(startTimeString, paper.duration, paper.objDuration).end
          )
        );
        if (timeLeft === "00:00:00") {
          clearPaperFromLocal();
          updateStatus();
          // set status to time ended
          router.push(`/student`);
        }
      }, 1000);
      return () => clearInterval(interval);
    }
  });

  return (
    <div className="flex flex-col justify-center text-lg">
      <div>
        Start Time:
        {" " + startTime}
      </div>
      <div>End Time:{" " + endTime}</div>
      <div>Time Left:{" " + timeLeft}</div>
    </div>
  );
}
