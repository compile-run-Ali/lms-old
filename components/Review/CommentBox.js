import React, { useState, useEffect } from "react";
import axios from "axios";

const CommentBox = ({ student, paper, isStudent }) => {
  const [studentComment, setStudentComment] = useState("");
  const [teacherComment, setTeacherComment] = useState("");
  const [studentPaperAttempt, setStudentPaperAttempt] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  const handleStudentChange = (e) => {
    setSubmitted(false);
    if (isStudent) setStudentComment(e.target.value);
  };

  const handleTeacherChange = (e) => {
    setSubmitted(false);
    if (!isStudent) setTeacherComment(e.target.value);
  };

  const fetchAttemptDetails = async () => {
    await axios
      .get("/api/student/paper/get_single_attempt", {
        params: {
          p_number: student,
          paper_id: paper,
        },
      })
      .then((res) => {
        setStudentComment(res.data.studentComment);
        setTeacherComment(res.data.teacherComment);
        setStudentPaperAttempt(res.data);
      })
      .catch((err) => {
        console.log("error in fetching attempt details", err.message);
      });
  };
  console.log(studentPaperAttempt)
  const submitComment = () => {
    axios
      .post("/api/student/paper/update_attempt_status", {
        studentId: student,
        paperId: paper,
        studentComment: studentComment,
        teacherComment: teacherComment,
        //if student comment exists then change status to commented else no change
        status: studentComment.length > 0 ? "Re-Check" : studentPaperAttempt.status
      })
      .then((res) => {
        console.log("comment submitted successfully", res.data);
        setSubmitted(true);
      })
      .catch((err) => {
        console.log("error in submitting comment", err.message);
      });
  };

  useEffect(() => {
    if (student && paper) {
      fetchAttemptDetails();
    }
  }, [student, paper]);

  if (
    isStudent &&
    studentPaperAttempt &&
    studentPaperAttempt.status !== "Marked"
  ) {
    return (
      <div className="text-2xl font-bold mb-10 mx-auto w-full">
        Not yet marked.
      </div>
    );
  }
  return (
    <div
      className={`mb-10 flex
      ${!isStudent ? "flex-col-reverse" : "flex-col"}
    `}
    >
      <div>
        {/* student's comment box */}
        <div className="text-2xl font-bold">Comment by Student</div>
        <div className="my-2 p-6 bg-blue-900 rounded-md">
          <textarea
            className={`
          border rounded-md p-2 w-full
          ${isStudent ? "bg-white text-black" : "bg-gray-200 text-gray-700"}
          `}
            value={studentComment}
            onChange={(e) => handleStudentChange(e)}
            disabled={!isStudent}
          />
        </div>
        <div className="flex justify-end">
          {isStudent && (
            <button
              className="bg-blue-900 text-white px-4 py-2 rounded-md"
              onClick={
                studentComment.length > 0 ? () => submitComment() : () => {}
              }
            >
              {submitted ? "Comment Added" : "Add Comment"}
            </button>
          )}
        </div>
      </div>

      {/* teacher's comment box */}
      <div className="mt-16">
        <div className="text-2xl font-bold">Comment by Faculty</div>
        <div className="my-2 p-6 bg-blue-900 rounded-md">
          <textarea
            className={`
          border rounded-md p-2 w-full
          ${!isStudent ? "bg-white text-black" : "bg-gray-200 text-gray-700"}
          `}
            value={teacherComment}
            onChange={(e) => handleTeacherChange(e)}
            disabled={isStudent}
          />
        </div>
        <div className="flex justify-end">
          {!isStudent && (
            <button
              className="bg-blue-900 text-white px-4 py-2 rounded-md"
              onClick={
                teacherComment.length > 0 ? () => submitComment() : () => {}
              }
            >
              {submitted ? "Comment Added" : "Add Comment"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CommentBox;
