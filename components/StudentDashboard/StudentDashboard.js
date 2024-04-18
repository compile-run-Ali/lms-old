import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import PapersList from "../Paper/PapersList";
import { compareDateTime, getPaperDateTime } from "@/lib/TimeCalculations";

export default function StudentDashboard({ session }) {
  const [index, setIndex] = useState(null);
  const [student, setStudent] = useState(null);
  const [pastPapers, setPastPapers] = useState([]);
  const [livePapers, setLivePapers] = useState([]);
  const [upcomingPapers, setUpcomingPapers] = useState([]);

  const papers = [
    {
      title: "Live Papers",
      papers: livePapers,
    },
    {
      title: "Upcoming Papers",
      papers: upcomingPapers,
    },
    {
      title: "Past Papers",
      papers: pastPapers,
    },
  ];

  // fetch course of student
  // then fetch papers of that course
  // for previous Papers
  // if the paper is clicked, and review is allowed, send to dynamic route of that paper

  const getStudentAndSetPapers = async () => {
    try {
      const studentexams = await axios.get(`/api/student/paper/${index}`);
      const approvedPapers = studentexams.data.filter(
        (paper) =>
          paper.status !== "Draft" && paper.status !== "Pending Approval" && paper.status !== "unapproved"
      );

      // categorize papers here
      const past = [];
      const live = [];
      const upcoming = [];

      for (const paper of approvedPapers) {
        console.log(paper, "paper")

        if (
          compareDateTime(
            getPaperDateTime(paper.date, paper.duration, paper.objDuration).start,
            getPaperDateTime(paper.date, paper.duration, paper.objDuration).end
          ) === "past"
        ) {
          past.push(paper);
        } else if (
          compareDateTime(
            getPaperDateTime(paper.date, paper.duration, paper.objDuration).start,
            getPaperDateTime(paper.date, paper.duration, paper.objDuration).end
          ) === "live"
        ) {
          live.push(paper);
        } else if (
          compareDateTime(
            getPaperDateTime(paper.date, paper.duration, paper.objDuration).start,
            getPaperDateTime(paper.date, paper.duration, paper.objDuration).end
          ) === "upcoming"
        ) {
          upcoming.push(paper);
        }
      }
      setPastPapers(past);
      setLivePapers(live);
      setUpcomingPapers(upcoming);
    } catch (err) {
      console.log(err)
      alert("Please Enroll in a course!");
      return;
    }
  };

  useEffect(() => {
    if (session.status === "authenticated") {
      setIndex(session.data.user.id);
      setStudent(session.data.user);
      index !== null && getStudentAndSetPapers();
    }
  }, [session, index]);

  return (
    <div className="px-8 py-4">
      <div className="flex justify-between mb-8 px-4 bg-blue-100 bg-opacity-40 text-black font-poppins py-4 items-center">
        <div className="text-2xl">{student?.name}</div>
        <div className="text-lg">{student?.email}</div>
      </div>
      {papers.map(
        (paper) =>
          paper.papers.length > 0 && (
            <div key={paper.title}>
              <div>
                <p className="text-3xl font-bold mb-0">{paper.title}</p>
              </div>
              <div className="font-poppins">
                <PapersList
                  key={paper.id}
                  papers={paper.papers}
                  status={paper.title}
                  p_number={student?.p_number}
                />
              </div>
            </div>
          )
      )}
    </div>
  );
}
