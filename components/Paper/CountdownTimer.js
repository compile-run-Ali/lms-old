import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";

function CountdownTimer({
  timeAllowed,
  currentQuestion,
  setCurrentQuestion,
  totalQuestions,
  submit,
}) {
  const [timeLeft, setTimeLeft] = useState(timeAllowed);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    setTimeLeft(timeAllowed);
  }, [timeAllowed]);

  useEffect(() => {
    setTimeLeft(timeAllowed);
  }, [currentQuestion]);

  useEffect(() => {
    if (timeLeft === 0) {
      setCurrentQuestion((prevQuestion) => prevQuestion + 1);
      setTimeLeft(timeAllowed);

      if (currentQuestion === totalQuestions - 1) {
        submit();
      }
    }
  }, [timeLeft]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  return (
    <div className="text-white">
      <h1>
        <span className="text-sm">Time Remaining: </span>
        {`${minutes}:${seconds < 10 ? "0" : ""}${seconds}`}
      </h1>
    </div>
  );
}

export default CountdownTimer;
