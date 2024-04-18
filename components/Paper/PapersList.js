import React, { useState, useEffect } from "react";
import Link from "next/link";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import { TfiPencilAlt } from "react-icons/tfi";
import {
  getPaperDateTime,
  convertDateTimeToStrings,
  returnDateInString,
} from "@/lib/TimeCalculations";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useRouter } from "next/router";

export default function PapersList({ papers, status }) {
  const [sortedPapers, setSortedPapers] = useState([]);
  const [attemptStatus, setAttemptStatus] = useState([]);
  const [updatedPapers, setUpdatedPapers] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const newSortedPapers = papers.sort(
      (a, b) => Date.parse(a.date) - Date.parse(b.date)
    );
    setSortedPapers(newSortedPapers);
  }, [papers]);

  useEffect(() => {
    const getAttemptStatus = async () => {
      const res = await axios.get(`/api/student/paper/get_attempt_status`, {
        params: {
          studentId: session.user.id,
        },
      });
      setAttemptStatus(res.data);
    };
    getAttemptStatus();
  }, [session]);

  useEffect(() => {
    const newUpdatedPapers = sortedPapers.map((paper) => {
      // console.log(attemptStatus);
      const attempt = attemptStatus.find(
        (attempt) => attempt.paperId === paper.paper_id
      );
      if (!attempt || attempt?.status === "Attempted") {
        return { ...paper, attemptStatus: false };
      } else {
        return { ...paper, attemptStatus: true };
      }
    });

    // console.log("newUpdatedPapers", newUpdatedPapers);
    setUpdatedPapers(newUpdatedPapers);
  }, [attemptStatus]);

  return (
    <div>
      <table className="table-auto rounded-md mt-2 mb-4 font-poppins w-full text-left">
        <thead>
          <tr className="bg-blue-800 rounded-md text-white">
            <th className="border px-4 py-2">Course</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Type</th>
            <th className="border px-4 py-2">Date</th>
            <th className="border px-4 py-2">Live Time</th>
            <th className="px-4 py-2">Objective Duration</th>
            <th className="px-4 py-2">Subjective Duration</th>
            <th className="px-4 py-2">Duration</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2 text-center">Action</th>
          </tr>
        </thead>
        <tbody>
          {updatedPapers.map((paper, index) => {
            // Check if the status is "unapproved" before rendering the row
              return (
                <tr key={paper.paper_id}>
                  <PaperRow
                    paper={paper}
                    attemptStatus={paper.attemptStatus}
                    status={status}
                  />
                </tr>
              );
            // Return null if status is "unapproved" to skip rendering
            return null;
          })}
        </tbody>
      </table>
    </div>
  );
}

const PaperRow = ({ paper, attemptStatus, status }) => {
  const { start, end } = getPaperDateTime(
    paper.date,
    paper.duration,
    paper.objDuration
  );
  const startDate = returnDateInString(start, true);
  const startTime = convertDateTimeToStrings(start);
  const isLive = status === "Live Papers";
  const isPast = status === "Past Papers";
  const session = useSession();
  const router = useRouter();
  const attemptExam = async (paperId) => {
    try {
      const startTime = new Date();

      // pad the hours and minutes with leading zeros

      let hours = startTime.getHours().toString();
      let minutes = startTime.getMinutes().toString();
      let startTimeInString = `${hours.padStart(2, "0")}:${minutes.padStart(
        2,
        "0"
      )}`;
      await axios.post(`/api/student/paper/update_attempt_status`, {
        studentId: session.data.user.id,
        paperId: paperId,
        status: "Attempted",
        timeStarted: startTimeInString,
      });

      router.push(`/paper/attempt/${paperId}`);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <td className="border px-4 py-2">{paper.course_code}</td>
      <td className="border px-4 py-2">{paper.paper_name}</td>
      <td className="border px-4 py-2">{paper.paper_type}</td>
      <td className="border px-4 py-2">{startDate}</td>
      <td className="border px-4 py-2">{startTime}</td>
      {paper.paper_type === "Objective" ? (
        <React.Fragment>
          <td className="border px-4 text-center py-2">-</td>
          <td className="border px-4 text-center py-2">-</td>
          <td className="border px-4 py-2">{paper.objDuration} Minutes</td>
        </React.Fragment>
      ) : paper.paper_type === "Subjective/Objective" || ("Word" && !"IE") ? (
        <React.Fragment>
          <td className="border px-4 py-2">{paper.objDuration} Minutes</td>
          <td className="border px-4 py-2">{paper.duration} Minutes</td>
          <td className="border px-4 text-center py-2">-</td>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <td className="border px-4 text-center py-2">-</td>
          <td className="border px-4 text-center py-2">-</td>
          <td className="border px-4 py-2">{paper.duration} Minutes</td>
        </React.Fragment>
      )}
      <td className="border px-4 py-2">
        {paper.status === "Approved" && isLive
          ? "Live"
          : paper.status === "Approved" && !isLive && !isPast
          ? "Upcoming"
          : paper.status === "Closed"
          ? "Marking"
          : paper.status}
      </td>
      <td className="border px-4 py-2 text-center">
        {/* if paper is live and is submitted, show submitted button, else show attempt button */}
        {/* if paper is past and review is allowed, show review button, else show review not allowed button */}
        {/* else show view button */}
        {isLive ? (
          !attemptStatus &&
          paper.status !== "Closed" &&
          paper.status !== "Marked" &&
          paper.status !== "Result Locked" ? (
            <button
              className="bg-blue-800 hover:bg-blue-700 cursor-pointer text-white p-2 rounded"
              onClick={() => attemptExam(paper.paper_id)}
            >
              Attempt
            </button>
          ) : (
            <button className="bg-gray-400 text-white py-2 px-4 rounded cursor-not-allowed">
              {attemptStatus ? "Submitted" : "Paper Closed"}
            </button>
          )
        ) : isPast ? (
          paper.review && paper.status === "Marked" ? (
            <Link href={`/paper/review/${paper.paper_id}`}>
              <button className="bg-blue-800 hover:bg-blue-700 cursor-pointer text-white p-2 rounded">
                <IoMdEye className="inline" />
              </button>
            </Link>
          ) : paper.review &&
            paper.status !== "Marked" &&
            paper.status !== "Result Locked" ? (
            <button className="bg-yellow-500 text-white p-2 rounded cursor-not-allowed">
              <TfiPencilAlt className="inline" />
            </button>
          ) : (
            <button className="bg-gray-400 text-white p-2 rounded cursor-not-allowed">
              <IoMdEyeOff className="inline" />
            </button>
          )
        ) : (
          <Link href={`/paper/view/${paper.paper_id}`}>
            <button className="bg-blue-800 hover:bg-blue-700 cursor-pointer text-white p-2 rounded">
              <IoMdEye className="inline" />
            </button>
          </Link>
        )}
      </td>
    </>
  );
};
