import { useState } from "react";
import UploadInstructions from "./UploadInstructions";
import axios from "axios";
import Spinner from "../Loader/Spinner";
import { saveAs } from "file-saver";
import { FaFileUpload, FaFileDownload } from "react-icons/fa";
import { useRouter } from "next/router";

function WordExam({
  paperId,
  setExam,
  setActive,
  objectiveQuestions = [],
  setObjectiveQuestions,
  freeFlow
}) {
  const [questions, setQuestions] = useState(objectiveQuestions);
  const [loading, setLoading] = useState({});

  const router = useRouter();

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const contents = event.target.result;
      const questions = convertToQuestions(contents);
      if (questions.length === 0) {
        alert("No questions found in the file.");
        return;
      }
      setQuestions(questions);
    };
    if (file) {
      reader.readAsText(file);
    }
  };
  const handleDelete = () => {
    setQuestions([]);
  }

  const editExam = () => {
    console.log("pushing back");
    router.push({
      pathname: `/faculty/create_exam/word`,
      query: {
        paper_id: paperId,
        is_edit: true,
      },
    });
  };

  const saveQuestions = () => {
    setLoading({ message: "Saving questions..." });
    axios
      .post("/api/faculty/paper_creation/add_word_questions", {
        paperId,
        questions,
      })
      .then((res) => {
        console.log(res.data);
        setObjectiveQuestions(res.data);
        setActive(3);
        setLoading({});
        setExam((prev) => ({
          ...prev,
          total_marks: questions.length,
          objective_marks: questions.length,
        }));
      })
      .catch((err) => {
        setLoading({
          error: "An error occured while uploading the questions.",
        });
        console.log("error in add_word_questions", err);
      });
  };

  const downloadDoc = () => {
    saveAs("/word/Sample Questions.docx", "Sample Questions.docx");
  };

  return (
    <div className="font-poppins">
      {<Spinner loading={loading} />}
      <UploadInstructions />

      <div className="flex justify-between flex-row-reverse">
        <div className="flex space-x-10">
          <button
            type="button"
            className="border-2 border-[#FEC703] hover:bg-[#FEAF03] hover:text-white font-medium text-primary-black rounded-lg py-3 px-8"
            onClick={() => {
              setActive(1);
              editExam();
            }}
          >
            Back
          </button>
          <button onClick={handleDelete} className="border-2 border-red-600 hover:bg-red-600 hover:text-white font-medium text-primary-black rounded-lg py-3 px-8">
            Clear
          </button>
          <label
            htmlFor="file-upload"
            className="cursor-pointer inline-flex items-center px-6 py-2.5 bg-green-600 border border-transparent rounded-md font-semibold text-white 
          hover:bg-green-700 focus:outline-none focus:border-green-700 focus:ring-green-300"
          >
            Upload File
            <FaFileUpload className="ml-2 inline" />
          </label>
          <input
            key={Date.now()} // Add a unique key to trigger re-render when selecting a new file
            id="file-upload"
            type="file"
            onChange={handleFileUpload}
            className="sr-only"
          />

          <button
            className="cursor-pointer flex items-center px-6 py-2.5 bg-blue-800 border border-transparent rounded-md font-semibold text-white hover:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring-blue-300"
            onClick={downloadDoc}
          >
            Download File
            <FaFileDownload className="ml-2 inline" />
          </button>
        </div>
        {questions.length < 1 && (
          <div>
            <p className="text-lg mt-4">
              Please upload a file to preview the questions.
            </p>
          </div>
        )}
      </div>

      {questions.length > 0 && (
        <>
          <div className="text-3xl mt-10 font-bold">Uploaded Questions</div>
          <table className="w-full mt-4 text-left table-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">SR#</th>
                <th className="border px-4 py-2">Question</th>
                <th className="border px-4 py-2">Options</th>
                <th className="border px-4 py-2">Correct Option</th>
                <th className="border px-4 py-2">Marks</th>
                
                {freeFlow ? null :
                <th className="border px-4 py-2">Time Allowed</th>
                }
              </tr>
            </thead>
            <tbody>
              {questions.map((mcq, index) => (
                <tr key={index} className="border-t">
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{mcq.question}</td>
                  <td className="border px-4 py-2">
                    <ol className="list-[lower-alpha] list-inside">
                      {mcq.answers?.split(",").map((option, index) => (
                        <li key={index}>{option}</li>
                      ))}
                    </ol>
                  </td>
                  <td className="border px-4 py-2">{mcq.correct_answer}</td>
                  <td className="border px-4 py-2">{mcq.marks}</td>
                  {freeFlow ? null :
                  <td className="border px-4 py-2">{mcq.timeAllowed}</td>
                  }
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {questions.length > 0 && (
        <div className="mt-20">
          <div className="py-3 px-6 bg-slate-200 rounded-xl text-lg ">
            <span className="font-bold mr-2">Note:</span>
            Please review your questions before saving. If there are any errors,
            please double check the format of your questions in the uploaded
            file.
          </div>
          <div className="flex justify-end space-x-10 mt-6">
            <button
              className="inline-flex items-center px-8 py-3 bg-blue-800 border border-transparent rounded-lg font-semibold text-white hover:bg-blue-900 focus:outline-none focus:border-blue-900 focus:ring-blue-300"
              onClick={() => {
                saveQuestions();
              }}
            >
              Save and Proceed
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function convertToQuestions(contents) {
  const lines = contents.split(/\r?\n/);
  const questions = [];

  for (let i = 0; i < lines.length; i += 8) {
    // for (let j = 0; j < 20; j++)
    // console.log("i: ", j, " line:", lines[j]);

    const question = {};
    question.question = lines[i].split(". ")[1];
    if (!question.question) {
      break;
    }

    let answerString = "";
    for (let j = i + 1; j <= i + 4; j++) {
      const answers = lines[j]?.split(". ").slice(1).join(", ");
      if (answers) {
        answerString += answers + ",";
      }
    }
    question.answers = answerString;
    question.answers = question.answers?.slice(0, -1);

    const correctLetter = lines[i + 5]?.split(": ")[1]?.trim();
    let correctAnswer;
    switch (correctLetter) {
      case "a":
      case "A":
        correctAnswer = question.answers.split(",")[0];
        break;
      case "b":
      case "B":
        correctAnswer = question.answers.split(",")[1];
        break;

      case "c":
      case "C":
        correctAnswer = question.answers.split(",")[2];
        break;
      case "D":
      case "d":
        correctAnswer = question.answers.split(",")[3];
        break;
      default:
        correctAnswer = "Not Found";
        break;
    }

    question.correct_answer = correctAnswer;

    question.marks = 1;
    question.timeAllowed = lines[i + 6]?.match(/\d+/)
      ? parseInt(lines[i + 6].match(/\d+/)[0])
      : undefined;
    questions.push(question);
  }

  return questions;
}

export default WordExam;
