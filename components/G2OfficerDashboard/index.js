import React, { useEffect, useState } from "react";
import Table from "./Table";
import Spinner from "../Loader/Spinner";
import Loader from "../Loader";

const G2OfficerDashboard = ({ exams_data, paperapproval_data, selectedCourse, setSelectedCourseDash }) => {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  console.log(exams_data, "exams_data");
  useEffect(() => {
    if (exams_data && exams_data.length > 0) {
      const sortedExams = exams_data?.sort((a, b) =>
        a.course_name.localeCompare(b.course_name)
      );
      const uniqueCourses = [...new Map(sortedExams.map((exam) => [exam.course_code, exam])).values()];

      setCourses(uniqueCourses);
      const initialCourse = localStorage.getItem("selectedCourse") || (uniqueCourses[0]?.course_code || "");
      setSelectedCourseDash(initialCourse);
      setExams(sortedExams.filter((exam) => exam.course_code === initialCourse));
    }
  }, [exams_data, selectedCourse, setSelectedCourseDash]);

  const handleCourseChange = (e) => {
    const newCourseCode = e.target.value;
    setSelectedCourseDash(newCourseCode);
    localStorage.setItem("selectedCourse", newCourseCode);

    const courseExams = exams_data.filter((exam) => exam.course_code === newCourseCode);
    setExams(courseExams);
  };

  return (
    <div className="px-10">
      <Spinner loading={loading} />
      <div className="text-4xl mt-10 mb-4 font-poppins">Print Results</div>
      <h1 className="text-2xl font-poppins font-bold">Courses List:</h1>
      <select
        className="bg-white border rounded-md px-3 py-2"
        onChange={handleCourseChange}
        value={selectedCourse}
      >
        {courses.length > 0 ? (
          courses.map((course, index) => (
            <option key={index} value={course.course_code}>
              {course.course_code} - {course.course_name}
            </option>
          ))
        ) : (
          <option value="">No Courses</option>
        )}
      </select>
      <Table exams={exams[0]} selectedCourse={selectedCourse} />
    </div>
  );
};

export default G2OfficerDashboard;
