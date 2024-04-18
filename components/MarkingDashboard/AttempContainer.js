import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
const AttempContainer = ({ question, isStudent, facultyAnswer }) => {
  const router = useRouter();
  const { p_number } = router.query;
  const session = useSession();
  const [givenmarks, setGivenmarks] = useState(question.marksobtained);
  const [changed, setChanged] = useState(false);
  const [saved, setSaved] = useState(false);
  const markQuestion = async () => {
    await axios
      .post("/api/paper/marking/mark_question", {
        ssa_id: p_number + question.sq_id,
        marksobtained: givenmarks,
      })
      .then((res) => {
        console.log("marked");
      })
      .catch((err) => {
        console.log("error in marking", err.message);
      });
  };
  const setMarks = (e) => {

    if (e.target.value > question.marks) {
      setGivenmarks(question.marks);
      return;
    }
    setGivenmarks(Number(e.target.value));
  };
  useEffect(() => {
    setGivenmarks(question.marksobtained);
  }, [question]);
  console.log("is saved", saved)
  return (

    <div className="flex  pt-0 gap-x-2">

      <div className="grow">
        <div className="text-2xl mb-2">
          <p>{question.questionnumber + ". " + question.question}</p>
        </div>


        {!question.children ? (
          <div className="px-4 py-2 bg-blue-900 rounded-lg space-y-2 flex flex-col">
            <label className="text-white">
              Answer
              {!question.long_question && (
                <span className="text-gray-200 text-sm">
                  {" "}
                  (Max 50 characters)
                </span>
              )}

            </label>

            <textarea
              className="border border-gray-300 bg-gray-300 rounded-md p-2 w-full text-gray-700 "
              value={question.answer || ""}
              disabled
              rows={question.long_question ? 10 : 2}
            />
            <div className="w-full flex justify-end text-white">
              <div>
                <input
                  className="h-6 w-16 mr-3 rounded-md bg-white text-black accent-blue-600 mt-1 ring-0 focus:outline-none p-2 border text-xs border-gray-300 appearance-none"
                  type="number"
                  value={changed ? givenmarks : question.marksobtained}
                  step={0.5}
                  onChange={(e) => {
                    setSaved(false);
                    setChanged(true);
                    setMarks(e);
                  }}
                  max={question.marks}
                  min={0}
                  disabled={isStudent || session?.data?.user?.level < 1}
                />
                <span className="font-bold text-sm mr-2">
                  / <span>{question.marks}</span>
                </span>
                {!isStudent && (
                  <button
                    className="bg-green-800 hover:bg-green-700 text-white py-1 px-2 rounded disabled:bg-gray-400 disabled:cursor-not-allowed"
                    onClick={() => {
                      setSaved(true);
                      markQuestion();
                    }}
                    disabled={isStudent || session?.data?.user?.level < 1}
                  >
                    {!saved ? <>Save Marks</> : <>Marked</>}
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-blue-900 text-white shadow-lg rounded-lg p-4">
            {question.children.map((child) => (
              <AttempContainer
                key={child.sq_id}
                question={child}
                isStudent={isStudent}
              />
            ))}
          </div>
        )}
      </div>
      <div className="mt-10 h-[347px] w-96 px-6 py-2 bg-blue-900 rounded-lg  flex flex-col">
        <label className="text-white mt-0 mb-1">
          Correct Answer


        </label>
        {!facultyAnswer && (
                <span className="text-gray-200 text-sm">
                  {" "}
                  (Max 50 characters)
                </span>
              )}
              <textarea
              className="mt-1 border border-gray-300 bg-white rounded-md p-2 w-90 text-gray-700 "
              value={facultyAnswer || ""}
              disabled
              rows={question.long_question ? 10 : 2}
            />
      </div>
    </div>

  );
};

export default AttempContainer;
