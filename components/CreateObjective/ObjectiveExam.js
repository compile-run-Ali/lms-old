import axios from "axios";
import React, { useEffect, useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { ImCross } from "react-icons/im";

import Input from "../Common/Form/Input";
import MultiSelectDropdown from "./MultiSelect";
import { useRouter } from "next/router";
import Spinner from "../Loader/Spinner";

const MCQTable = ({
  exam,
  setExam,
  paperId,
  setActive,
  objective_questions,
  setObjectiveQuestions,
  freeFlow,
}) => {
  const [loading, setLoading] = useState({});
  const [multipleOptions, setMultipleOptions] = useState(false);
  const [index, setIndex] = useState(null);
  const [mcqs, setMCQs] = useState(
    objective_questions.map((mcq) => {
      mcq.options = mcq.answers.split(",");
      return mcq;
    })
  );
  const [currentMCQ, setCurrentMCQ] = useState({
    question: "",
    options: ["", "", "", ""],
    correct_answer: "",
    marks: 1,
    timeAllowed: 60,
  });
  const specialSequence="###"

  useEffect(() => {
    if (mcqs.length === 0) {
      setMCQs(
        objective_questions.map((mcq) => {
          mcq.options = mcq.answers.split(",");
          return mcq;
        })
      );
    }
  }, [objective_questions]);
  console.log(mcqs)
  useEffect(() => {
    if (
      currentMCQ.correct_answer &&
      currentMCQ.correct_answer.split(",").length > 1
    ) {
      const hasMultiple = currentMCQ.correct_answer.split(",").length > 1;
      setMultipleOptions(true);
    }
  }, [currentMCQ]);

  const router = useRouter();

  const editExam = () => {
    router.push({
      pathname: `/faculty/create_exam/${
        exam.paper_type === "Objective" ? "objective" : "subjective"
      }`,
      query: {
        paper_id: exam.paper_id,
        is_edit: true,
      },
    });
  };

  const [editing, setEditing] = useState(false);
  const [adding, setAdding] = useState(false);
  console.log(editing, "editing");
  const handleMultipleOptionsChange = (e) => {
    setMultipleOptions(e.target.checked);
  };

  const handleQuestionChange = (e) => {
    setCurrentMCQ({ ...currentMCQ, question: e.target.value });
  };

  const handleOptionChange = (index) => (e) => {
    const newOptions = [...currentMCQ.options];
    newOptions[index] = e.target.value.replace(/,/g, specialSequence);
    //if edited mcq is correct anser, then we need to update correct answer
    if (currentMCQ.correct_answer === currentMCQ.options[index]) {
      setCurrentMCQ({
        ...currentMCQ,
        options: newOptions,
        correct_answer: e.target.value.replace(/,/g, specialSequence),
      });
    }
    else {
      setCurrentMCQ({
        ...currentMCQ,
        options: newOptions,
      });
    }
  };

  const handleCorrectOptionChange = (e) => {
    setCurrentMCQ({ ...currentMCQ, correct_answer: e.target.value });
  };

  const handleMarksChange = (e) => {
    setCurrentMCQ({ ...currentMCQ, marks: parseInt(e.target.value) });
  };

  const handleOptionAddition = () => {
    setCurrentMCQ({ ...currentMCQ, options: [...currentMCQ.options, ""] });
  };

  const handleOptionDeletion = (index) => () => {
    const newOptions = [...currentMCQ.options];
    newOptions.splice(index, 1);
    setCurrentMCQ({ ...currentMCQ, options: newOptions });
  };

  const handleTimeAllowedChange = (e) => {
    setCurrentMCQ({ ...currentMCQ, timeAllowed: parseInt(e.target.value) });
  };
  const handleAddMCQ = async () => {
    if (
      currentMCQ.question === "" ||
      currentMCQ.options.includes("") ||
      currentMCQ.correct_answer === "" ||
      currentMCQ.marks === "" ||
      (!freeFlow && !currentMCQ.timeAllowed)
    ) {
      alert("Please fill all the fields");
      return;
    }

    if (currentMCQ.options.length !== new Set(currentMCQ.options).size) {
      alert("Please remove duplicate options, and reselect correct option.");
      return;
    }

    setLoading({
      message: "Adding Question",
    });

    try {
      const newMCQ = await axios.post(
        "/api/faculty/paper_creation/add_objective",
        {
          paper_id: paperId,
          question: currentMCQ.question,
          answers: currentMCQ.options.toString(),
          correct_answer: currentMCQ.correct_answer,
          marks: currentMCQ.marks,
          timeAllowed: currentMCQ.timeAllowed || 60,
        }
      );
      setLoading({
        show: false,
        message: "",
      });
      newMCQ.data.options = newMCQ.data.answers.split(",");
      setMultipleOptions(false);
      setMCQs([...mcqs, newMCQ.data]);
      setObjectiveQuestions([...mcqs, newMCQ.data]);
      setCurrentMCQ({
        question: "",
        options: ["", "", "", ""],
        correct_answer: "",
        marks: 1,
        timeAllowed: currentMCQ.timeAllowed || 60,
      });
      setAdding(false);
    } catch (err) {
      console.log(err);
      setLoading({
        error: "Error in Adding Question.",
      });
    }
  };

  const handleEditMCQ = (index) => () => {
    if (!editing && !adding) {
      setEditing(true);
      setIndex(index);
      setCurrentMCQ(mcqs[index]);
      //if edited mcq is correct anser, then we need to update correct answer
      console.log(mcqs[index], "aaaa");
    } else {
      alert(
        "Please save or cancel the current edit or add operation before editing another question."
      );
    }
  };

  const handleUpdateMCQ = async (index) => {
    if (
      currentMCQ.question === "" ||
      currentMCQ.options.includes("") ||
      currentMCQ.correct_answer === "" ||
      currentMCQ.marks === "" ||
      (!freeFlow && !currentMCQ.timeAllowed)
    ) {
      alert("Please fill all the fields");
      return;
    }

    if (currentMCQ.options.length !== new Set(currentMCQ.options).size) {
      alert("Please remove duplicate options, and reselect correct option.");
      return;
    }

    setLoading({
      message: "Updating Question",
    });
    console.log(currentMCQ, "currentMCQ");
    const newMCQ = await axios.post("/api/faculty/edit_objective", {
      oq_id: mcqs[index].oq_id,
      paper_id: paperId,
      question: currentMCQ.question,
      answers: currentMCQ.options.toString(),
      correct_answer: currentMCQ.correct_answer,
      marks: currentMCQ.marks,
      timeAllowed: currentMCQ.timeAllowed || 60,
    });
    console.log(newMCQ, "newMCQ");
    if (newMCQ.status === 200) {
      setLoading({});
      const newMCQs = [...mcqs];
      const newWithOptions = {
        options: newMCQ.data.answers.split(","),
        ...newMCQ.data,
      };
      newMCQs[index] = newWithOptions;

      setMCQs(newMCQs);
      setObjectiveQuestions(newMCQs);
      setMultipleOptions(false);
      setCurrentMCQ({
        question: "",
        options: ["", "", "", ""],
        correct_answer: "",
        marks: 1,
        timeAllowed: currentMCQ.timeAllowed || 60,
      });
      setEditing(false);
      setIndex(null);
    } else {
      setLoading({
        error: "Error in Updating Question.",
      });
    }
  };

  const handleDeleteMCQ = async (index) => {
    setLoading({
      message: "Deleting Question",
    });

    const res = await axios.post("/api/faculty/remove_objective", {
      oq_id: mcqs[index].oq_id,
    });

    if (res.status === 200) {
      setLoading({});
      const newMCQs = [...mcqs];
      newMCQs.splice(index, 1);
      setMCQs(newMCQs);
      setObjectiveQuestions(newMCQs);
    } else {
      setLoading({
        error: "Error in Deleting Question.",
      });
    }
  };

  const updateMarks = () => {
    const totalMarks = mcqs.reduce((total, mcq) => total + mcq.marks, 0);
    if (totalMarks !== exam.objective_marks) {
      setLoading({
        message: "Saving...",
      });

      axios
        .post("/api/paper/update_total_marks", {
          paper_id: exam.paper_id,
          add_marks: totalMarks,
          is_objective: true,
        })
        .then((res) => {
          console.log("Marks added in total ", res.data.total_marks);

          setExam({
            ...exam,
            total_marks: res.data.total_marks,
            objective_marks: res.data.objective_marks,
          });
          setActive(3);

          setLoading({});
        })
        .catch((err) => {
          console.log("Error in update_total_marks", err);
          setLoading({
            error: "Error in Saving.",
          });
        });
    } else {
      setActive(3);
    }
  };

  return (
    <div className="flex font-poppins flex-col items-center p-6">
      <Spinner loading={loading} />

      <div className="w-full flex justify-center">
        <button
          onClick={() => {
            if (!adding && !editing) {
              setAdding(true);
            } else {
              alert(
                "Please save or cancel the current edit or add operation before editing another question."
              );
            }
          }}
          className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Add MCQ
        </button>
      </div>
      {(editing || adding) && (
        <div className="w-full p-10 bg-slate-100 mt-6 rounded-2xl ">
          <div className="flex justify-between">
            <h2 className="text-xl font-bold mb-4">
              {editing ? "Edit" : "Add"} MCQ
            </h2>
            <div className="rounded-full text-white bg-red-500 my-auto flex justify-between items-center p-2 cursor-pointer">
              <button
                onClick={() => {
                  setEditing(false);
                  setAdding(false);
                  setCurrentMCQ({
                    question: "",
                    options: ["", "", "", ""],
                    correct_answer: "",
                    marks: 1,
                    timeAllowed: currentMCQ.timeAllowed || 60,
                  });
                }}
              >
                <ImCross />
              </button>
            </div>
          </div>

          <div className="mb-4">
            <Input
              text={"Question"}
              required
              value={currentMCQ.question}
              onChange={handleQuestionChange}
            />
          </div>
          <div className="">
            <label className="block mb-2">Options</label>
            <div className="grid grid-cols-3 w-full gap-x-5">
              {currentMCQ.options.map((option, index) => (
                <div key={index} className="mb-2 ">
                  <input
                    type="text"
                    value={option.replace(specialSequence, ",")}
                    onChange={handleOptionChange(index)}
                    className="bg-white border border-primary-black focus:outline-none focus:border-[#edbd12] border-opacity-[0.15] p-2 rounded-lg w-full"
                  />
                </div>
              ))}
            </div>

            <div className="my-6 flex space-x-8">
              <button
                onClick={handleOptionAddition}
                className="bg-[#FEC703] text-white p-2 rounded hover:bg-[#edbd12]"
              >
                Add Option
              </button>

              <button
                onClick={handleOptionDeletion(currentMCQ.options.length - 1)}
                className="bg-red-600 text-white p-2 rounded hover:bg-red-700"
              >
                Delete Option
              </button>
            </div>
          </div>
          <div className="flex items-center mt-10 mb-2 gap-x-3">
            <label className="block">Allow Multiple Correct Options</label>
            <input
              type="checkbox"
              checked={multipleOptions}
              className="accent-slate-100"
              onChange={handleMultipleOptionsChange}
            />
          </div>
          <div className="flex w-full gap-x-5">
            <div className="mb-10 w-full mt-6">
              <label className="block mb-2">Correct Option</label>
              {multipleOptions ? (
                <MultiSelectDropdown
                  options={currentMCQ.options}
                  setCurrentMCQ={setCurrentMCQ}
                  selected={currentMCQ.correct_answer}
                />
              ) : (
                <select
                  type="text"
                  value={currentMCQ.correct_answer}
                  onChange={handleCorrectOptionChange}
                  className="bg-white p-2 rounded-lg border border-primary-black border-opacity-[0.15] w-full focus:outline-none focus:border-[#FEC703]"
                >
                  <option value="" disabled>
                    Select Correct Option
                  </option>
                  {currentMCQ.options.map((option, index) => (
                    <option key={index} value={option}>
                      {option.replace(specialSequence, ",")}
                    </option>
                  ))}
                </select>
              )}
            </div>

            <Input
              text={"Marks"}
              type={"number"}
              required
              min={1}
              value={currentMCQ.marks}
              onChange={handleMarksChange}
            />
            {/* input for time allowed */}
            {freeFlow ? null : (
              <Input
                text={"Time Allowed in Seconds"}
                type={"number"}
                required
                value={currentMCQ.timeAllowed || 60}
                onChange={handleTimeAllowedChange}
              />
            )}
          </div>
          {editing ? (
            <button
              onClick={() => {
                handleUpdateMCQ(index);
              }}
              className="bg-blue-800 text-white p-2 rounded hover:bg-blue-700"
            >
              Update
            </button>
          ) : (
            <button
              onClick={handleAddMCQ}
              className="bg-blue-800 text-white py-2 px-4 rounded hover:bg-blue-700"
            >
              Add
            </button>
          )}
        </div>
      )}
      <div className="mt-10 w-full pr-10 flex justify-end gap-x-10">
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
        <button
          type="submit"
          className="bg-blue-800 hover:bg-blue-700 font-medium text-white rounded-lg py-4 px-8"
          onClick={() => {
            updateMarks();
          }}
        >
          Save and Proceed
        </button>
      </div>
      {mcqs.length > 0 && (
        <>
          <h1 className="text-2xl font-bold mt-10">MCQ Question</h1>

          <table className="w-full mt-6 text-left table-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2">SR#</th>
                <th className="px-4 py-2 w-1/2">Question</th>
                <th className="px-4 py-2 w-1/4">Options</th>
                <th className="px-4 py-2">Correct Option</th>
                <th className="px-4 py-2">Marks</th>
                {freeFlow ? null : <th className="px-4 py-2">Time Allowed</th>}
                <th className="px-4 py-2">Edit</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {mcqs.map((mcq, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{mcq.question}</td>
                  <td className="px-4 py-2">
                    <ol className="list-[lower-alpha] list-inside">
                      {mcq.options?.map((option, index) => (
                        <li key={index}>{option.replace(specialSequence, ",")}</li>
                      ))}
                    </ol>
                  </td>
                  <td className="px-4 py-2">{mcq.correct_answer.replace(specialSequence, ",")}</td>
                  <td className="px-4 py-2">{mcq.marks}</td>
                  {freeFlow ? null : (
                    <td className="px-4 py-2">{mcq.timeAllowed}</td>
                  )}
                  <td className="px-4 py-2">
                    <button
                      onClick={handleEditMCQ(index)}
                      className="bg-white text-blue-900 p-2 rounded hover:bg-blue-900 hover:text-white transition-colors"
                    >
                      <MdEdit />
                    </button>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => {
                        handleDeleteMCQ(index);
                      }}
                      className="bg-white text-red-600 p-2 rounded hover:bg-red-600 hover:text-white transition-colors"
                    >
                      <MdDelete />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
};

export default MCQTable;
