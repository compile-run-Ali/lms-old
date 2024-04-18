import React, { useEffect, useState } from "react";
import { MdEdit } from "react-icons/md";

const SubjectiveTable = ({ subjective_questions = [] }) => {
  const [subjectives, setSubjectives] = useState([]);

  useEffect(() => {
    setSubjectives(subjective_questions);
  }, [subjective_questions]);

  if (subjectives && subjectives.length === 0) {
    return (
      <div className="text-center text-red-600 font-bold text-xl">
        No Questions Added
      </div>
    );
  }
  console.log("subjective_questions", subjective_questions);

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

  return (
    <div className="w-full font-poppins mt-10 rounded-lg">
      <table className="table-auto w-full bg-white rounded-lg">
        <thead>
          <tr className="text-blue-800">
            <th className=" px-4 py-2">Q</th>
            <th className=" px-4 py-2">Part</th>
            <th className=" px-4 py-2">Question</th>
            <th className=" px-4 py-2">Parent Question</th>
            <th className=" px-4 py-2">Marks</th>
          </tr>
        </thead>
        <tbody>
          {subjectives
            ?.sort((a, b) => a.questionnumber - b.questionnumber)
            .map((question, index) => (
              <React.Fragment key={question.sq_id}>
                <tr key={index} className="text-center">
                  <td className=" px-4 py-2">{index+1}</td>
                  <th className=" px-4 py-2"></th>
                  <td className=" px-4 py-2">{question.question}</td>
                  <td className=" px-4 py-2">
                    {question.parent_question?.question}
                  </td>
                  <td className=" px-4 py-2">{question.marks}</td>
                </tr>
                {question.child_question
                  ?.sort((a, b) => a.questionnumber - b.questionnumber)
                  .map((child, index) => (
                    <tr key={child.sq_id} className="text-center">
                      <th className=" px-4 py-2"></th>
                      <td className=" px-4 py-2">
                        {integerToAlphabet(child.questionnumber)}
                      </td>
                      <td className=" px-4 py-2">{child.question}</td>
                      <td className=" px-4 py-2">{question.question}</td>
                      <td className=" px-4 py-2">{child.marks}</td>
                    </tr>
                  ))}
              </React.Fragment>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default SubjectiveTable;
