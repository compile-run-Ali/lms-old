import BaseLayout from "@/components/BaseLayout/BaseLayout";
import DashboardLayout from "@/components/DasboardLayout/DashboardLayout";
import AnswersTable from "@/components/MarkingDashboard/AnswersTable";
import PaperDetails from "@/components/Review/PaperDetails";
import axios from "axios";
import ObjectiveReview from "@/components/Review/ObjectiveReview";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import MarkPaper from "@/components/MarkingDashboard/MarkPaper";
import Loader from "@/components/Loader";
import CommentBox from "@/components/Review/CommentBox";
import IEContainer from "@/components/Paper/IE/IEContainer";

const Index = () => {
  const router = useRouter();
  const [subjectiveQuestions, setSubjectiveQuestions] = useState([]);
  const [subjectiveAnswers, setSubjectiveAnswers] = useState([]);
  const [paperDetails, setPaperDetails] = useState({});
  const [objectiveQuestions, setObjectiveQuestions] = useState([]);
  const [objectiveAnswers, setObjectiveAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bottom, setBottom] = useState(false);
  const [IeFiles, setIeFiles] = useState(null);
  const [ieMarks, setIeMarks] = useState(0);

  const { exam_id, p_number } = router.query;

  useEffect(() => {
    if (paperDetails) {
      async function fetchIE() {
        if (paperDetails?.paper_type === "IE") {
          try {
            const res = await axios.get(`/api/faculty/get_ie_files`, {
              params: {
                paperId: paperDetails?.paper_id,
              },
            });
            setIeFiles(res.data);
          } catch (err) {
            console.log(err);
          }
        }
      }
      fetchIE();
    }
  }, [paperDetails]);
  console.log(objectiveAnswers, "objans");

  useEffect(() => {
    setTimeout(() => {
      if (router.isReady) {
        if (router.query.action) {
          console.log("scrolling to bottom", router.query.action);
          setBottom(true);
        }
      }
    }, 500); // wait 500ms before executing the function
  }, [router]);
  useEffect(() => {
    if (bottom) {
      scrollToBottom();
    }
  }, [bottom]);
  const scrollToBottom = () => {
    const height = document.documentElement.scrollHeight; // use documentElement instead of body
    window.scrollBy({
      top: height,
      behavior: "smooth",
    });
  };

  const fetchObjectiveAttempts = async () => {
    if (!objectiveQuestions) return;
    let questions = objectiveQuestions.map((question) => question.oq_id);
    try {
      setLoading(true);
      const res = await axios.post(`/api/student/paper/oq/get_questions`, {
        p_number: p_number,
        questions: questions,
      });
      console.log(res, "impt");
      setObjectiveAnswers(res.data);
      setLoading(false);
    } catch (err) {
      alert("Something went wrong!");
      router.push(`/faculty/mark_exam/${exam_id}`);
    }
  };

  const fetchSubjectiveAttempts = async () => {
    if (!subjectiveQuestions) return;
    let question = subjectiveQuestions.map((question) => question.sq_id);
    try {
      setLoading(true);
      const res = await axios.post("/api/paper/marking/get_student_attempts", {
        question: question,
        p_number: p_number,
      });
      console.log("subjective attempts fetched successfully", res.data);

      setSubjectiveAnswers(res.data);
      setLoading(false);
    } catch (err) {
      alert("Something went wrong!");
      router.push(`/faculty/mark_exam/${exam_id}`);
    }
  };

  const fetchPaperDetails = async () => {
    await axios
      .get("/api/paper/get_paper", {
        params: {
          paper_id: exam_id,
        },
      })
      .then((res) => {
        console.log("paper details fetched successfully");

        setPaperDetails(res.data);
        setObjectiveQuestions(res.data.objective_questions);
        if (paperDetails?.paper_type !== "Objective") {
          setSubjectiveQuestions(res.data.subjective_questions);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log("error in fetching paper details", err.message);
      });
  };
  console.log(paperDetails, "paper details");
  useEffect(() => {
    if (exam_id && p_number) {
      setLoading(true);
      fetchPaperDetails();
    }
    setLoading(false);
  }, [exam_id, p_number, router]);

  useEffect(() => {
    if (objectiveQuestions.length !== 0) {
      fetchObjectiveAttempts();
    }
    if (subjectiveQuestions.length !== 0) fetchSubjectiveAttempts();
  }, [objectiveQuestions, subjectiveQuestions]);
  console.log("Subj",subjectiveQuestions)
  return (
    <div>
      <BaseLayout title={"Mark Exam"}>
        <DashboardLayout>
          {loading ? (
            <Loader />
          ) : (
            <div className="px-20">
              <PaperDetails
                paper={paperDetails}
                isFaculty={true}
                studentId={p_number}
              />
              <ObjectiveReview
                questions={objectiveQuestions}
                answers={objectiveAnswers}
              />
              {paperDetails?.paper_type !== "Objective" && (
                <AnswersTable
                  questions={subjectiveQuestions}
                  answers={subjectiveAnswers}
                  
                />
              )}
              {paperDetails?.paper_type === "IE" && (
                <IEContainer
                  IeFiles={IeFiles}
                  faculty={true}
                  paperId={paperDetails.paper_id}
                  studentId={p_number}
                  setIeMarks={setIeMarks}
                />
              )}

              <CommentBox student={p_number} paper={exam_id} />
              <MarkPaper
                objectiveAnswers={objectiveAnswers}
                subjectiveAnswers={subjectiveAnswers}
                objectiveQuestions={objectiveQuestions}
                subjectiveQuestions={subjectiveQuestions}
                paperDetails={paperDetails}
                ieMarks={ieMarks}
              />
            </div>
          )}
        </DashboardLayout>
      </BaseLayout>
    </div>
  );
};

export default Index;
