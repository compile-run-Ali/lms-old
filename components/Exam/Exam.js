import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Accordion from "./Accordion";
import { MdEdit } from "react-icons/md";
import axios from "axios";
import { useSession } from "next-auth/react";
import { convertDateTimeToStrings } from "@/lib/TimeCalculations";
import Spinner from "../Loader/Spinner";
import IEContainer from "../Paper/IE/IEContainer";

export default function Exam({
  exam,
  subjectiveQuestions,
  objectiveQuestions,
  isEdit,
  setActive,
}) {
  const session = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState({});
  const [edit, setEdit] = useState(isEdit);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState();
  const [faculties, setFaculties] = useState();
  const [selectedFaculty, setSelectedFaculty] = useState();
  const [access, setAccess] = useState(null);
  const [ieFiles, setIeFiles] = useState(null);
  const [ieFilesWord, setIeFilesWord] = useState(null);
  const [linkedId, setLinkedId] = useState(null);
  useEffect(() => {
    setAccess(() => {
      if (session.status === "authenticated" && exam !== undefined) {
        if (
          session.data.user.role === "faculty" &&
          session.data.user.level === 5
        ) {
          return true;
        }

        if (exam.status === "Pending Approval") {
          return exam.examofficer?.faculty_id === session.data.user.id;
        } else if (exam.status === "Approved") {
          return false;
        } else if (exam.status === "Draft") {
          return true;
        }
      }
    });
  }, [session]);

  useEffect(() => {
    if (exam) {
      async function fetchIE() {
        if (exam?.paper_type === "IE") {
          try {
            const res = await axios.get(`/api/faculty/get_ie_files`, {
              params: {
                paperId: exam.paper_id,
              },
            });
            setIeFiles(res.data);
            console.log(res.data);
          } catch (err) {
            console.log(err);
          }
        }
      }
      async function getLinkedPaperId() {
        console.log("Sending id ", exam.paper_id, "to get linked paper id");
        try {
          const res = await axios.get(
            "/api/faculty/paper_creation/get_linked",
            {
              params: {
                paperId: exam.paper_id,
              },
            }
          );
          console.log(res.data);
          setLinkedId(res.data.paperId);
        } catch (err) {
          console.log(err);
        }
      }
      getLinkedPaperId();
      fetchIE();
    }
  }, [exam]);
  console.log(linkedId, "linkedId", exam?.paper_id);
  const getComments = async () => {
    if (exam !== undefined) {
      try {
        const res = await axios.post("/api/paper/get_comments", {
          paper_id: exam.paper_id,
        });

        // sort comment by date and time
        res.data.sort((a, b) => {
          const dateA = new Date(a.time);
          const dateB = new Date(b.time);
          return dateA - dateB;
        });

        setComments(res.data);
      } catch (err) {
        console.log(err);
      }
    }
  };

  const getFaculty = async () => {
    try {
      const res = await axios.get("/api/paper/get_faculty");
      setFaculties(
        res.data.filter(
          (faculty) => faculty.faculty_id !== session?.data?.user.id
        )
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (!comments) {
      getComments();
    }
    if (edit) {
      getFaculty();
    }
  }, []);

  if (!exam) {
    return <div>Exam not found</div>;
  }

  const isPaperDateNotToday = () => {
    const paperDate = new Date(exam.date);
    const today = new Date();

    // Set hours, minutes, seconds, and milliseconds to 0 to ignore the time part
    paperDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    return paperDate.getTime() < today.getTime();
  };

  const showSpinner = () => {
    setLoading({
      message: "Saving...",
    });
  };

  const hideSpinner = () => {
    setLoading({});
  };

  const addFiveHoursToISOString = (dateString) => {
    const date = new Date(dateString);
    date.setHours(date.getHours() + 5);
    return date.toISOString();
  };
  const editExam = () => {
    if (setActive) {
      setActive(1);
    }
    router.push({
      pathname: `/faculty/create_exam/${exam.paper_type === "Objective"
        ? "objective"
        : exam.paper_type === "Subjective/Objective"
          ? "subjective"
          : exam.paper_type === "IE"
            ? "ie"
            : "word"
        }`,
      query: {
        paper_id: exam.paper_id,
        is_edit: true,
      },
    });
  };

  async function submitExamOrEditPaperApproval(apiEndpoint, data, submit) {
    try {
      console.log(`calling ${apiEndpoint}`);

      const response = await axios.post(apiEndpoint, data);
      console.log(`${apiEndpoint} called`);
      setLoading({});

      addComment({
        comment: `Exam Submitted by ${session.data.user.name} to ${faculties.filter(
          (faculty) => faculty.faculty_id === selectedFaculty
        )[0].name
          }`,
        faculty_id: session.data.user.id,
        paper_id: exam.paper_id,
      });
      console.log("added comment");
      generateNotification();
      if (linkedId) {
        try {
          let linkedData;
          if (!submit) {
            linkedData = {
              paper_id: linkedId,
              examofficer: selectedFaculty,
              level: faculties.filter(
                (faculty) => faculty.faculty_id === selectedFaculty
              )[0].level,
            };
          } else {
            linkedData = {
              paper_id: linkedId,
              faculty_id: selectedFaculty,
              level: faculties.filter(
                (faculty) => faculty.faculty_id === selectedFaculty
              )[0].level,
            };
          }

          const res = await axios.post(apiEndpoint, linkedData);
          console.log("linked paper sent forward");
          addComment({
            comment: `Exam Sent Forward by ${session.data.user.name} to ${faculties.filter(
              (faculty) => faculty.faculty_id === selectedFaculty
            )[0].name
              }`,
            faculty_id: session.data.user.id,
            paper_id: linkedId,
          });
        } catch (err) {
          console.log(err);
        }
      }

      router.push("/");
    } catch (err) {
      console.log("error", err);
    }
    hideSpinner();
  }

  const submitExam = async () => {
    if (!selectedFaculty) {
      alert("Please select a faculty to mark to");
      return;
    }
    if (isPaperDateNotToday()) {
      alert("Exam date is in the past. Please change the date and try again.");
      return;
    }

    showSpinner();
    if (exam.examofficer !== null) {
      console.log("exam officer EXISTS");
      const editPaperApprovalData = {
        paper_id: exam.paper_id,
        examofficer: selectedFaculty,
        level: faculties.filter(
          (faculty) => faculty.faculty_id === selectedFaculty
        )[0].level,
      };
      submitExamOrEditPaperApproval(
        "/api/faculty/edit_paperapproval",
        editPaperApprovalData,
        false
      );
    } else {
      console.log("exam officer DOES NOT exist");
      const submitExamData = {
        paper_id: exam.paper_id,
        faculty_id: selectedFaculty,
        level: faculties.filter(
          (faculty) => faculty.faculty_id === selectedFaculty
        )[0].level,
      };
      submitExamOrEditPaperApproval(
        "/api/faculty/submit_exam",
        submitExamData,
        true
      );
    }
  };

  const approve = async () => {
    if (isPaperDateNotToday()) {
      alert("Exam date is in the past. Please change the date and try again.");
      return;
    }
    try {
      const approveExam = await axios.post("/api/faculty/update_exam_status", {
        paper_id: exam.paper_id,
        status: "Approved",
      });
      if (approveExam.status === 200) {
        addComment({
          comment: `Exam Approved by ${session.data.user.name}`,
          faculty_id: session.data.user.id,
          paper_id: exam.paper_id,
        });
        const approveLinkedExam = await axios.post("/api/faculty/update_exam_status", {
          paper_id: linkedId,
          status: "unapproved",
        });
        if (approveLinkedExam.status === 200) {
          addComment({
            comment: `Exam Approved by ${session.data.user.name}`,
            faculty_id: session.data.user.id,
            paper_id: linkedId,
          });
        }


      }
    } catch (err) {
      console.log(err);
    }
    router.push("/");
  };

  const saveDraft = async () => {
    showSpinner();
    const approveExam = await axios.post("/api/faculty/edit_paperapproval", {
      paper_id: exam.paper_id,
      examofficer: null,
    });
    if (approveExam.status === 200) {
      // addComment({
      //   comment: `Exam saved as draft by ${session.data.user.name}`,
      //   faculty_id: session.data.user.id,
      //   paper_id: exam.paper_id,
      // });
      router.push("/");
    } else {
      setLoading({
        error: "Error saving draft",
      });
    }
    hideSpinner();
  };
  const sendBack = async () => {
    const sendBack = await axios.post("/api/faculty/edit_paperapproval", {
      paper_id: exam.paper_id,
      examofficer: null,
    });
    if (sendBack.status === 200) {
      addComment({
        comment: `Exam Sent Back by ${session.data.user.name}`,
        faculty_id: session.data.user.id,
        paper_id: exam.paper_id,
      });
      if (linkedId) {
        const sendBackLinked = await axios.post("/api/faculty/edit_paperapproval", {
          paper_id: linkedId,
          examofficer: null,
        });
        if (sendBackLinked.status === 200) {
          addComment({
            comment: `Exam Sent Back by ${session.data.user.name}`,
            faculty_id: session.data.user.id,
            paper_id: linkedId,
          });
        }
      }

      router.push("/");
    } else {
      setLoading({
        error: "Error sending back",
      });
    }
  };

  const sendForward = async () => {
    if (!selectedFaculty) {
      alert("Please select a faculty to send to");
      return;
    }
    if (isPaperDateNotToday()) {
      alert("Exam date is in the past. Please change the date and try again.");
      return;
    }

    const sendForward = await axios.post("/api/faculty/edit_paperapproval", {
      paper_id: exam.paper_id,
      examofficer: selectedFaculty,
      level: faculties.filter(
        (faculty) => faculty.faculty_id === selectedFaculty
      )[0].level,
    });
    if (sendForward.status === 200) {
      addComment({
        comment: `Exam Sent Forward by ${session.data.user.name} to ${faculties.filter(
          (faculty) => faculty.faculty_id === selectedFaculty
        )[0].name
          }`,
        faculty_id: session.data.user.id,
        paper_id: exam.paper_id,
      });
      console.log("Exam Sent Forward");
      generateNotification();
      if (linkedId) {
        try {
          const res = await axios.post("/api/faculty/edit_paperapproval", {
            paper_id: linkedId,
            examofficer: selectedFaculty,
            level: faculties.filter(
              (faculty) => faculty.faculty_id === selectedFaculty
            )[0].level,
          });
          console.log("linked paper sent forward");
          if (res.status === 200) {
            addComment({
              comment: `Exam Sent Forward by ${session.data.user.name} to ${faculties.filter(
                (faculty) => faculty.faculty_id === selectedFaculty
              )[0].name
                }`,
              faculty_id: session.data.user.id,
              paper_id: linkedId,
            });
          } else {
            setLoading({
              error: "Error sending forward",
            });
          }
        } catch (err) {
          console.log(err);
        }
      }

      router.push("/");
    } else {
      setLoading({
        error: "Error sending forward",
      });
    }
  };
  const generateNotification = async () => {
    const res = await axios.post("/api/faculty/generate_notification", {
      faculty_id: selectedFaculty,
      notification: `You have a new exam to approve by ${session.data.user.name}`,
    });
    if (res.status === 200) {
      console.log("Notification sent");
    } else {
      console.log("Notification not sent, some error occured");
    }
  };

  const addComment = async ({ comment }, userGenerated = false) => {
    if (session.status === "authenticated") {
      const res = await axios.post("/api/faculty/add_comment", {
        paper_id: exam.paper_id,
        comment: comment,
        faculty_id: session.data.user.id,
        user_generated: userGenerated,
      });

      if (res.status === 200) {
        setComments([...comments, res.data]);
        setComment("");
      } else {
        console.log("Error adding comment");
      }
      // setComments([...comments, new_comment])
    }
  };

  const handleSelectedFaculty = (e) => {
    setSelectedFaculty(e.target.value);
  };

  return (
    <>
      <Spinner loading={loading} />
      <div className="px-10 font-poppins w-full">
        <div className="bg-gray-100 bg-opacity-50 pt-10 rounded-md">
          {access && (
            <div className="w-full flex justify-end pr-5 cursor-pointer">
              <div
                onClick={() => {
                  editExam();
                }}
                className="bg-white text-[#f5c51a]  p-2 rounded hover:bg-[#f5c51a] hover:text-white transition-colors"
              >
                <MdEdit />
              </div>
            </div>
          )}

          <div className="font-semibold text-center text-3xl mt-5 mb-10">
            Exam Details
          </div>

          <div className="grid grid-cols-3 gap-y-3">
            <div className="pl-20">
              <span className=" font-medium">Exam Name:</span>
              <span className="ml-2">{exam.paper_name}</span>
            </div>
            <div className="pl-20">
              <span className=" font-medium">Exam Type:</span>
              <span className="ml-2">{exam.paper_type}</span>
            </div>
            <div className="pl-20">
              <span className=" font-medium">Exam Date:</span>
              <span className="ml-2">
                {convertDateTimeToStrings(exam.date, true)}
              </span>
            </div>
            <div className="pl-20">
              <span className=" font-medium">Exam Time:</span>
              <span className="ml-2">
                {convertDateTimeToStrings(exam.date)}
              </span>
            </div>
            <div className="pl-20">
              {
                exam.paper_type === "Objective" ? (
                  <React.Fragment>
                    <span className=" font-medium">Exam Duration:</span>
                    <span className="ml-2">{exam.objDuration} Minutes</span>
                  </React.Fragment>
                )
                  :
                  exam.paper_type === "Subjective/Objective" || "Word" && !"IE" ? (
                    <React.Fragment>
                      <span className=" font-medium">Objective Duration:</span>
                      <span className="ml-2">{exam.objDuration} Minutes</span>
                      <span className=" font-medium"><br />Subjective Duration:</span>
                      <span className="ml-2">{exam.duration} Minutes</span>
                    </React.Fragment>
                  )

                    :
                    (
                      <React.Fragment>
                        <span className=" font-medium">Exam Duration:</span>
                        <span className="ml-2">{exam.duration} Minutes</span>
                      </React.Fragment>
                    )
              }
            </div>

            <div className="pl-20">
              <span className=" font-medium">Total Marks:</span>
              <span className="ml-2">
                {exam.paper_type === "IE"
                  ? ieFiles?.ie_questions?.[0]?.total_marks || ""
                  : exam.total_marks}
              </span>
            </div>
          </div>
          {exam.paper_type === "IE" && (
            <IEContainer
              IeFiles={ieFiles}
              IeFilesWord={ieFilesWord}
              faculty={true}
              paperId={exam.paper_id}
              markTo={true}
            />
          )}
          {exam.paper_type !== "IE" && (
            <div className="bg-gray-100 py-5 mt-5 px-5 border-b border-slate-400 border-opacity-50">
              <Accordion
                freeFlow={exam.freeflow}
                questions={objectiveQuestions}
                paperType={"Objective"}
              />
            </div>
          )}
          {exam.paper_type !== "Objective" && exam.paper_type !== "IE" && (
            <div className="bg-gray-100 py-5 px-5 border-b border-slate-400 border-opacity-50">
              <Accordion
                freeFlow={exam.freeflow}
                questions={subjectiveQuestions}
                paperType={"Subjective/Objective"}
              />
            </div>
          )}
        </div>
        <div className="mt-10 font-poppins">
          <span className=" text-lg font-medium ml-5">Comments</span>
          <div className="bg-gray-100 bg-opacity-50 px-10 py-5 ">
            {comments &&
              comments.map((comment, index) => (
                <div
                  key={index}
                  className="flex justify-between mb-5 pb-4 border-b border-gray-600 border-opacity-20"
                >
                  <div className=" flex flex-col justify-center">
                    <span
                      className={`
                        text-[#212121] font-medium
                        ${comment.user_generated && "italic"}
                    `}
                    >
                      {comment.user_generated && '"'}
                      {comment.comment}
                      {comment.user_generated && '"'}
                    </span>
                    <span className="text-sm mt-2 text-[#828282]">
                      By {comment.faculty?.name}
                    </span>
                  </div>
                  <div className="flex flex-col text-[#BDBDBD] text-right">
                    <span className="text-xs font-medium mt-1">
                      {convertDateTimeToStrings(
                        addFiveHoursToISOString(comment.time)
                      )}
                    </span>
                    <span className="text-xs font-medium mt-1">
                      {convertDateTimeToStrings(
                        addFiveHoursToISOString(comment.time),
                        true
                      )}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
        {edit && access && (
          <div>
            <div className="flex flex-col mt-5">
              <span className="text-lg pr-5 py-5 font-medium">
                Add Comments
              </span>
              <textarea
                className="p-5 bg-slate-100 border border-slate-300 rounded-md focus:outline-none active:outline-none"
                onChange={(e) => setComment(e.target.value)}
                value={comment}
              />
            </div>
            <div className="flex justify-end mt-5">
              <button
                className="bg-blue-800 hover:bg-blue-700 font-medium text-white rounded-lg py-4 px-8"
                onClick={() => {
                  if (!comment) {
                    alert("Please enter a comment");
                    return;
                  }
                  addComment({ comment }, true);
                }}
              >
                Add Comment
              </button>
            </div>

            {exam.examofficer?.faculty_id === session.data.user.id ? (
              <div className="">
                <div className="flex justify-end">
                  <div className="mt-10 mb-10">
                    <select
                      className="bg-gray-100 border-2 border-gray-300 rounded-lg py-4 px-8"
                      onChange={handleSelectedFaculty}
                    >
                      <option value="">Mark to</option>
                      {faculties &&
                        faculties
                          .filter(
                            (faculty) =>
                              faculty.level === 2 ||
                              faculty.level === 3 ||
                              faculty.level === 4
                          )
                          .map((faculty) => (
                            <option
                              key={faculty.faculty_id}
                              value={faculty.faculty_id}
                            >{`${faculty.name}`}</option>
                          ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-x-10 justify-end">
                  <button
                    type="submit"
                    className="bg-red-800 hover:bg-red-700 font-medium text-white rounded-lg py-4 px-8"
                    onClick={() => {
                      sendBack();
                    }}
                  >
                    Send Back
                  </button>
                  <button
                    type="submit"
                    className="bg-blue-800 hover:bg-blue-700 font-medium text-white rounded-lg py-4 px-8"
                    onClick={() => {
                      sendForward();
                    }}
                  >
                    Mark To
                  </button>
                  {exam.examofficer?.level > 2 && (
                    <button
                      type="submit"
                      className="bg-green-800 hover:bg-green-700 font-medium text-white rounded-lg py-4 px-8"
                      onClick={() => {
                        approve();
                      }}
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <div className="mt-10 mb-10">
                  <select
                    className="bg-gray-100 border-2 border-gray-300 rounded-lg py-4 px-8"
                    onChange={handleSelectedFaculty}
                  >
                    <option value="">Mark to</option>
                    {faculties &&
                      faculties
                        .filter(
                          (faculty) =>
                            faculty.level === 2 ||
                            faculty.level === 3 ||
                            faculty.level === 4
                        )
                        .map((faculty) => (
                          <option
                            key={faculty.faculty_id}
                            value={faculty.faculty_id}
                          >{`${faculty.name}`}</option>
                        ))}
                  </select>
                </div>
                <div className="flex justify-end gap-x-10">
                  {setActive && (
                    <button
                      type="submit"
                      className="border-2 border-[#FEC703] hover:bg-[#FEAF03] hover:text-white font-medium text-primary-black rounded-lg py-3.5 px-8"
                      onClick={() => {
                        setActive(
                          exam.paper_type === "Subjective/Objective" ||
                            exam.paper_type === "Word"
                            ? 3
                            : 2
                        );
                      }}
                    >
                      Back
                    </button>
                  )}
                  <button
                    type="submit"
                    className="bg-blue-800 hover:bg-blue-700 font-medium text-white rounded-lg py-4 px-8"
                    onClick={() => {
                      saveDraft();
                    }}
                  >
                    Save Draft
                  </button>
                  <button
                    type="submit"
                    className="bg-green-800 hover:bg-green-700 font-medium text-white rounded-lg py-4 px-8"
                    onClick={() => {
                      submitExam();
                      //here
                    }}
                  >
                    Mark To
                  </button>
                  {session.data.user.level === 5 && (
                    <button
                      className="bg-green-800 hover:bg-green-700 font-medium text-white rounded-lg py-4 px-8 transition-all"
                      onClick={() => {
                        // router.push("/");
                        approve();
                        router.push("/");

                      }}
                    >
                      Save and Approve
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
        {(session?.data?.user?.level === 1 || session?.data?.user?.level === 5) &&
          exam.status !== "Draft" &&
          exam.status !== "Pending Approval" && (
            <button
              className="bg-blue-800 hover:bg-blue-700 font-medium text-white rounded-lg py-4 px-8 my-10"
              onClick={() => {
                router.push("/faculty/mark_exam/" + exam.paper_id);
              }}
            >
              Evaluate
            </button>
          )}
      </div>
    </>
  );
}
