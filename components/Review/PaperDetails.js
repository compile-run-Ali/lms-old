import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  getPaperDateTime,
  convertDateTimeToStrings,
} from "@/lib/TimeCalculations";
export default function PaperDetails({
  paper: initialPaper,
  isFaculty = false,
  studentId,
}) {
  const [paper, setPaper] = useState(initialPaper);
  const [studentStatus, setStudentStatus] = useState({
    status: "Not Attempted",
  });
  const [eval_code, setName] = useState("Loading Name...");

  useEffect(() => {
    setPaper(initialPaper);
  }, [initialPaper]);

  const getStudentDetails = () => {
    axios
      .get(`/api/student/get_by_id`, {
        params: {
          p_number: studentId,
        },
      })
      .then((res) => {
        setName(res.data.eval_code);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .get(`/api/student/paper/get_attempt_status`, {
        params: {
          studentId: studentId,
        },
      })
      .then((res) => {
        if (
          res?.data?.filter((attempt) => attempt.paperId === paper.paper_id)
            .length > 0
        ) {
          setStudentStatus(
            res.data.filter((attempt) => attempt.paperId === paper.paper_id)[0]
          );
        }
      });
  };

  useEffect(() => {
    if (studentId) {
      getStudentDetails();
    }
  }, [studentId, paper]);

  const paperDateTime = getPaperDateTime(paper.date, paper.duration, paper.objDuration);

  return (
    <div className="mt-4 mb-10">
      {studentId && (
        <div className="flex flex-col items-center justify-center mb-2">
          <h1 className="text-2xl font-bold text-gray-800">
            {eval_code}
          </h1>
          <h1 className="text-xl font-bold text-gray-800">
            {studentStatus.status}
          </h1>
        </div>
      )}

      <table className="w-full text-lg table-fixed bg-white shadow-lg rounded-lg">
        <thead>
          <tr className="bg-blue-900 text-white">
            <th className="text-left border px-4 py-2">Course Code</th>
            <td className="border text-center px-4 py-2">
              {paper.course_code}
            </td>
          </tr>
          <tr className="bg-blue-900 text-white">
            <th className="text-left border px-4 py-2">Paper Name</th>
            <td className="border text-center px-4 py-2">{paper.paper_name}</td>
          </tr>
          <tr className="bg-blue-900 text-white">
            <th className="text-left border px-4 py-2">Type</th>
            <td className="border text-center px-4 py-2">{paper.paper_type}</td>
          </tr>
          <tr className="bg-blue-900 text-white">
            <th className="text-left border px-4 py-2">Navigation allowed</th>
            <td className="border text-center px-4 py-2">
              {paper.freeflow ? "Yes" : "No"}
            </td>
          </tr>
          {isFaculty && (
            <>
              <tr className="bg-blue-900 text-white">
                <th className="text-left border px-4 py-2">Review allowed</th>
                <td className="border text-center px-4 py-2">
                  {paper.review ? "Yes" : "No"}
                </td>
              </tr>
            </>
          )}
          <tr className="bg-blue-900 text-white">
            <th className="text-left border px-4 py-2">Date</th>
            <td className="border text-center px-4 py-2">
              {convertDateTimeToStrings(paper.date, true)}
            </td>
          </tr>
          <tr className="bg-blue-900 text-white">
            <th className="text-left border px-4 py-2">Paper Live Time</th>
            <td className="border text-center px-4 py-2">
              {convertDateTimeToStrings(paper.date, false)}
            </td>
          </tr>
          {paper.paper_type === "Subjective/Objective" || "Word" && !"IE" ? (
            <React.Fragment>
              <tr className="bg-blue-900 text-white">
                <th className="text-left border px-4 py-2">Objective Duration</th>
                <td className="border text-center px-4 py-2">
                  {paper.objDuration} Minutes
                </td>
              </tr>
              <tr className="bg-blue-900 text-white">
                <th className="text-left border px-4 py-2">Subjective Duration</th>
                <td className="border text-center px-4 py-2">
                  {paper.duration} Minutes
                </td>
              </tr>
            </React.Fragment>
          )
            :
            paper.paper_type === "Objective" ? (
              <React.Fragment>
                <tr className="bg-blue-900 text-white">
                  <th className="text-left border px-4 py-2">Duration</th>
                  <td className="border text-center px-4 py-2">
                    {paper.objDuration} Minutes
                  </td>
                </tr>
              </React.Fragment>
            )
              :
              (
                <React.Fragment>
                  <tr className="bg-blue-900 text-white">
                    <th className="text-left border px-4 py-2">Duration</th>
                    <td className="border text-center px-4 py-2">
                      {paper.duration} Minutes
                    </td>
                  </tr>
                </React.Fragment>
              )
          }

          <tr className="bg-blue-900 text-white">
            <th className="text-left border px-4 py-2">Attempt Started at</th>
            <td className="border text-center px-4 py-2">
              {studentStatus.timeStarted}
            </td>
          </tr>
          <tr className="bg-blue-900 text-white">
            <th className="text-left border px-4 py-2">Submitted Time</th>
            <td className="border text-center px-4 py-2">
              {studentStatus.timeCompleted}
            </td>
          </tr>
        </thead>
      </table>
    </div >
  );
}
