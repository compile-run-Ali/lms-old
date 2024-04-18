import React, { useState, useEffect } from "react";
import BaseLayout from "@/components/BaseLayout/BaseLayout";
import DashboardLayout from "@/components/DasboardLayout/DashboardLayout";
import MarkingDashboard from "@/components/MarkingDashboard/MarkingDashboard";
import axios from "axios";
import { useRouter } from "next/router";
import Loader from "@/components/Loader";

const MarkingPage = () => {
  const router = useRouter();
  const [studentsData, setStudentsData] = useState([]);
  const [exam, setExam] = useState({});
  const [loading, setLoading] = useState(true);

  const { exam_id } = router.query;

  const fetchStudents = async () => {
    // first fetch students
    const studentsPromise = axios.post("/api/paper/marking/get_students", {
      paper_id: router.query.exam_id,
    });
    const promises = [studentsPromise];
    const [students] = await Promise.all(promises);

    // now fetch spa and join it with students
    const studentSpaPromise = axios.post(
      "/api/student/paper/get_attempt_by_paper",
      {
        paperId: exam_id,
      }
    );

    const promises2 = [studentSpaPromise];
    const [studentSpa] = await Promise.all(promises2);

    // now join the two
    console.log( students,"sitndnd")
    students.data.forEach((student) => {
      if (
        studentSpa.data.find(
          (spa) => spa.studentId === student.student.p_number
        )
      ) {
        student.student = {
          ...student.student,
          ...studentSpa.data.find(
            (spa) => spa.studentId === student.student.p_number
          ),
        };
      } else {
        student.student = {
          ...student.student,
          status: "Not Attempted",
          obtainedMarks: 0,
        };
      }
    });


    let students_data = [];
    console.log(students,"students")
    if (students.data&& students.data.length > 0) {
      console.log("here")
      students_data = students.data.map(
        (student) => student
      );
    }
    console.log(students_data,"students_data")
    setStudentsData(students_data);
    setLoading(false);
  };

  const fetchExamDetails = () => {
    axios
      .post("/api/faculty/get_exam", {
        paper_id: exam_id,
      })
      .then((response) => {
        setExam(response.data);
      })
      .catch((error) => {
        console.log("Error in get_exams", error);
      });
  };

  useEffect(() => {
    if (exam_id) {
      fetchStudents();
      fetchExamDetails();
    }
  }, [exam_id]);

  return (
    <BaseLayout title={"Mark Exam"}>
      <DashboardLayout>
        {loading ? (
          <Loader />
        ) : (
          <MarkingDashboard
            students_data={studentsData}
            exam_id={exam_id}
            exam={exam}
            isPrinter={true}
          />
        )}
      </DashboardLayout>
    </BaseLayout>
  );
};

export default MarkingPage;
