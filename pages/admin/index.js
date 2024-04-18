import AdminPanel from "@/components/AdminPanel";
import BaseLayout from "@/components/BaseLayout/BaseLayout";
import DashboardLayout from "@/components/DasboardLayout/DashboardLayout";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";

/** @param {import('next').InferGetServerSidePropsType<typeof getServerSideProps> } props */

export default function Index() {
  const [faculty_data, setFacultyData] = useState([]);
  const [courses_data, setCoursesData] = useState([]);
  const [student_data, setStudentData] = useState([]);
  const [ip_data, setIpData] = useState([]);
  const [exams_data, setExamsData] = useState([]);
  const [loading, setLoading] = useState({
    faculty: true,
    courses: true,
    student: true,
    exams: true,
    ip_data: true,
  });

  const [error, setError] = useState({
    faculty: false,
    courses: false,
    student: false,
    exams: false,
  });

  const fetchData = async () => {
    setLoading({
      faculty: true,
      courses: true,
      student: true,
      exams: true,
    });

    try {
      const faculty = await axios.get("/api/admin/faculty/get_faculty");
      setFacultyData(faculty.data);
      setLoading((prevLoading) => ({
        ...prevLoading,
        faculty: false,
      }));
    } catch (facultyError) {
      console.log("error in api: /api/admin/faculty/get_faculty", facultyError);
      setError((prevError) => ({
        ...prevError,
        faculty: "Error in loading faculty data.",
      }));
    }

    try {
      const courses = await axios.get("/api/admin/course/get_courses");
      setCoursesData(courses.data);
      setLoading((prevLoading) => ({
        ...prevLoading,
        courses: false,
      }));
    } catch (coursesError) {
      console.log("error in api: /api/admin/course/get_courses", coursesError);
      setError((prevError) => ({
        ...prevError,
        courses: "Error in loading courses data.",
      }));
    }

    try {
      const student = await axios.get("/api/admin/student/get_student");
      setStudentData(student.data);
      setLoading((prevLoading) => ({
        ...prevLoading,
        student: false,
      }));
    } catch (studentError) {
      console.log(
        "error in api: /api/admin/student/get_students",
        studentError
      );
      setError((prevError) => ({
        ...prevError,
        student: "Error in loading student data.",
      }));
    }

    try {
      const exams = await axios.get("/api/admin/paper/get_exams");
      setExamsData(exams.data);
      setLoading((prevLoading) => ({
        ...prevLoading,
        exams: false,
      }));
    } catch (examsError) {
      console.log("error in api: /api/admin/paper/get_exams", examsError);
      setError((prevError) => ({
        ...prevError,
        exams: "Error in loading exams data.",
      }));
    }

    try {
      const ip = await axios.get("/api/admin/ip/get_ip");
      console.log(ip)
      setIpData(ip.data);
      setLoading((prevLoading) => ({
        ...prevLoading,
        ip: false,
      }));

    }
    catch (ipError) {
      console.log("error in api: /api/admin/ip/get_ip", ipError);
      setError((prevError) => ({
        ...prevError,
        exams: "Error in loading ip data.",
      }));
    }
    
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <BaseLayout title={"Admin Panel"}>
      <DashboardLayout admin>
        <AdminPanel
          faculty_data={faculty_data}
          courses_data={courses_data}
          student_data={student_data}
          exams_data={exams_data}
          ip_data={ip_data}
          loading={loading}
          error={error}
        />
      </DashboardLayout>
    </BaseLayout>
  );
}
