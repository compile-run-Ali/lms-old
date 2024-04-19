import React from "react";
import { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import * as XLSX from "xlsx";
import Spinner from "../Loader/Spinner";
import { MdLock, MdShare, MdDownload } from "react-icons/md";
import { FaRegThumbsDown, FaRegThumbsUp } from "react-icons/fa";
import { IoMdEyeOff } from "react-icons/io";

import ShareModal from "./ShareModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const StudentsTable = ({
  students_data,
  exam_id,
  exam: examDetails,
  isPrinter = false,
}) => {
  const [students, setStudents] = useState([]);

  const [classAverage, setClassAverage] = useState(null);
  const [highestMarks, setHighestMarks] = useState(null);
  const [lowestMarks, setLowestMarks] = useState(null);

  const [marked, setMarked] = useState(false);
  // const [noneAttempted, setNoneAttempted] = useState(false);
  const [loading, setLoading] = useState({});
  const [exam, setExam] = useState(examDetails);
  const [showShareModal, setShowShareModal] = useState(false);
  const session = useSession();
  const user = session.data.user;
  const router = useRouter();

  const handlePrint = () => {
    const printContents = document.getElementById("my-table").outerHTML;
    const printWindow = window.open("", "Print");
    const styles = `
    <style>
    #my-table td,th {
    border: 1px solid gray;
    padding-left: 1rem/* 16px */;
    padding-right: 1rem/* 16px */;
    padding-top: 0.5rem/* 8px */;
    padding-bottom: 0.5rem/* 8px */;
    }
    
    #my-table thead tr:first-child th {
      font-size: 24px;
      line-height: 32px;
    }

    #second-row {
      background-color: #1d4ed8;
      color: #fff;
      font-weight: 500;
    }

    #last-row {
     background-color: #a9a9a9;
    }

    .flx {
      display: flex;
      justify-content: space-between;
    }
    
    @media print {
      body * {
        visibility: hidden;
      }
      #my-table, #my-table * {
        visibility: visible;
      }
      #my-table {
        position: absolute;
        border-spacing: 0px;
        left: 0;
        top: 0;
        font-family: Arial, Helvetica, sans-serif;
        width: 100%;
        table-layout: auto;
      }
    }
  </style>
  
    `;

    printWindow.document.write(styles);
    printWindow.document.write(printContents);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  const handleExport = () => {
    // Get a reference to the table element
    const table = document.getElementById("my-table");

    const clonedTable = table.cloneNode(true);
    const th = clonedTable.querySelector(".remove-col");
    th.colSpan = 4;
    const tbody = clonedTable.getElementsByTagName("tbody")[0];
    for (let i = 0; i < tbody.children.length; i++) {
      const row = tbody.children[i];
      row.removeChild(row.children[row.children.length - 1]);
    }
    // Create the worksheet from the cloned table
    const worksheet = XLSX.utils.table_to_sheet(clonedTable);
    // Create the workbook and add the worksheet
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    // Export the workbook to a file
    XLSX.writeFile(workbook, `Result ${exam?.paper_name}.xlsx`);
  };

  const changeStatusTo = (status, isLocked) => {
    console.log("Changing status to ", status);
    setLoading({ message: isLocked ? "Locking Result..." : "" });
    axios
      .put(`/api/faculty/update_exam_status`, {
        paper_id: exam_id,
        status: status,
      })
      .then((response) => {
        setLoading({});
        console.log("Exam status updated successfully", response.data);
        setExam(response.data);
      })
      .catch((error) => {
        setLoading({
          error: isLocked
            ? "Error while locking result. Please try again later"
            : "An unexpected error occured.",
        });
        console.log(error);
      });
  };

  const handleLockResult = () => {
    if (!exam) return;
    if (exam.status === "Marked") {
      changeStatusTo("Result Locked", true);
    } else if (
      exam.paper_type === "Objective" &&
      (exam.status === "Approved" || exam.status === "Closed")
    ) {
      changeStatusTo("Result Locked", true);
    } else if (exam.status === "Result Locked") {
      alert("Result is already locked");
    } else {
      alert(
        "You can't lock the result of this exam. Please mark the exam first. If the exam is objective type, you can lock the result only after student attempt it."
      );
    }
  };

  const handleCloseExam = () => {
    setLoading({
      message: "Closing Exam...",
    });
    axios
      .post("/api/faculty/close_exam", {
        paper_id: exam_id,
      })
      .then((response) => {
        setLoading({});
        console.log(
          "Exam closed successfully. Response from server: ",
          response.data
        );
        router.reload();
      })
      .catch((error) => {
        setLoading({
          error: "Error in loading exam.",
        });
        console.log("Error while closing exam: ", error);
        // alert("Error while closing exam. Please try again later");
      });
  };
  console.log(
    students_data.every(
      (student) =>
        student.student.status === "Marked" ||
        student.status === "Not Attempted"
    ),
    "ahahahaha"
  );
  useEffect(() => {
    if (!exam) return;
    if (students_data) {
      setStudents(students_data);

      const totalMarks = students_data.reduce(
        (sum, student) => sum + student.student.obtainedMarks,
        0
      );

      const totalAttempts = students_data.reduce(
        (count, student) =>
          student.student.status === "Marked"
            ? count + 1
            : student.student.status === "Not Attempted"
            ? count
            : count + 1,
        0
      );
      const classAverage = totalAttempts > 0 ? totalMarks / totalAttempts : 0;
      setClassAverage(classAverage);

      const highestMarks = students_data.reduce(
        (max, student) => Math.max(max, student.student.obtainedMarks),
        0
      );
      setHighestMarks(highestMarks);

      // do not include marks of student whos status is Not Attempted
      const lowestMarks = students_data.reduce(
        (min, student) =>
          student.status === "Not Attempted"
            ? min
            : Math.min(min, student.student.obtainedMarks),
        100
      );
      setLowestMarks(lowestMarks);

      const isAllMarked = students_data.every(
        (student) =>
          student.student.status === "Marked" ||
          student.student.status === "Not Attempted"
      );
      setMarked(isAllMarked);

      // const isNoneAttempted = students_data.every(
      //   (student) =>
      //     student.status === "Not Attempted" || student.status === "Attempted"
      // );
      // setNoneAttempted(isNoneAttempted);
      if (
        isAllMarked &&
        // !isNoneAttempted &&
        exam.status !== "Marked" &&
        exam.status !== "Result Locked"
      ) {
        /*
          If all students are marked and none of them are not attempted,
          then the status should be changed to "Marked"
        */
        changeStatusTo("Marked");
      } else if (!isAllMarked && exam.status === "Marked") {
        /* 
          If the exam is marked and some students are not marked,
          then the status should be changed to "Approved"
         */
        changeStatusTo("Approved");
      }
    }
  }, [students_data, exam]);

  // if (noneAttempted) {
  //   return (
  //     <div className="flex flex-col items-center justify-center mt-8">
  //       <h1 className="text-2xl font-poppins font-bold">
  //         No student has attempted this exam
  //       </h1>
  //     </div>
  //   );
  // }
  
  
  // const handleDownload = async () => {
  //   // look thru all students
  //   students.forEach(async (student) => {
  //     if (student.student.status === "Not Attempted") return;
  //     const response = await axios.get(`/api/paper/marking/download_IE_attempt`, {
  //       params: {
  //         paperId: exam.paper_id,
  //         studentId: student.student.p_number,
  //       },
  //       responseType: "blob",
  //     });

  //     const href = window.URL.createObjectURL(response.data);
  //     const link = document.createElement("a");

  //     // Include student ID in the file name
  //     const fileNameWithStudentId =
  //       response.headers["content-disposition"].split("filename=")[1];
  //     link.href = href;
  //     link.download = student.student.p_number + "_" + fileNameWithStudentId; // Add student ID to the filename
  //     document.body.appendChild(link);
  //     link.click();
  //     document.body.removeChild(link);
  //     window.URL.revokeObjectURL(href);
  //   });
  // };

  const handleDownload = async () => {
    let students_ids_attempted = students
    .filter((student) => {return student.student.status !== "Not Attempted"})
    .map((student) => student.student.p_number)
    console.log("students_ids_attempted: ", students_ids_attempted)

    // const res = await axios.get(`/api/paper/marking/download_ALL_IEs`,
    try{
      const res = await axios.get(`/api/paper/marking/download_IE_attempt`,
      {
        params: {
          paperId: exam.paper_id,
          studentIds: students_ids_attempted.join(",")
        },
        responseType: "blob"
      })

      if (res === "No file uploaded") return

      const href = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = href;
      const zip_name = `${exam.paper_name}_IE_Exams.zip`
      link.setAttribute('download', zip_name);
      document.body.appendChild(link);
      link.click();
    }
    catch(error){
      console.log("error in handleDownload: ", error)
    }
  };

  return (
    <div>
      <Spinner loading={loading} />
      <table
        id="my-table"
        className="table-auto w-full mt-10 font-poppins text-left shadow-lg"
      >
        <thead>
          <tr className="bg-white text-black text-3xl font-normal font-sans">
            <th colSpan={5} className="px-4 py-2 text-center remove-col">
              {exam?.course?.course_name && (
                <>
                  {exam.course.course_name} --- {exam.paper_name} (
                  <span className="text-red-600">{exam.status}</span>)
                </>
              )}
            </th>
          </tr>
          <tr id="second-row" className="bg-blue-800 text-white font-medium ">
            {user.level < 1 ? (
              <React.Fragment>
                <th className="px-4 py-2">Army Number</th>
                <th className="px-4 py-2">Student Name</th>
              </React.Fragment>
            ) : (
              <th className="px-4 py-2">Evaluation Code</th>
            )}

            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Marks</th>
            <th className="px-4 py-2">Remarks</th>
            <th className="px-4 py-2"></th>
          </tr>
        </thead>
        <tbody>
          {students.map((student, index) => (
            <tr
              key={student.student.p_number}
              className={`h-12 ${
                student.student.status === "Marked"
                  ? "bg-green-200"
                  : student.student.status === "Not Attempted"
                  ? "bg-red-200"
                  : student.student.status === "Re-Check"
                  ? "bg-yellow-200"
                  : "bg-gray-200"
              }`}
            >
              {user.level < 1 ? (
                <React.Fragment>
                  <td
                    className={`px-4 py-2 border ${
                      index === students_data.length - 1 &&
                      "border-b-gray-300 border-b"
                    }`}
                  >
                    {student.student.p_number}
                  </td>
                  <td
                    className={`px-4 py-2 border ${
                      index === students_data.length - 1 &&
                      "border-b-gray-300 border-b"
                    }`}
                  >
                    {student.student.name}
                  </td>
                </React.Fragment>
              ) : (
                <td
                  className={`px-4 py-2 border ${
                    index === students_data.length - 1 &&
                    "border-b-gray-300 border-b"
                  }`}
                >
                  {student.student.eval_code}
                </td>
              )}
              <td
                className={`px-4 py-2 border ${
                  index === students_data.length - 1 &&
                  "border-b-gray-300 border-b"
                }`}
              >
                {student.student.status}
              </td>
              <td
                className={`px-4 py-2 border ${
                  index === students_data.length - 1 &&
                  "border-b-gray-300 border-b"
                }`}
              >
                {student.student.status === "Marked"
                  ? student.student.obtainedMarks
                  : "Not Marked"}
              </td>
              <td
                className={`px-4 py-2 border text-center ${
                  index === students_data.length - 1 &&
                  "border-b-gray-300 border-b w-32"
                }`}
              >
                {marked && student.student.status === "Marked" && (
                  <>
                    {highestMarks === student.student.obtainedMarks ? (
                      <>
                        Highest
                        <FaRegThumbsUp className="text-green-600 text-lg inline ml-2" />
                      </>
                    ) : lowestMarks === student.student.obtainedMarks ? (
                      <>
                        Lowest
                        <FaRegThumbsDown className="text-red-600 text-lg inline ml-2" />
                      </>
                    ) : (
                      ""
                    )}
                  </>
                )}
              </td>
              <td
                className={`px-4 py-2 border w-[15%] text-center ${
                  index === students_data.length - 1 &&
                  "border-b-gray-300 border-b"
                }`}
              >
                {((student.student.status !== "Not Attempted" &&
                  exam.status !== "Result Locked") ||
                  user.level < 1) && (
                  <Link
                    href={`/faculty/${
                      user.level < 1 ? "print_results" : "mark_exam"
                    }/${exam?.paper_id}/${student.student.p_number}`}
                  >
                    <button className="bg-blue-800 hover:bg-blue-700 text-white py-2 px-2 text-sm rounded ">
                      Check Answers
                    </button>
                  </Link>
                )}
              </td>
            </tr>
          ))}

          {marked && (
            <>
              <tr id="last-row" className={"bg-gray-300"}>
                <td className="px-4 py-2">
                  <div className="flx flex justify-between font-semibold">
                    <p>Class Average: </p>
                    <p>{classAverage.toFixed(2)}</p>
                  </div>
                </td>
                <td className="px-4 py-2 border-l border-gray-500">
                  <div className="flx flex justify-between font-semibold">
                    <p>Lowest Marks: </p>
                    <p>{lowestMarks}</p>
                  </div>
                </td>
                <td className="px-4 py-2 border-l border-gray-500">
                  <div className="flx flex justify-between font-semibold">
                    <p>Highest Marks: </p>
                    <p>{highestMarks}</p>
                  </div>
                </td>
                <td className="px-4 py-2 border-l border-gray-500">
                  <div className="flx flex justify-between font-semibold">
                    <p>Total Marks: </p>
                    <p>{exam.total_marks}</p>
                  </div>
                </td>
                <td className="px-4 py-2 border-l border-gray-500"></td>
                <td></td>
              </tr>
            </>
          )}
        </tbody>
      </table>
      {!isPrinter && (
        <div className="flex justify-end py-4 space-x-10 mt-10">
          {exam.status === "Result Locked" && user.level >= 4 && (
            <button
              className={`bg-blue-800 hover:bg-blue-700 text-white text-lg py-3 px-4 rounded-md`}
              onClick={() => {
                setShowShareModal(true);
              }}
            >
              Share Result
              <MdShare className="ml-2 mb-0.5 inline" />
            </button>
          )}
          {user.level < 1 && (
            <button
              className={`bg-blue-800 hover:bg-blue-700 text-white text-lg py-3 px-4 rounded-md`}
              onClick={handleExport}
            >
              Export to Excel
              <MdDownload className="ml-2 mb-0.5 inline" />
            </button>
          )}
          {exam.status === "Approved" && (
            <button
              className={`bg-blue-800 hover:bg-blue-700 text-white text-lg py-3 px-4 rounded-md`}
              onClick={handleCloseExam}
            >
              Close Exam
              <IoMdEyeOff className="ml-2 mb-0.5 inline" />
            </button>
          )}
          <button
            className={`
          ${
            exam.status === "Result Locked"
              ? "bg-gray-400 p cursor-not-allowed"
              : "bg-blue-800 hover:bg-blue-700"
          }
          text-white text-lg py-3 px-4 rounded-md`}
            onClick={handleLockResult}
          >
            {exam.status === "Result Locked" ? "Result Locked" : "Lock Result"}

            <MdLock className="ml-2 mb-0.5 inline" />
          </button>

          {exam.paper_type === "IE" && (
            <button 
            onClick={handleDownload}
            className="bg-red-800 hover:bg-red-700 text-white text-lg py-3 px-4 rounded-md">
              Download All IE
              <MdDownload className="ml-2 mb-0.5 inline" />
            </button>
          )}
        </div>
      )}
      {isPrinter && (
        <div className="flex justify-end py-4">
          <button
            className={`bg-blue-800 hover:bg-blue-700 text-white text-lg py-3 px-4 rounded-md`}
            onClick={handlePrint}
          >
            Print Result
          </button>
        </div>
      )}
      <ShareModal
        showModal={showShareModal}
        setShowModal={setShowShareModal}
        exam={exam}
      />
    </div>
  );
};

export default StudentsTable;
