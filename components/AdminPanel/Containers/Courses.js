import { useRouter } from "next/router";
import React, { useState } from "react";
import CourseTable from "../Tables/CourseTable";
import DeleteModal from "../Modals/DeleteModal";
import AssignFacultyModal from "../Modals/AssignFacultyModal";
import axios from "axios";
import Spinner from "@/components/Loader/Spinner";

export default function Courses({ courses, setCourses, faculty }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [assignFacultyOpen, setAssignFacultyOpen] = useState(false);
  const [loading, setLoading] = useState({});
  const addCourses = () => {
    router.push("/admin/add_course");
  };
  const handleDelete = async () => {
    const deletedCourse = await axios.post("/api/admin/course/remove_course", {
      course_code: selectedCourse,
    });
    if (deletedCourse.status === 200) {
      const newCourses = courses.filter(
        (course) => course.course_code !== selectedCourse
      );
      setCourses(newCourses);
      setOpen(false);
    }
  };

  const handleAssignFaculty = async (faculty) => {
    if (!faculty) return alert("Please select a faculty");

    setLoading({ message: "Enrolling in course..." });

    await axios
      .post("/api/admin/assign_faculty_to_courses", {
        course_code: selectedCourse,
        faculty_id: faculty,
      })
      .then((res) => {
        console.log("Response", res);
        if (res.status === 200) {
          const newCourses = courses.map((course) => {
            if (res.data.course.course_code === course.course_code) {
              return {
                ...course,
                faculty: [...course.faculty, res.data.faculty],
              };
            }
            return course;
          });
          setCourses(newCourses);
          setAssignFacultyOpen(false);
          setLoading({});
        }
      })
      .catch((err) => {
        setLoading({ error: "Error in assigning course." });
        console.log("Error", err);
        if (err.response.status === 409) {
          alert("Faculty already assigned to this course");
        }
      });
    // router.reload();
  };
  return (
    <div>
      <DeleteModal
        setIsOpen={setOpen}
        isOpen={open}
        handleDelete={handleDelete}
      />
      <AssignFacultyModal
        loading={loading}
        setIsOpen={setAssignFacultyOpen}
        isOpen={assignFacultyOpen}
        faculty={faculty}
        handleAssignment={handleAssignFaculty}
      />
      <div className="mt-10 flex justify-end">
        <button
          onClick={addCourses}
          className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Courses
        </button>
      </div>
      <CourseTable
        setOpen={setOpen}
        courses={courses}
        setAssignFacultyOpen={setAssignFacultyOpen}
        faculty={faculty}
        setSelectedCourse={setSelectedCourse}
      />
    </div>
  );
}
