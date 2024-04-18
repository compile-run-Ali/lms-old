import handle from "@/pages/api/paper/[index]";
import { useRouter } from "next/router";
import React, { useState } from "react";
import FacultyTable from "../Tables/FacultyTable";
import DeleteModal from "../Modals/DeleteModal";
import axios from "axios";

export default function Faculty({ faculty, setFaculty }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [selectedFaculty, setSelectedFaculty] = useState("");

  const addFaculty = () => {
    router.push("/admin/add_faculty");
  };
  const handleDelete = async () => {
    console.log(selectedFaculty);
    
    try {
      const deletedFaculty = await axios.post("/api/admin/faculty/remove_faculty", {
        faculty_id: selectedFaculty,
      });
      
      if (deletedFaculty.status === 200) {
        const newFaculty = faculty.filter(
          (faculty) => faculty.faculty_id !== selectedFaculty
        );
        setFaculty(newFaculty);
        setOpen(false);
      }
      
      router.reload();
    } catch (error) {
      alert("Error in deleting faculty");
      console.log("An error occurred:", error);
    }
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
          onClick={addFaculty}
          className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add Faculty
        </button>
      </div>
      <FacultyTable
        setOpen={setOpen}
        faculty={faculty}
        setSelectedFaculty={setSelectedFaculty}
      />
    </div>
  );
}
