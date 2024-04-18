import React, { useState } from "react";
import axios from "axios";

import CreateWordButton from "../CreateWordButton";
import ExamTable from "../Tables/ExamTable";
import DeleteModal from "../Modals/DeleteModal";
import Spinner from "@/components/Loader/Spinner";

const ExamContainer = ({ courses, exams, setExams, faculty }) => {
  const [selectedForDeletion, setSelectedForDeletion] = useState(null);
  const [loading, setLoading] = useState({});
  const [open, setOpen] = useState(false);

  const handleDelete = () => {
    setLoading({
      message: "Deleting Exam...",
    });
    axios
      .post("/api/admin/paper/delete_exam", {
        paper_id: selectedForDeletion,
      })
      .then((res) => {
        console.log(res);
        setLoading({});
        console.log("Exam Deleted Successfully", exams);
        setExams(exams.filter((exam) => exam.paper_id !== res.data.paper_id));
        setOpen(false);
      })
      .catch((err) => {
        setLoading({ error: "Error in deleting exam." });
        console.log(err);
      });
  };

  return (
    <div>
      <Spinner loading={loading} />
      <DeleteModal
        setIsOpen={setOpen}
        isOpen={open}
        handleDelete={handleDelete}
      />
      <CreateWordButton courses={courses} />
      <ExamTable
        exams_data={exams}
        faculty={faculty}
        setOpen={setOpen}
        setSelectedForDeletion={setSelectedForDeletion}
      />
    </div>
  );
};

export default ExamContainer;
