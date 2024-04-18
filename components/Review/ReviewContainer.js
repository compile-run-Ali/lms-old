import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import ObjectiveReview from "./ObjectiveReview";
import PaperDetails from "./PaperDetails";
import { useSession } from "next-auth/react";
import AnswersTable from "../MarkingDashboard/AnswersTable";
import MarkPaper from "../MarkingDashboard/MarkPaper";
import Loader from "../Loader";
import CommentBox from "./CommentBox";

export default function ReviewContainer() {
  const router = useRouter();
  const { paper } = router.query;
  const { data: session, status } = useSession();
  const [student, setStudent] = useState(null);
  const [objectiveAnswers, setObjectiveAnswers] = useState([]);
  const [subjectiveAnswers, setSubjectiveAnswers] = useState([]);
  const [objectiveQuestions, setObjectiveQuestions] = useState([]);
  const [subjectiveQuestions, setSubjectiveQuestions] = useState([]);
  const [paperDetails, setPaperDetails] = useState({});
  const [loading, setLoading] = useState(true);
 console.log(objectiveAnswers)
  useEffect(() => {
    if (status === "authenticated") {
      setStudent(session.user.id);
    }
  }, [session]);

  const fetchObjectiveAttempts = async () => {
    let questions = objectiveQuestions.map((question) => question.oq_id);
    const res = await axios.post(`/api/student/paper/oq/get_questions`, {
      p_number: session.user.id,
      questions: questions,
    });

    console.log("objective attempts fetched successfully", res.data);

    setObjectiveAnswers(res.data);
  };

  const fetchSubjectiveAttempts = async () => {
    let question = subjectiveQuestions.map((question) => question.sq_id);
    const res = await axios.post("/api/paper/marking/get_student_attempts", {
      question: question,
      p_number: student,
    });
    
    setSubjectiveAnswers(res.data);
  };

  const fetchPaperDetails = async () => {
    await axios
      .get("/api/paper/get_paper", {
        params: {
          paper_id: paper,
        },
      })
      .then((res) => {
        console.log("paper details fetched successfully");

        setPaperDetails(res.data);
        //sort objective questions
        res.data.objective_questions.sort((a, b) => {
          return a.oq_id - b.oq_id;
        });
        setObjectiveQuestions(res.data.objective_questions);
        if (paperDetails.paper_type !== "Objective") {
          //sort subjective questions
          res.data.subjective_questions.sort((a, b) => {
            return a.sq_id - b.sq_id;
          });
          setSubjectiveQuestions(res.data.subjective_questions);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("error in fetching paper details", err.message);
      });
  };

  useEffect(() => {
    if (paper && student) {
      fetchPaperDetails();
    }
  }, [paper, student]);
  console.log(paperDetails)
  useEffect(() => {
    if (session?.user?.id && paperDetails?.paper_id) {
      fetchObjectiveAttempts();
      fetchSubjectiveAttempts();
    }
  }, [objectiveQuestions, subjectiveQuestions]);

  if (loading) return <Loader />;
  return (
    <div className="w-full mx-auto max-w-5xl font-poppins">
      <h1 className="font-bold text-3xl mt-10 mb-4">Paper Review</h1>
      <PaperDetails paper={paperDetails} />
      <ObjectiveReview
        questions={objectiveQuestions}
        answers={objectiveAnswers}
      />

      {paperDetails.paper_type !== "Objective" && (
        <AnswersTable
          questions={subjectiveQuestions}
          answers={subjectiveAnswers}
          isStudent={true}
        />
      )}

      <CommentBox paper={paper} student={student} isStudent={true} />
      
      <MarkPaper
        objectiveAnswers={objectiveAnswers}
        paperDetails={paperDetails}
        subjectiveAnswers={subjectiveAnswers}
        objectiveQuestions={objectiveQuestions}
        subjectiveQuestions={subjectiveQuestions}
        isStudent={true}
      />
    </div>
  );
}
