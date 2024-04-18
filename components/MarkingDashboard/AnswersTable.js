import React, { useState, useEffect } from "react";
import AttempContainer from "./AttempContainer";

const AnswersTable = ({
  questions,
  answers,
  isStudent,
}) => {
  const questionWithAnswers = (questions, answers) =>
    questions.map((question) => {
      const answer = answers.find((answer) => answer?.sq_id === question.sq_id);

      return {
        ...question,
        answer: answer ? answer.answer : null,
        marksobtained: answer ? answer.marksobtained : 0,
      };
    });

  const questionsWithChild = () => {
    let allQuestions = questionWithAnswers(questions, answers);
    allQuestions.sort((a, b) => a.questionnumber - b.questionnumber);
    let subjectiveWithChild = [];
    allQuestions.forEach((question) => {
      if (question.parent_sq_id) {
        const parent = allQuestions.find(
          (q) => q.sq_id === question.parent_sq_id
        );
        let children = [];
        if (parent) {
          children = parent.children || [];
          children.push(question);
          children.sort((a, b) => a.questionnumber - b.questionnumber);
          parent.children = children;
        }
      } else {
        subjectiveWithChild.push(question);
      }
    });

    return subjectiveWithChild;
  };
  console.log(questions,"quest in ans table")
  return (
    <div className="flex flex-col space-y-10">
      {questionsWithChild().map((question, index) => (
        <AttempContainer
          key={question.sq_id}
          question={question}
          isStudent={isStudent}
          // in faculty answer we will send questions[index].answer where sq_id=questions[index].sq_id only
          facultyAnswer={questions.find((q) => q.sq_id === question.sq_id)?.answer}
        />
      ))}
    </div>
  );
};

export default AnswersTable;
