import React, { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Input from "@/components/Common/Form/Input";
import Spinner from "@/components/Loader/Spinner";

const AddCourse = () => {
  const router = useRouter();
  const [loading, setLoading] = useState({});
  const [edit, setEdit] = useState(router.query.course_code ? true : false);
  const [name, setName] = useState(edit ? router.query.course_name : "");
  const [creditHours, setCreditHours] = useState(
    edit ? router.query.credit_hours : ""
  );
  const [courseCode, setCourseCode] = useState(
    edit ? router.query.course_code : ""
  );
  const [maxStudents, setMaxStudents] = useState(
    edit ? router.query.max_students : 50
  );

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (edit) {
      await addCourse({
        name,
        credit_hours: creditHours,
        max_students: maxStudents,
        updated_course_code: courseCode,
      });
    } else {
      await addCourse({
        name,
        credit_hours: creditHours,
        course_code: courseCode,
        max_students: maxStudents,
      });
    }
    setName("");
    setCreditHours("");
    setCourseCode("");
  };

  const addCourse = async (course) => {
    setLoading({ message: "Saving..." });
    axios
      .post(`/api/admin/course/${edit ? "edit_course" : "add_courses"}`, {
        course_code: edit ? router.query.course_code : null,
        ...course,
      })
      .then((res) => {
        setLoading(false);
        router.push("/admin");
      })
      .catch((err) => {
        setLoading({ error: "Error in saving course." });
        console.log("Error in add/edit course", err);
      });
  };

  return (
    <div className="flex justify-center ">
      <Spinner loading={loading} />
      <form
        onSubmit={handleSubmit}
        className=" bg-white py-6 rounded-lg shadow-xl w-2/3 px-10 "
      >
        <div className="mb-4">
          <Input
            text="Course Code"
            id="course-code"
            type="text"
            value={courseCode}
            onChange={(event) => setCourseCode(event.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <Input
            text="Course Name"
            id="name"
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
        </div>{" "}
        <div className="mb-4">
          <Input
            text="Max Students"
            id="max-students"
            type="number"
            required={true}
            min={0}
            value={maxStudents}
            onChange={(event) => setMaxStudents(event.target.value)}
          />
        </div>
        {/*    <div className="mb-4">
          <Input
            text="Credit Hours"
            id="credit-hours"
            type="text"
            value={creditHours}
            onChange={(event) => setCreditHours(event.target.value)}
          />
        </div> */}
        <div className="flex items-center justify-between">
          <button
            className=" font-poppins mt-8 bg-blue-800 hover:bg-blue-700 text-white font-semibold py-2 px-8 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddCourse;
