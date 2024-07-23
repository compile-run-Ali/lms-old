import React, { useEffect, useState } from "react";
import BaseLayout from "@/components/BaseLayout/BaseLayout";
import DashboardLayout from "@/components/DasboardLayout/DashboardLayout";
import G2OfficerDashboard from "@/components/G2OfficerDashboard";
import { useSession } from "next-auth/react";
import axios from "axios";
import Loader from "@/components/Loader";

const Print = () => {
  const session = useSession();
  const [exams, setExams] = useState([]);
  const [paperapproval, setPaperApproval] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchExams = () => {
    setLoading(true);
    axios
      .post("/api/faculty/get_exams_g2", {
        course_code: selectedCourse,
      })
      .then((res) => {
        setExams(res.data.courses || []);
        setPaperApproval(res.data.paperapproval || []);
        setLoading(false);
      })
      .catch((error) => {
        console.log("error in api: /api/faculty/get_exams", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    if (session.status === "authenticated") {
      fetchExams();
    }
  }, [session.status, selectedCourse]);

  return (
    <BaseLayout>
      <DashboardLayout>
        {loading ? (
          <Loader />
        ) : (
          <G2OfficerDashboard
            exams_data={exams}
            paperapproval_data={paperapproval}
            selectedCourse={selectedCourse}
            setSelectedCourseDash={setSelectedCourse}
          />
        )}
      </DashboardLayout>
    </BaseLayout>
  );
};

export default Print;
