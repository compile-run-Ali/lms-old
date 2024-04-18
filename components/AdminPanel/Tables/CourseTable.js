import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { FaExchangeAlt } from "react-icons/fa";
import { useRouter } from "next/router";

const CourseTable = ({
  setOpen,
  courses,
  setAssignFacultyOpen,
  setSelectedCourse,
}) => {
  const router = useRouter();

  const [coursesData, setCoursesData] = useState([]);

  useEffect(() => {
    setCoursesData(courses);
  }, [courses]);

  const openModal = (index) => {
    setOpen(true);
    setSelectedCourse(coursesData[index].course_code);
  };

  const handleEditMCQ = (index) => () => {
    // Implement this
    router.push({
      pathname: "/admin/add_course",
      query: {
        course_name: coursesData[index].course_name,
        course_code: coursesData[index].course_code,
        credit_hours: coursesData[index].credit_hours,
        max_students: coursesData[index].max_students,
      },
    });
  };

  return (
    <table className="table-auto mt-10 rounded-md font-poppins w-full text-left shadow-md">
      <thead>
        <tr className="bg-blue-800 rounded-md text-white">
          <th className="px-4 py-2 border border-gray-500">Name</th>
          <th className="px-4 py-2 border border-gray-500">Course Code</th>
          <th className="px-4 py-2 border border-gray-500">
            Enrolled Students
          </th>
          <th className="px-4 py-2 border border-gray-500">Max Students</th>
          <th className="px-4 py-2 border border-gray-500 text-center w-20">
            Assign
          </th>
          <th className="px-4 py-2 border border-gray-500 text-center w-20">
            Edit
          </th>
          <th className="px-4 py-2 border border-gray-500 text-center w-20">
            Delete
          </th>
        </tr>
      </thead>
      <tbody>
        {coursesData.map((course, index) => (
          <tr key={index} className="bg-white">
            <td className="px-4 py-2 border border-gray-500">
              {course.course_name}
            </td>
            <td className="px-4 py-2 border border-gray-500">
              {course.course_code}
            </td>
            <td className="px-4 py-2 border border-gray-500">
              {course.student_count}
            </td>
            <td className="px-4 py-2 border border-gray-500">
              {course.max_students}
            </td>
            <td className="px-4 py-2 border border-gray-500 w-20 text-center">
              <button
                onClick={() => {
                  setSelectedCourse(course.course_code);
                  setAssignFacultyOpen(true);
                }}
                className="bg-white text-green-600 p-2 rounded hover:bg-green-600 hover:text-white transition-colors"
              >
                <FaExchangeAlt />
              </button>
            </td>
            <td className="px-4 py-2 border border-gray-500 w-20 text-center">
              <button
                onClick={handleEditMCQ(index)}
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
  );
};

export default CourseTable;
