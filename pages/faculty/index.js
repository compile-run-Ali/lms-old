import BaseLayout from "@/components/BaseLayout/BaseLayout";
import DashboardLayout from "@/components/DasboardLayout/DashboardLayout";
import DashboardComponent from "@/components/DashboardComponent/DashboardComponent";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import Loader from "@/components/Loader";

export default function Dashboard() {
  const session = useSession();
  const [exams, setExams] = useState(null);
  const [paperapproval, setPaperApproval] = useState(null);
  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null); // [course_code, course_name
  const fetchExams = () => {
    axios
      .post("/api/faculty/get_exams", {
        faculty_id: session.data.user.id,
        course_code: localStorage.getItem("selectedCourse"),
      })
      .then((res) => {
        console.log(res, "check");
        console.log(res.data.selectedCoursePapers, "ahah");
        setExams(res.data.courses);
        setPaperApproval(res.data.paperapproval);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error in api: /api/faculty/get_exams", error);
      });
  };
  useEffect(() => {
    if (session.status === "authenticated") {
      fetchExams();
    }
  }, [session, selectedCourse]);
  useEffect(() => {
    if (session.status === "authenticated") {
      fetchExams();
    }
  }, [session]);
  console.log(exams, "exams to dash");
  return (
    <BaseLayout title={"Dashboard"}>
      <DashboardLayout>
        {loading || exams === null ? (
          <Loader />
        ) : (
          <DashboardComponent
            exams_data={exams}
            paperapproval_data={paperapproval}
            level={session.data.user.level}
            setSelectedCourseDash={setSelectedCourse}
          />
        )}
      </DashboardLayout>
    </BaseLayout>
  );
}
