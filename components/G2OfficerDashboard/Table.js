import React from "react";
import { MdPrint } from "react-icons/md";
import { convertDateTimeToStrings } from "@/lib/TimeCalculations";
import { useRouter } from "next/router";

const Table = ({ exams }) => {
  const router = useRouter();
  console.log(
    exams[0]
  );
  return (
    <table className="table-auto rounded-md font-poppins w-full text-left">
      <thead>
        <tr className="bg-blue-800 rounded-md text-white">
          <th className="px-4 py-2 border">Sr No.</th>
          <th className="px-4 py-2 border">Course Code</th>
          <th className="px-4 py-2 border">Exam Name</th>
          <th className="px-4 py-2 border">Course</th>
          <th className="px-4 py-2 border">Type</th>
          <th className="px-4 py-2 border">Date</th>
          <th className="px-4 py-2 border"></th>
        </tr>
      </thead>
      <tbody>
        {exams
          .sort(
            (a, b) => -new Date(a.date).getTime() + new Date(b.date).getTime()
          )
          .map((exam, index) => (
            <tr key={index} className="bg-white ">
              <td className=" px-4 py-3 border">{index+1}</td>
              <td className=" px-4 py-3 border">{exam.course_code}</td>
              <td className=" px-4 py-3 border">{exam.paper_name}</td>
              <td className=" px-4 py-3 border">{exam.course.course_name}</td>
              <td className=" px-4 py-3 border">{exam.paper_type}</td>
              <td className=" px-4 py-3 border">
                {convertDateTimeToStrings(exam.date, true)}
              </td>
             
              <td className="px-4 text-center">
                <button
                  onClick={() => {
                    router.push(`/faculty/print_results/${exam.paper_id}`);
                  }}
                  className="hover:bg-blue-900 bg-blue-800 text-white p-2 rounded-md transition-colors "
                >
                  <MdPrint />
                </button>
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
};

export default Table;
