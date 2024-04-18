import React, { useState } from "react";
import { useRouter } from "next/router";
import StudentTable from "../Tables/StudentTable";
import DeleteModal from "../Modals/DeleteModal";
import axios from "axios";

export default function Students({ students, setStudents }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState("");
  const addStudents = () => {
    router.push("/admin/add_student");
  };

  const handleDelete = async () => {
    console.log(selectedStudent);
    try {
      axios
        .post("/api/admin/student/remove_student", {
          p_number: selectedStudent,
        })
        .then((res) => {
          const newStudents = students.filter(
            (student) => student.student_id !== selectedStudent
          );
          setStudents(newStudents);
          setOpen(false);
        })
        .catch((error) => {
          console.log("An error occurred:", error);
        });
    } catch (error) {
      console.log("An error occurred:", error);
    }

    router.reload();
  };

  return (
    <div>
      <DeleteModal
        setIsOpen={setOpen}
        isOpen={open}
        handleDelete={handleDelete}
      />
      <div className="mt-10 flex justify-end">
        <button
          onClick={addStudents}
          className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Students
        </button>
      </div>
      <StudentTable
        setOpen={setOpen}
        students={students}
        setSelectedStudent={setSelectedStudent}
      />
    </div>
  );
}
