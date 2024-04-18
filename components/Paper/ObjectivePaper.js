import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

import OQContainer from "./Objective/OQContainer";
import Loader from "../Loader";
import NavigationGrid from "./NavigationGrid";
import NewTimer from "./NewTimer";
const seedrandom = require('seedrandom');

export default function ObjectivePaper({
  questions,
  isfreeFlow,
  setSolveObjective,
  paper,
  lang,
  attemptTime,
  objTimeLeft,
  startTime,
  submit,
  studentId,
  setScore,
  score
}) {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [flags, setFlags] = useState([]);
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);
  const [attempted, setAttempted] = useState([])

  useEffect(() => {
    const attempted = JSON.parse(localStorage.getItem(`attempted_questions_${paper}`));
    setAttempted(attempted ? attempted : [])
  }, [currentQuestion])


  useEffect(() => {
    if (questions && paper) {
      console.log(lang)
      setRandomizedQuestions(shuffleArray(questions));
      const currentPaper = JSON.parse(localStorage.getItem(`paper ${paper}`));
      setFlags(currentPaper ? currentPaper.flags : []);
    }
  }, [questions, paper]);

  const setCurrentAndLocal = (newValue) => {
    setCurrentQuestion(newValue);
  };

  const shuffleArray = (array) => {
    const generator = seedrandom(studentId);
    const randomNumber = generator();

    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(randomNumber * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [
        shuffledArray[j],
        shuffledArray[i],
      ];
    }
    return shuffledArray;
  };

  if (!questions) {
    return <Loader />;
  }
  console.log(lang,"lag")
  return (
    <div className="flex justify-between shadow-lg max-w-5xl font-poppins mt-28 mx-20 xl:mx-auto pt-20 pb-10 px-10 gradient rounded-2xl shadow-3xl shadow-black">
      <div className={`w-2/3  rounded-l-2xl ${lang==="urdu"?"order-2":""} `}>
        <OQContainer
          studentId={studentId}
          submit={submit}
          paper={paper}
          question={randomizedQuestions[currentQuestion]}
          totalQuestions={questions.length}
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentAndLocal}
          freeFlow={isfreeFlow}
          flags={flags || []}
          setFlags={setFlags}
          setSolveObjective={setSolveObjective}
          setScore = {setScore}
          oldScore={score}
          lang={lang}
        />
      </div>
      <div className=" w-1/3 max-w-xs shadow-lg h-fit border-2 bg-zinc-100 p-8 shadow-black">
        <NewTimer time={attemptTime} startTime={startTime} objTimeLeft={objTimeLeft} />
        {isfreeFlow && (
          <NavigationGrid
            totalQuestions={questions.length}
            currentQuestion={isfreeFlow && currentQuestion}
            freeFlow={isfreeFlow}
            offset={questions.length}
            setCurrentQuestion={setCurrentAndLocal}
            flags={flags || []}
            setFlags={setFlags}
            attempted={attempted}
          />
        )}
      </div>
    </div>
  );
}
