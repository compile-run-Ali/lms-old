import React from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import Link from "next/link";
import { useRouter } from "next/router";

export default function StudentTable({
  setOpen,
  students,
  setSelectedStudent,
}) {
  const router = useRouter();
  const openModal = (index) => {
    setOpen(true);
    setSelectedStudent(students[index].p_number);
  };

  const editStudent = (index) => {
    router.push({
      pathname: "/admin/add_student",
      query: {
        p_number: students[index].p_number,
        name: students[index].name,
        phone_number: students[index].phone_number,
        cgpa: students[index].cgpa,
        email: students[index].email,
        DOB: students[index].DOB,
        rank: students[index].rank,
        selectedCourse: JSON.stringify(students[index].courses[0]),
      },
    });
  };
  console.log(students, "students")

  return (
    <div>
      <table className="table-auto mt-10 rounded-md font-poppins w-full text-left shadow-md">
        <thead>
          <tr className="bg-blue-800 rounded-md text-white">
            <th className="px-4 py-2 border border-gray-500">Sr. #</th>
            <th className="px-4 py-2 border border-gray-500">Army Number</th>
            <th className="px-4 py-2 border border-gray-500">Name</th>
            <th className="px-4 py-2 border border-gray-500">Phone Number</th>
            <th className="px-4 py-2 border border-gray-500">Email</th>
            <th className="px-4 py-2 border border-gray-500">DOB</th>
            <th className="px-4 py-2 border border-gray-500">Rank</th>
            <th className="px-4 py-2 border border-gray-500">Courses</th>
            <th className="px-4 py-2 border border-gray-500 w-20 text-center">
              Edit
            </th>
            <th className="px-4 py-2 border border-gray-500 w-20 text-center">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {students
            .sort((a, b) => parseInt(a.p_number) - parseInt(b.p_number))
            .map((student, index) => (
              <tr key={index} className="bg-white">
                <td className=" px-4 py-2 border border-gray-500">
                  {index + 1}
                </td>
                <td className=" px-4 py-2 border border-gray-500">
                  {student.p_number}
                </td>
                <td className=" px-4 py-2 border border-gray-500">
                  {student.name}
                </td>
                <td className=" px-4 py-2 border border-gray-500">
                  {student.phone_number}
                </td>
                <td className=" px-4 py-2 border border-gray-500">
                  {student.email}
                </td>
                <td className=" px-4 py-2 border border-gray-500">
                  {new Date(student.DOB).toDateString()}
                </td>
                <td className=" px-4 py-2 border border-gray-500">
                  {student.rank}
                </td>
                <td className=" px-4 py-2 border border-gray-500">
                  {student.courses.map((course, index) => (
                    <div key={index}>
                      <span>
                        {course.course_code}
                      </span>
                      <br />
                    </div>
                  ))}
                </td>
                <td className="px-4 py-2 border border-gray-500 w-20 text-center">
                  <button
                    onClick={() => {
                      editStudent(index);
                    }}
                    className="bg-white text-blue-900 p-2 rounded hover:bg-blue-900 hover:text-white transition-colors"
                  >
                    <MdEdit />
                  </button>
                </td>
                <td className="px-4 py-2 border border-gray-500 w-20 text-center">
                  <button
                    onClick={() => {
                      openModal(index);
                    }}
                    className="bg-white text-red-600 p-2 rounded hover:bg-red-600 hover:text-white transition-colors"
                  >
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
