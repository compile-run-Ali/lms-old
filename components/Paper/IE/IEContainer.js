import React from "react";
import axios from "axios";
import NewTimer from "../NewTimer";
import { useState } from "react";
import Spinner from "@/components/Loader/Spinner";
import { useSession } from "next-auth/react";
import { MdDelete } from "react-icons/md";

export default function IEContainer({
  IeFiles,
  attemptTime,
  startTime,
  paperId,
  setSubmitted,
  updateStatus,
  studentId,
  setIeMarks,
  faculty = false,
  markTo = false
}) {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState({});
  const { data: session } = useSession();
  const handleFileUpload = (e) => {
    const newFile = e.target.files[0];
    setFiles([newFile]);
  };

  const handleFileRemove = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleUpload = async () => {
    if (files.length < 1) {
      alert("Please select a file");
      return;
    }
    try {
      setLoading({
        message: "Uploading Exam...",
      });
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });
      formData.append("paperId", paperId);

      const studentId = session.user.id;

      formData.append("studentId", studentId);

      const res = await axios.post(
        "/api/student/paper/ie/update_sia",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res);
      setSubmitted(true);
      updateStatus();
      setLoading({});
      setFiles([]);
    } catch (error) {
      console.error(error);
      setLoading({
        error: "Error in Uploading Exam",
      });
    }
  };
  const handleDownload = async (fileId) => { // Make sure you pass the studentId to the function
    try {
      let response;
      if (!faculty || markTo) {
        response = await axios.get(`/api/paper/get_downloadIE`, {
          params: {
            fileId: fileId,
          },
          responseType: "blob",
        });
      } else {
        response = await axios.get(`/api/paper/marking/download_IE_attempt`, {
          params: {
            paperId: paperId,
            studentId: studentId,
          },
          responseType: "blob",
        });
      }

      const href = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");

      // Include student ID in the file name
      const fileNameWithStudentId = response.headers["content-disposition"].split("filename=")[1];
      link.href = href;
      link.download = studentId + "_" + fileNameWithStudentId; // Add student ID to the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(href);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleDownloadWord = async (fileId) => { // Make sure you pass the studentId to the function
    try {
      let response;
      response = await axios.get(`/api/paper/get_downloadIEWord`, {
        params: {
          fileId: fileId,
        },
        responseType: "blob",
      });

      const href = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");

      // Include student ID in the file name
      const fileNameWithStudentId = response.headers["content-disposition"].split("filename=")[1];
      link.href = href;
      link.download = studentId + "_" + fileNameWithStudentId; // Add student ID to the filename
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(href);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  return (
    <>
      <Spinner loading={loading} />

      <div className="flex gap-6 justify-between shadow-lg max-w-5xl font-poppins mt-28 mx-20 xl:mx-auto pt-20 pb-10 px-10 gradient rounded-2xl shadow-3xl shadow-black">
        <div className="flex gap-6">
          <div className="flex flex-col">
            {!faculty || markTo ? (
              <div>
                <div className="flex gap-2">
                  {IeFiles?.ie_questions.map((question, index) => (
                    <div key={index} className="flex">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold py-2 px-20 mx-auto mb-10 rounded"
                        onClick={() => handleDownload(question.ie_id)}
                      >
                        Download IE Format
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  {IeFiles?.ie_questions.map((question, index) => (
                    <div key={index} className="flex">
                      <button
                        className="bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold py-2 px-20 mx-auto mb-10 rounded"
                        onClick={() => handleDownloadWord(question.ie_id)}
                      >
                        Download IE Narrative
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                {IeFiles?.ie_questions.map((question, index) => (
                  <div key={index} className="flex">
                    <button
                      className="bg-blue-500 hover:bg-blue-700 text-white text-lg font-bold py-2 px-20 mx-auto mb-10 rounded"
                      onClick={() => handleDownload(question.ie_id)}
                    >
                      Download Exam
                    </button>
                  </div>
                ))}
              </div>
            )
            }

          </div>
          {!faculty && (
            <div className="flex flex-col gap-2 text-white">
              <label className="text-xl font-bold">Upload File</label>
              <input
                type="file"
                accept=".xlsx, .xls"
                onChange={handleFileUpload}
                className="border-2 border-gray-300 p-2 rounded-lg"
              />
              <button
                className="bg-blue-800 hover:bg-blue-700 font-medium text-white rounded-lg py-4 px-8"
                onClick={handleUpload}
              >
                Save and Proceed
              </button>
              <div className="flex flex-col gap-2">
                {files.map((file, index) => (
                  <div key={index} className="flex">
                    <div className="flex flex-col gap-4">
                      <div className="flex">
                        <p className="text-xl font-bold">{file.name}</p>
                        <button className="text-red-400 text-xl" onClick={() => handleFileRemove(index)}>
                          <MdDelete />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        {!faculty && (
          <div className="w-1/3 max-w-xs shadow-lg h-fit border-2 border-zinc-100 bg-white p-8 shadow-black">
            <NewTimer time={attemptTime} startTime={startTime} />
          </div>
        )}
        {/* set Ie marks if faculty */}
        {faculty && !markTo && (

          <div className="flex flex-col gap-2 text-white">
            <label className="text-xl font-bold">Set Marks</label>
            <input
              type="number"
              min="0"
              max={IeFiles?.ie_questions[0].total_marks}
              onChange={(e) => setIeMarks(e.target.value)}
              className="border-2 border-gray-300 p-2 rounded-lg"
            />
          </div>
        )}

      </div>
    </>
  );
}
