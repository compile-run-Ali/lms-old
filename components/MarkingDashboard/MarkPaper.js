import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

const MarkPaper = ({
  print,
  objectiveAnswers,
  subjectiveAnswers,
  objectiveQuestions,
  subjectiveQuestions,
  paperDetails,
  ieMarks,
  isStudent = false,
}) => {
  const router = useRouter();
  const { p_number, exam_id } = router.query;
  const session = useSession();
  console.log(session, "session");
  const user = session?.data?.user;
  const [obtainedMarks, setObtainedMarks] = useState(0);
  const [objectiveMarks, setObjectiveMarks] = useState(0);
  const [subjectiveMarks, setSubjectiveMarks] = useState(0);
  const [totalMarks, setTotalMarks] = useState(0);
  const [saved, setSaved] = useState(false);
  const [marksSet, setMarksSet] = useState(
    localStorage.getItem("marksSet") === "true" // Retrieve marksSet value from local storage
  );
  useEffect(() => {
    if (paperDetails?.paper_type === "IE") {
      setObtainedMarks(Number(ieMarks));
    } else {
      if (
        (objectiveMarks || objectiveMarks === 0) &&
        (subjectiveMarks || subjectiveMarks === 0)
      ) {
        setObtainedMarks(objectiveMarks + subjectiveMarks);
      }
    }
  }, [objectiveMarks, subjectiveMarks, ieMarks]);

  useEffect(() => {
    getTotalMarks();
  }, [objectiveQuestions, subjectiveQuestions]);

  useEffect(() => {
    getObjectiveMarks();
  }, [objectiveAnswers]);

  useEffect(() => {
    getSubjectiveMarks();
  }, [subjectiveAnswers]);

  const updateStatus = () => {
    axios
      .post("/api/student/paper/update_attempt_status", {
        studentId: p_number,
        paperId: exam_id||paperDetails?.paper_id,
        status: "Marked",
        obtainedMarks: obtainedMarks,
      })
      .then((res) => {
        if (res) {
          console.log("status updated successfully", res.data);
          router.push(`/faculty/mark_exam/${exam_id||paperDetails?.paper_id}`);
        }
      })
      .catch((err) => {
        console.log("error in updating status", err.message);
      });
  };

  const getTotalMarks = () => {
    let total = 0;
    if (paperDetails?.paper_type === "IE") {
      total = paperDetails?.ie_questions[0].total_marks;
    } else {
      objectiveQuestions.forEach((question) => {
        total += question.marks;
      });

      subjectiveQuestions.forEach((question) => {
        if (!question.parent_sq_id) {
          total += question.marks;
        }
      });
    }
    setTotalMarks(total);
  };

  const getObjectiveMarks = () => {
    if (!objectiveAnswers) {
      return;
    }
    let marks = objectiveAnswers.reduce((total, answer) => {
      return answer ? total + answer.marksobtained : total;
    }, 0);

    setObjectiveMarks(marks);
  };

  const getSubjectiveMarks = async () => {
    if (!subjectiveAnswers) {
      return;
    }

    let marks = 0;
    for (let answer of subjectiveAnswers) {
      marks += answer.marksobtained;
    }

    setSubjectiveMarks(marks);
  };

  return (
    <div className="flex justify-between items-center my-10">
      <div>
        <h1 className="text-2xl ">
          <span className="font-bold">Marks: </span>
          {obtainedMarks.toFixed(2)} / {totalMarks?.toFixed(2)}
        </h1>
      </div>
      {!isStudent && user?.level > 0 && (
        <div>
          <button
            className="p-2 w-32 bg-blue-900 text-white rounded-lg mr-4"
            onClick={() => {
              if (router.query.action) {
                localStorage.setItem("marksSet", "true"); // Store marksSet value in local storage
                router.reload();
              } else {
                router.push({
                  pathname: router.asPath,
                  query: { action: true },
                });
              }
            }}
          >
            Set Marks
          </button>
          <button
            className="px-6 py-2 bg-blue-900 text-white rounded-lg"
            onClick={() => {
              if (!marksSet && !router.query.action) {
                alert("Please set marks first");
                return;
              }
              localStorage.removeItem("marksSet"); // Remove marksSet value from local storage
              setSaved(true);
              updateStatus();
            }}
          >
            {saved ? <>Saving...</> : <>Save and Proceed</>}
          </button>
        </div>
      )}
      {user?.level < 1 && (
        <button
          onClick={print}
          className="px-6 py-2 bg-blue-900 text-white rounded-lg ml-4"
        >
          Print
        </button>
      )}
    </div>
  );
};

export default MarkPaper;
