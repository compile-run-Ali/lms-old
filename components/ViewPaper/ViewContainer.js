import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Loader from "../Loader";
import {
  convertDateTimeToStrings,
  getPaperDateTime,
  compareDateTime,
} from "@/lib/TimeCalculations";

export default function ViewContainer() {
  const router = useRouter();
  const { paper } = router.query;
  const { data: session, status } = useSession();
  const [paperDetails, setPaperDetails] = useState({});
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(
    () => () => {
      if (status === "authenticated") {
        setStudent(session.user.id);
      }
    },
    [session]
  );

  useEffect(() => {
    if (student && paper) {
      axios
        .get(`/api/student/paper/${student}`)

        .then((res) => {
          const requestedPaper = res.data.find(
            (paperObj) => paperObj.paper_id === paper
          );
          setPaperDetails(requestedPaper);
          if (requestedPaper) {
            // paper exists

            const paperDateTime = getPaperDateTime(
              requestedPaper.date,
              requestedPaper.duration,
              requestedPaper.objDuration
            );
            const paperStatus = compareDateTime(
              paperDateTime.start,
              paperDateTime.end
            );
            if (paperStatus !== "upcoming") {
              router.push(`/student`);
            }
          }
          setLoading(false);
        });
    }
  }, [student, paper]);

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="pr-10   pl-7 font-poppins w-full ">
      <div className="bg-gray-100 bg-opacity-50 py-10 rounded-md">
        <div className="font-semibold text-center text-3xl mt-5 mb-10">
          Exam Details
        </div>

        <div className="grid grid-cols-3 gap-y-3">
          <div className="pl-20">
            <span className=" font-medium">Exam Name:</span>
            <span className="ml-2">{paperDetails.paper_name}</span>
          </div>
          <div className="pl-20">
            <span className=" font-medium">Exam Type:</span>
            <span className="ml-2">{paperDetails.paper_type}</span>
          </div>
          <div className="pl-20">
            <span className=" font-medium">Exam Date:</span>
            <span className="ml-2">
              {convertDateTimeToStrings(paperDetails.date, true)}
            </span>
          </div>
          <div className="pl-20">
            <span className=" font-medium">Exam Time:</span>
            <span className="ml-2">
              {convertDateTimeToStrings(paperDetails.date)}
            </span>
          </div>
          <div className="pl-20">
            {paperDetails.paper_type === "Subjective/Objective" || "Word" && !"IE" ? (
              <React.Fragment>
                <span className=" font-medium">Objective Duration:</span>
                <span className="ml-2">{paperDetails.objDuration} minutes</span>
                <span className=" font-medium">Subjective Duration:</span>
                <span className="ml-2">{paperDetails.duration} minutes</span>
              </React.Fragment>
            )
              :
              paperDetails.paper_type === "Objective" ? (
                <React.Fragment>
                  <span className=" font-medium">Exam Duration:</span>
                  <span className="ml-2">{paperDetails.objDuration} minutes</span>
                </React.Fragment>
              )
                :
                (
                  <React.Fragment>
                    <span className=" font-medium">Exam Duration:</span>
                    <span className="ml-2">{paperDetails.duration} minutes</span>
                  </React.Fragment>
                )
            }
          </div>
          <div className="pl-20">
            <span className=" font-medium">Marks:</span>
            <span className="ml-2">{paperDetails.total_marks}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
