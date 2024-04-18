import React, { Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { useState, useEffect } from "react";
import { MdDelete } from "react-icons/md";

export default function StudentProfile({ student }) {
  const router = useRouter();
  const [courses, setCourses] = useState([]);
  const handleChangePassword = () => {
    router.push({
      pathname: "/change_password",
      query: {
        student_id: student.p_number,
        recovery: false,
        name: student.name,
      },
    });
  };
  async function getAllCourses() {
    try {
      const res = await axios.get("/api/admin/course/get_courses");
      setCourses(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  }
  useEffect(() => {
    getAllCourses();
  }, []);
  // p_number: pNumber,
  // course_code: selectedCourse,
  async function handleEnroll (course_code,course) {
    if(course.max_students==course.student_count){
      alert("You cannot enroll in this course as it has reached its maximum capacity")
      return
    }
    try {
      const res = await axios.post("/api/student/register", {
        p_number: student.p_number,
        course_code: course_code,
      });
      console.log(res.data);
      alert("Course enrolled successfully");
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }
  async function handleUnenroll (course_code) {

    try {
      const res = await axios.post("/api/student/unregister", {
        p_number: student.p_number,
        course_code: course_code,
      });
      alert("Course unenrolled successfully");
      console.log(res.data);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  }

  console.log(courses,"courses")
  return (
    <>
      {student ? (
        <div className="max-w-lg mx-auto bg-white shadow-lg overflow-hidden font-poppins relative">
          <h1 className="text-2xl font-bold text-white p-4 bg-blue-700">
            Student Details
          </h1>
          <div className="p-4">
            <p className="mb-2">
              <strong>Name:</strong> {student.name}
            </p>
            <p className="mb-2">
              <strong>Email:</strong> {student.email || "N/A"}
            </p>

            <p className="mb-2">
              <strong>Phone Number:</strong> {student.phone_number}
            </p>
            <p className="mb-2">
              <strong>Rank:</strong> {student.rank}
            </p>
            <p className="mb-2">
              <strong>Date of Birth:</strong>{" "}
              {new Date(student.DOB).toDateString()}
            </p>
            <p
              className="mb-2 underline font-bold cursor-pointer"
              onClick={handleChangePassword}
            >
              Change password
            </p>
          </div>
          <div className="w-40 aspect-square rounded-full border border-blue-900 absolute top-[76px] right-6">
            <Image
              src={`/uploads/${student.image ? student.image : "noface.jpeg"}`}
              fill
              className="rounded-full object-cover object-center"
              alt="user"
            />
          </div>
          <div className=" float-left m-4">
            <p className="font-bold text-lg">
              <strong>Courses available:</strong>
            </p>
            <div>
              {courses.length > 0 ? (
                <table className="table mt-2">
                  <thead>
                    <tr>
                      <th>Course Code</th>
                      <th>Status</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.id} className="text-center border border-black">
                        <td className="p-4 border border-black">{course.course_code}</td>
                        <td className="border border-black">
                          {student.courses.some(
                            (studentCourse) =>
                              studentCourse.course_code === course.course_code
                          ) ? (
                            <button className="text-green-700 mx-7" disabled>
                              Enrolled
                            </button>
                          ) : (
                            <button
                              className=" mx-7"
                              onClick={() => handleEnroll(course.course_code,course)}
                            >
                              Enroll
                            </button>
                          )}
                        </td>
                        <td>
                          {student.courses.some(
                            (studentCourse) =>
                              studentCourse.course_code === course.course_code
                          ) ? (
                            <button
                              className="text-red-500"
                              onClick={() => handleUnenroll(course.course_code)}
                            >
                              <MdDelete />
                            </button>
                          ) : (
                            <button className="text-blue-500" disabled>
                              <MdDelete />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                "N/A"
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <h1>Student not found</h1>
        </div>
      )}
    </>
  );
}
