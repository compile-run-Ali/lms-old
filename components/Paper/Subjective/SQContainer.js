import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import axios from "axios";
import SubmitModal from "../SubmitModal";
import Spinner from "@/components/Loader/Spinner";
import Submitted from "../Submitted";

export default function SQContainer({
  question,
  currentQuestion,
  setCurrentQuestion,
  totalQuestions,
  freeFlow,
  flags,
  setFlags,
  studentId,
  index,
}) {
  const router = useRouter();
  const session = useSession();
  const { paper } = router.query;
  const [answers, setAnswers] = useState({});
  const [saved, setSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [changed, setChanged] = useState(false);
  const [loading, setLoading] = useState({
    show: false,
    message: "",
  });

  const saveAnswer = () => {
    if (!answers) {
      alert("Your answer is empty. Please type anything to continue.");
      return;
    }

    setLoading({ show: true, message: "Saving Answer..." });

    localStorage.setItem(
      `attempted_questions_${paper}`,
      localStorage.getItem(`attempted_questions_${paper}`)
        ? JSON.stringify([
            ...JSON.parse(localStorage.getItem(`attempted_questions_${paper}`)),
            currentQuestion,
          ])
        : JSON.stringify([currentQuestion])
    );

    for (let question_id in answers) {
      axios
        .post(`/api/student/paper/sq/add_answer`, {
          p_number: session?.data?.user?.id,
          sq_id: question_id,
          answer: answers[question_id],
        })
        .then((res) => {
          setSaved(true);
          setLoading({ show: false, message: "" });
          console.log("answer added successfully ", res.data);
        })
        .catch((err) => {
          console.log("error ", err.message);
          setLoading({
            error: "Error in Saving Answer.",
          });
        });
    }
  };

  const flagQuestion = (current) => {
    let f = flags;
    f.includes(current)
      ? (f = f.filter((flags) => flags !== current))
      : (f = [...flags, current]);
    setFlags(f);
    const papers = JSON.parse(localStorage.getItem(`paper ${paper}`));
    papers.flags = f;
    localStorage.setItem(`paper ${paper}`, JSON.stringify(papers));
  };

  function integerToAlphabet(num) {
    let alphabet = "abcdefghijklmnopqrstuvwxyz";
    let result = "";

    // check if num is within the range of the alphabet
    if (num <= 0 || num > 26) {
      return "Invalid input";
    }

    // convert the integer to its respective alphabet
    result = alphabet.charAt(num - 1);

    return result;
  }

  useEffect(() => {
    if (question) {
      // fetch SPA and if status is submitted then redirect to '/'
      axios
        .get("/api/student/paper/get_single_attempt", {
          params: {
            p_number: studentId,
            paper_id: paper,
          },
        })
        .then((res) => {
          const isSubmitted = res.data?.status === "Submitted";
          if (isSubmitted) {
            router.push("/student");
          }
        })
        .catch((err) => {
          console.log("error is", err);
        });

      const hasChild = question.child_question.length > 0;
      setAnswers("");
      setChanged(false);
      let questionIdToBeFetched;
      if (!hasChild) {
        questionIdToBeFetched = [question.sq_id];
      } else {
        questionIdToBeFetched =
          question.child_question.map((child) => child.sq_id) || [];
      }

      setLoading({
        message: "Loading Answer...",
      });
      axios
        .get("/api/student/paper/sq/get_answer", {
          params: {
            p_number: session?.data?.user?.id,
            sq_ids: questionIdToBeFetched.join(","),
          },
        })
        .then((res) => {
          setLoading({});
          if (hasChild) {
            const answers = {};
            res.data.forEach((answer) => {
              answers[answer.sq_id] = answer.answer;
            });
            setAnswers(answers);
          } else {
            setAnswers({
              [question.sq_id]: res.data[0]?.answer || "",
            });
          }
        })
        .catch((err) => {
          console.log(err);
          setLoading({
            error: "Error in Loading Answer.",
          });
        });
    }
  }, [question]);

  useEffect(
    () => () => {
      if (changed) setSaved(false);
      else setSaved(true);
    },
    [answers]
  );
console.log(question,index,"aaa")
  return (
    <div className="flex flex-col justify-between p-10 pt-0 max-w-4xl text-white">
      <Spinner loading={loading} />
      {question ? (
        <>
          <div>
            <div className="text-2xl mb-4">
              <div className="flex justify-between items-center">
                <p>{(index+1) + ". " + question.question}</p>
                <p className="text-base font-bold">({question.marks} Marks)</p>
              </div>
            </div>
            <div className="py-4 rounded-lg space-y-2 ">
              {question.child_question && question.child_question.length > 0 ? (
                question.child_question
                  .sort((a, b) => a.questionnumber - b.questionnumber)
                  .map((childQuestion, index) => (
                    <div key={childQuestion.sq_id}>
                      <div className="text-xl">
                        <div className="flex justify-between items-center ">
                          <p>
                            {integerToAlphabet(childQuestion.questionnumber) +
                              ". " +
                              childQuestion.question}
                          </p>
                          <p className="text-base">
                            ({childQuestion.marks} Marks)
                          </p>
                        </div>
                      </div>
                      <div className="pb-4 rounded-lg space-y-2">
                        <label className="">
                          Answer
                          {!childQuestion.long_question && (
                            <span className="text-gray-200 text-sm">
                              {" "}
                              (Max 50 characters)
                            </span>
                          )}
                        </label>
                        <textarea
                          className="border bg-white rounded-md p-2 w-full text-black border-black focus:outline-yellow-500"
                          maxLength={childQuestion.long_question ? 100000 : 50}
                          value={answers[childQuestion.sq_id]}
                          rows={childQuestion.long_question ? 10 : 2}
                          onChange={(e) => {
                            setChanged(true);
                            setAnswers({
                              ...answers,
                              [childQuestion.sq_id]: e.target.value,
                            });
                          }}
                        />
                      </div>
                    </div>
                  ))
              ) : (
                <div className="pb-4 rounded-lg space-y-2">
                  <label className="">
                    Answer
                    {!question.long_question && (
                      <span className="text-gray-200 text-sm">
                        (Max 50 characters)
                      </span>
                    )}
                  </label>
                  <textarea
                    className="border bg-white rounded-md p-2 w-full text-black border-black focus:outline-yellow-500"
                    maxLength={question.long_question ? 100000 : 50}
                    value={answers[question.sq_id]}
                    rows={question.long_question ? 10 : 2}
                    onChange={(e) => {
                      setChanged(true);
                      setAnswers({
                        [question.sq_id]: e.target.value,
                      });
                    }}
                  />
                </div>
              )}
            </div>
          </div>
          <div className="flex justify-between mt-20 text-black">
            {(freeFlow || question.questionnumber !== 1) && (
              <button
                className={
                  (currentQuestion > 0
                    ? "bg-white hover:bg-zinc-300"
                    : "bg-gray-400 cursor-not-allowed") +
                  " px-3 py-2 w-24 rounded-lg shadow-md shadow-black duration-500"
                }
                onClick={() => {
                  if (!answers || saved) {
                    currentQuestion > 0 &&
                      setCurrentQuestion(currentQuestion - 1);
                  } else {
                    alert("Please save your answer before proceeding.");
                  }
                }}
              >
                Previous
              </button>
            )}
            <button
              className={` px-3 py-2 w-24 rounded-lg shadow-md shadow-black duration-500
                ${
                  flags.includes(String(currentQuestion))
                    ? "bg-yellow-400 hover:bg-yellow-500"
                    : "bg-white hover:bg-zinc-300"
                }`}
              onClick={() => flagQuestion(String(currentQuestion))}
            >
              {flags.includes(String(currentQuestion)) ? "Remove" : "Review"}
            </button>
            <button
              className={` px-3 py-2 w-24 rounded-lg shadow-md shadow-black duration-500
                ${saved ? "bg-green-500" : "bg-white hover:bg-zinc-300"}`}
              onClick={saveAnswer}
            >
              {saved ? "Saved" : "Save"}
            </button>
            {currentQuestion < totalQuestions - 1 ? (
              <button
                className="bg-white hover:bg-zinc-300 px-3 py-2 w-24 rounded-lg shadow-md shadow-black duration-500"
                onClick={() => {
                  // if opt not selected OR saved
                  if (!answers || saved) {
                    currentQuestion < totalQuestions &&
                      setCurrentQuestion(currentQuestion + 1);
                  } else {
                    alert("Please save your answer before proceeding");
                  }
                }}
              >
                Next
              </button>
            ) : (
              <button
                className="bg-green-500 hover:bg-green-600 px-3 py-2 w-24 rounded-lg shadow-md shadow-black duration-500"
                onClick={() => {
                  // open modal
                  setShowModal(true);
                }}
              >
                Submit
              </button>
            )}
          </div>
          <SubmitModal
            flags={flags}
            showModal={showModal}
            setShowModal={setShowModal}
            currentQuestion={currentQuestion}
            setCurrentQuestion={setCurrentQuestion}
            paper={paper}
          />
        </>
      ) : (
        <div className="flex justify-center max-w-4xl">
          <Submitted />
        </div>
      )}
    </div>
  );
}
