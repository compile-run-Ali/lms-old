import React, { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";
import RemoveFacultyModal from "../Modals/RemoveFacultyModal";
import axios from "axios";

const AssignedTable = ({ course_data }) => {
  const [courseData, setCourseData] = useState([]);
  const [openedIndex, setOpenedIndex] = useState(-1);

  useEffect(() => {
    setCourseData(course_data);
  }, [course_data]);

  const handleRemove = (courseToBeDeleted, faculty) => {
    if (!faculty) return alert("Please select a faculty to remove.");
    //call api here to remove faculty
    try{
    axios
      .post("/api/admin/remove_faculty_from_course", {
        course_code: courseToBeDeleted,
        faculty_id: faculty,
      })
      .then((res) => {
        // update the table
        const updated = courseData.map((course) => {
          if (course.course_code === courseToBeDeleted) {
            course.faculty = course.faculty.filter(
              (fac) => fac.faculty_id !== faculty
            );
          }
          return course;
        });
        setCourseData(updated);
        setOpenedIndex(-1);
      })
      .catch((err) => console.log("Error in removing faculty", err));
    }catch(err){
      console.log(err)
    }
  };

  console.log("courseData", courseData[1]?.faculty);

  return (
    <table className="table-auto mt-10 rounded-md font-poppins w-full text-left shadow-md">
      <thead>
        <tr className="bg-blue-800 rounded-md text-white">
          <th className="px-4 py-2 border border-gray-500">Course</th>
          <th className="px-4 py-2 border border-gray-500">Assigned to:</th>
          <th className="px-4 py-2 border border-gray-500 w-32 text-center">
            Unassign
          </th>
        </tr>
      </thead>
      <tbody>
        {courseData.map((course, index) => (
          <tr key={index} className="bg-white">
            <td className=" px-4 py-2 border border-gray-500">{`${course.course_code} - ${course.course_name}`}</td>
            <td className=" px-4 py-2 border border-gray-500">
              <ul>
                {course.faculty.length > 0
                  ? course.faculty.map((fac, index) => (
                      <li key={fac.faculty_id}>
                        {index + 1}. {fac.name}
                      </li>
                    ))
                  : "No faculty assigned"}
              </ul>
            </td>
            <td className="w-32 border border-gray-500 text-center">
              <button
                onClick={() => {
                  setOpenedIndex(index);
                }}
                className="bg-white text-red-600 p-2 rounded hover:bg-red-600 hover:text-white transition-colors"
              >
                <MdDelete />
              </button>
              <RemoveFacultyModal
                isOpen={openedIndex === index}
                setIsOpen={setOpenedIndex}
                faculty={course.faculty.length > 0 ? course.faculty : []}
                course={course.course_code}
                handleRemove={handleRemove}
              />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default AssignedTable;
