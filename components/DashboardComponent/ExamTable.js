import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import {
  convertDateTimeToStrings,
  compareDateTime,
} from "@/lib/TimeCalculations";
import { useSession } from "next-auth/react";
import { MdCheckCircle, MdEdit } from "react-icons/md";
import { IoMdEye } from "react-icons/io";

const ExamTable = ({ exams_data, approve_row, isPrevious = false }) => {
  const router = useRouter();
  const [exams, setExams] = useState([]);
  const { data: session, status } = useSession();
  useEffect(() => {
    const updatedExams = exams_data.map((exam) => {
      const examDate = new Date(exam.date);
      if (compareDateTime(examDate) === "past" && exam.status === "Approved") {
        return axios
          .put(`/api/faculty/update_exam_status`, {
            paper_id: exam.paper_id,
            status: exam.paper_type === "Objective" ? "Marked" : exam.status,
          })
          .then((response) => {
            return {
              ...exam,
              status: exam.paper_type === "Objective" ? "Marked" : exam.status,
            };
          })
          .catch((error) => {
            console.log(error);
            return exam;
          });
      }
      return Promise.resolve(exam); // Return a resolved promise for exams that don't need updating
    });

    Promise.all(updatedExams).then((updatedExams) => {
      const sortedExams = updatedExams.sort((a, b) => {
        const aTime = new Date(a.date).getTime();
        const bTime = new Date(b.date).getTime();
        return aTime - bTime;
      });

      setExams(sortedExams);

      const closedExam = updatedExams.find((exam) => exam.status === "Closed");

      if (closedExam) {
        axios
          .post(`/api/faculty/generate_notification`, {
            notification: closedExam.paper_name + " has been closed.",
            faculty_id: session.user.id,
          })
          .then((response) => {
            console.log(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
  }, [exams_data]);
  const isPaperDatePast = (examDate) => {
    const paperDate = new Date(examDate);
    const today = new Date();
    // get gmt offset in minutes and add in today
    paperDate.setMinutes(
      paperDate.getMinutes() + paperDate.getTimezoneOffset()
    );

    return (
      paperDate.getDate() < today.getDate() ||
      paperDate.getMonth() < today.getMonth() ||
      paperDate.getFullYear() < today.getFullYear()
    );
  };
  async function getLinkedPaperId(examId) {
    console.log("Sending id ", examId, "to get linked paper id");
    try {
      const res = await axios.get("/api/faculty/paper_creation/get_linked", {
        params: {
          paperId: examId,
        },
      });
      console.log(res.data);
      return res.data.paperId;
    } catch (err) {
      console.log(err);
    }
  }
  const approveExam = async (examId, date) => {
    if (isPaperDatePast(date)) {
      alert("Exam date is in the past. Please change the date and try again.");
      return;
    }
    const linkedId = await getLinkedPaperId(examId);

    axios
      .put(`/api/faculty/update_exam_status`, {
        paper_id: examId,
        status: "Approved",
      })
      .then((response) => {
        console.log("exam id is", examId);
        addComment({
          comment: `Exam Approved by ${session.user.name}`,
          faculty_id: session.user.id,
          paper_id: examId,
        });
        try {
          console.log("linked id is", linkedId);
          if (linkedId) {
            axios.put(`/api/faculty/update_exam_status`, {
              paper_id: linkedId,
              status: "unapproved",
            });
            addComment({
              comment: `Exam UnApproved by ${session.user.name}`,
              faculty_id: session.user.id,
              paper_id: linkedId,
            });
          }
        } catch (err) {
          console.log(err);
        }
        router.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };
  // console.log(exams,"ainan")

  const addComment = (comment) => {
    if (session.user) {
      try {
        const response = axios.post("/api/faculty/add_comment", {
          paper_id: comment.paper_id,
          comment: comment.comment,
          faculty_id: session.user.id,
        });
        console.log("Comment added successfully");
        console.log(response);
      } catch (error) {
        console.log(error);
      }
    }
  };

  const handleExamClick = (paper_id) => {
    router.push(`/faculty/exam_details/${paper_id}`);
  };
  console.log(exams_data, "exams_data");
  if (!exams_data || (exams_data && exams_data.length === 0)) {
    return (
      <div className="flex justify-center items-center w-full h-full">
        <h1 className="text-2xl font-poppins font-bold">No Exams Found</h1>
      </div>
    );
  }

  return (
    <table className="table-auto w-full mt-2 font-poppins text-left px-5">
      <thead>
        <tr className="bg-blue-800 text-white font-medium ">
          <th className="px-4 py-2">Exam Name</th>
          <th className="px-4 py-2">Exam Type</th>
          <th className="px-4 py-2">Objective Duration</th>
          <th className="px-4 py-2">Subjective Duration</th>
          <th className="px-4 py-2">Duration</th>
          <th className="px-4 py-2">Comments</th>
          <th className="px-4 py-2">Date</th>
          <th className="px-4 py-2">Time</th>
          <th className="px-4 py-2">Total Marks</th>
          <th className="px-4 py-2">Status</th>
          {approve_row && session.user.level > 2 && (
            <th className="px-4 py-2 w-20 text-center">Approve</th>
          )}
          <th className="px-4 py-2 w-20 text-center">
            {isPrevious ? "View" : "Edit"}
          </th>
        </tr>
      </thead>
      <tbody>
        {exams.map((exam, index) => (
          <tr
            key={exam.paper_id}
            className={`bg-gray-${index % 2 === 0 ? 100 : 200}`}
          >
            <td className="border px-4 py-2">{exam.paper_name}</td>
            <td className="border px-4 py-2">{exam.paper_type}</td>
            {exam.paper_type === "Objective" ? (
              <React.Fragment>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">{exam.objDuration} Minutes</td>
              </React.Fragment>
            ) : exam.paper_type === "Subjective/Objective" ||
              (exam.paper_type === "Word" && !"IE") ? (
              <React.Fragment>
                <td className="border px-4 py-2">{exam.objDuration} Minutes</td>
                <td className="border px-4 py-2">{exam.duration} Minutes</td>
                <td className="border text-center px-4 py-2">-</td>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">-</td>
                <td className="border px-4 py-2">{exam.duration} Minutes</td>
              </React.Fragment>
            )}
            {/* display last PaperComment[].comment where user_generated is true */}
            <td className="border px-4 py-2">
              { exam?.PaperComment?.filter((comment) => comment.user_generated).length  > 0
                ? exam.PaperComment.filter((comment) => comment.user_generated)
                    .slice(-1) // Get the last comment from the filtered array
                    .map((comment) => comment.comment)
                    .join(", ") // Display the comment(s) separated by a comma
                : "-"}
            </td>

            <td className="border px-4 py-2">
              {convertDateTimeToStrings(exam.date, true)}
            </td>
            <td className="border px-4 py-2">
              {convertDateTimeToStrings(exam.date)}
            </td>
            <td className="border px-4 py-2">{exam.total_marks}</td>
            <td className="border px-4 py-2">{exam.status}</td>
            {approve_row && session.user.level > 2 && (
              <td className="border px-4 py-2 z-10 text-center w-20">
                <button
                  className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-md mx-auto"
                  onClick={() => {
                    approveExam(exam.paper_id, exam.date);
                  }}
                >
                  <MdCheckCircle />
                </button>
              </td>
            )}
            <td className="border px-4 py-2 z-10 text-center w-20">
              <button
                className="bg-blue-800 hover:bg-blue-700 text-white p-2 rounded-md text-center"
                onClick={() => handleExamClick(exam.paper_id)}
              >
                {isPrevious ? <IoMdEye /> : <MdEdit />}
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExamTable;
