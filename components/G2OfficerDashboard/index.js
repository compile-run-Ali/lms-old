import React, { useEffect, useState } from "react";
import axios from "axios";
import Table from "./Table";
import Spinner from "../Loader/Spinner";
import Loader from "../Loader";

const G2OfficerDashboard = () => {
  const [exams, setExams] = useState([]);
  const [spinning, setSpinner] = useState({});
  const [loading, setLoading] = useState({});

  useEffect(() => {
    setLoading(true);
    axios
      .get("/api/admin/paper/get_exams")
      .then((res) => {
        setLoading(false);
        setExams(res.data.filter((exam) => exam.status === "Result Locked"));
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setSpinner({
          error: "Error in loading exams.",
        });
      });
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="px-10">
      <Spinner loading={spinning} />
      <div className="text-4xl mt-10 mb-4 font-poppins">Print Results</div>
      <Table exams={exams} />
    </div>
  );
};

export default G2OfficerDashboard;
