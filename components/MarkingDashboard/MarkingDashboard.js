import React from "react";
import StudentsTable from "./StudentsTable";

const MarkingDashboard = ({ students_data, exam_id, exam, isPrinter }) => {
  return (
    <div className="w-11/12 mx-auto">
      <h1 className="text-2xl font-poppins font-bold">Marking Dashboard</h1>
      <StudentsTable
        students_data={students_data}
        exam_id={exam_id}
        exam={exam}
        isPrinter={isPrinter}
      />
    </div>
  );
};

export default MarkingDashboard;
