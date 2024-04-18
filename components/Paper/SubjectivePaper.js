import React, { useEffect, useState } from "react";
import Loader from "../Loader";
import NavigationGrid from "./NavigationGrid";
import SQContainer from "./Subjective/SQContainer";
import NewTimer from "./NewTimer";
const seedrandom = require('seedrandom');


export default function SubjectivePaper({
  submitted,
  questions,
  isfreeFlow,
  attemptTime,
  paper,
  startTime,
  objTimeLeft,
  studentId,
}) {
  
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [flags, setFlags] = useState([]);
  const [attempted, setAttempted] = useState([]);  
  const [randomizedQuestions, setRandomizedQuestions] = useState([]);  

  useEffect(() => {
    if (questions && paper) {
      setRandomizedQuestions(shuffleArray(questions));
      const currentPaper = JSON.parse(localStorage.getItem(`paper ${paper}`));
      setFlags(currentPaper ? currentPaper.flags : []);
    }
    const attempted = JSON.parse(localStorage.getItem(`attempted_questions_${paper}`));
    setAttempted(attempted ? attempted : []);
  }, [currentQuestion]);

  const setCurrentAndLocal = (newValue) => {
    setCurrentQuestion(newValue);
  };

  useEffect(() => {
    console.log("submited", submitted);
  }, [submitted]);

  useEffect(() => {
    if (paper) {
      const currentPaper = JSON.parse(localStorage.getItem(`paper ${paper}`));
      console.log(currentPaper);
      setFlags(currentPaper.flags || []);
    }

  }, [questions, paper]);

  const shuffleArray = (array) => {
    const generator = seedrandom(studentId);
    const randomNumber = generator();

    const shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(randomNumber * (i + 0));
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
  return (
    <div className="flex justify-between shadow-lg max-w-5xl font-poppins mt-28 mx-20 xl:mx-auto pt-20 pb-10 px-10 gradient rounded-2xl shadow-3xl shadow-black">
      <div className="w-2/3  rounded-l-2xl">
        <SQContainer
          studentId={studentId}
          question={randomizedQuestions[currentQuestion]}
          index={currentQuestion}
          totalQuestions={questions.length}
          currentQuestion={currentQuestion}
          setCurrentQuestion={setCurrentAndLocal}
          freeFlow={isfreeFlow}
          flags={flags || []}
          setFlags={setFlags}
        />
      </div>
      {currentQuestion !== questions.length && (
        <div className="w-1/3 max-w-xs shadow-lg h-fit border-2 border-zinc-100 bg-white p-8 shadow-black">
          <NewTimer time={attemptTime} startTime={startTime} objTimeLeft={objTimeLeft} />

          <NavigationGrid
            totalQuestions={questions.length}
            currentQuestion={currentQuestion}
            freeFlow={true}
            offset={questions.length}
            setCurrentQuestion={setCurrentAndLocal}
            flags={flags || []}
            setFlags={setFlags}
            attempted={attempted}
          />
        </div>
      )}
    </div>
  );
}
