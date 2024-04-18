import React from "react";
import ObjectiveQuestion from "./ObjectiveQuestion";

export default function ObjectiveReview({ questions, answers }) {

  const questionWithAnswers = (questions, answers) =>
    questions.map((question) => {
      const answer = answers.find((answer) => answer.oq_id === question.oq_id);

      return {
        ...question,
        selected_answers: answer ? answer.answer : null,
        marksobtained: answer ? answer.marksobtained : null,
      };
    });

  return (
    <div className="w-full ">
      {questionWithAnswers(questions, answers).map((question, index) => (
        <ObjectiveQuestion
          key={question.oq_id}
          qNumber={index + 1}
          question={question}
        />
      ))}
    </div>
  );
}
