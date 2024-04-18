import React, { useState } from "react";

export default function ObjectiveQuestion({ question, qNumber }) {
  const correctArray = question.correct_answer.split(",");
  const answerArray = question.answers.split(",");
  const multipleAllowed = correctArray.length > 1;
  const correctAnswers = question.correct_answer?.split(",") || [];
  const specialSequence="###"
  return (
    <div className="mx-auto my-10 bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-8">
        <p className="text-lg font-medium text-gray-800">
          {qNumber + ". " + question.question}
        </p>
        <div className="mt-6 space-y-4">
          {answerArray.map((answer, index) => {
            const isSelected = question?.selected_answers
              ?.split(",")
              .includes(answer);
            return (
              <div key={index} className="flex items-center">
                <div
                  className={`relative flex items-center justify-center w-6 h-6 mr-4 border ${
                    isSelected ? "border-blue-500" : "border-gray-300"
                  } rounded-full`}
                >
                  <input
                    type={multipleAllowed ? "checkbox" : "radio"}
                    className="sr-only"
                    defaultChecked={isSelected}
                  />
                  <span
                    className={`absolute w-3 h-3 rounded-full ${
                      isSelected ? "bg-blue-500" : ""
                    }`}
                  ></span>
                </div>
                <p
                  className={`text-base text-gray-700 
                  ${correctAnswers.includes(answer) && "font-bold"}
                `}
                >
                  {answer.replace(specialSequence,",")}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      <div className="bg-blue-900 px-4 py-3">
        <div className="flex justify-between items-center text-sm text-white">
          <p>
            Correct Answer:{" "}
            <span className="font-medium">{question.correct_answer.replace(specialSequence,",")}</span>
          </p>
          <p>
            Marks:{" "}
            <span className="font-medium">
              {question.marksobtained?.toFixed(2) || "0.00"} out of{" "}
              {question.marks.toFixed(2)}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
