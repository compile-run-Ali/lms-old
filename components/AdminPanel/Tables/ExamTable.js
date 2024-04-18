import React, { useState, useEffect } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useRouter } from "next/router";
import {
  returnDateInString,
  convertDateTimeToStrings,
} from "@/lib/TimeCalculations";

const ExamTable = ({
  exams_data,
  faculty,
  setOpen,
  setSelectedForDeletion,
}) => {
  const router = useRouter();

  const [exams, setExams] = useState([]);

  const openModal = (paperId) => {
    setOpen(true);
    setSelectedForDeletion(paperId);
  };

  useEffect(() => {
    setExams(exams_data);
  }, [exams_data]);

  const handleExamEdit = (exam) => {
    router.push({
      pathname: `/faculty/create_exam/${
        exam.paper_type === "Objective"
          ? "objective"
          : exam.paper_type === "Subjective/Objective"
          ? "subjective"
          : exam.paper_type === "IE"
          ? "ie"
          : "word"
      }`,
      query: {
        paper_id: exam.paper_id,
        is_edit: true,
      },
    });
  };

  const getExamOfficer = (findId) => {
    let examOfficer = faculty.find((faculty) => faculty.faculty_id === findId);
    return examOfficer?.name;
  };

  return (
    <table className="table-auto mt-10 rounded-md font-poppins w-full text-left shadow-md">
      <thead>
        <tr className="bg-blue-800 rounded-md text-white">
          <th className="px-4 py-2 border border-gray-500">Exam Name</th>
          <th className="px-4 py-2 border border-gray-500">Course</th>
          <th className="px-4 py-2 border border-gray-500">Type</th>
          <th className="px-4 py-2 border border-gray-500">Date</th>
          <th className="px-4 py-2 border border-gray-500">Time</th>
          <th className="px-4 py-2 border border-gray-500">Status</th>
          <th className="px-4 py-2 border border-gray-500 w-20 text-center">
            Edit
          </th>
          <th className="px-4 py-2 border border-gray-500 w-20 text-center">
            Delete
          </th>
        </tr>
      </thead>
      <tbody>
        {exams
          .sort(
            (a, b) => -new Date(a.date).getTime() + new Date(b.date).getTime()
          )
          .map((exam, index) => (
            <tr key={index} className="bg-white ">
              <td className="border border-gray-500 px-4 py-3">
                {exam?.paper_name}
              </td>
              <td className="border border-gray-500 px-4 py-3">
                {exam?.course?.course_name}
              </td>
              <td className="border border-gray-500 px-4 py-3">
                {exam?.paper_type}
              </td>
              <td className="border border-gray-500 px-4 py-3">
                {returnDateInString(exam?.date, true)}
              </td>
              <td className="border border-gray-500 px-4 py-3">
                {convertDateTimeToStrings(exam?.date)}
              </td>
              <td className="border border-gray-500 px-4 py-3">
                {exam.status}{" "}
                {exam.status === "Pending Approval" && (
                  <>from {getExamOfficer(exam.examofficer?.faculty_id)}</>
                )}{" "}
              </td>
              <td className="border border-gray-500 w-20 text-center">
                <button
                  onClick={() => handleExamEdit(exam)}
                  className="hover:bg-blue-800 text-blue-800 hover:text-white p-2 rounded-md transition-colors "
                >
                  <MdEdit />
                </button>
              </td>
              <td className="border border-gray-500 w-20 text-center">
                <button
                  onClick={() => openModal(exam.paper_id)}
                  className="text-red-600 p-2 hover:text-white hover:bg-red-600 rounded-md transition-colors"
                >
                  <MdDelete />
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default ExamTable;
