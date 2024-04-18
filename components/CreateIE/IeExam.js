import axios from "axios";
import Spinner from "../Loader/Spinner";
import { useState } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { useRouter } from "next/router";

const IeExam = ({ paperId, setActive, exam, ieFiles, ieFilesWord }) => {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [filesWord, setFilesWord] = useState([]);
  const [loading, setLoading] = useState({});
  const [total_marks, setTotalMarks] = useState(exam?exam.total_marks:0)

  console.log(ieFiles, ieFilesWord);

  const handleFileUpload = (e) => {
    if (ieFiles?.ie_questions?.length > 0) {
      alert("You can only upload one file");
      return;
    }
    if (files.length > 0) {
      alert("You can only upload one file");
      return;
    }
    const newFile = e.target.files[0];
    setFiles([newFile]);
  };

  const handleWordUpload = (e) => {
    if (ieFilesWord?.ie_questions?.length > 0) {
      alert("You can only upload one file");
      return;
    }
    if (filesWord.length > 0) {
      alert("You can only upload one file");
      return;
    }
    const newFileWord = e.target.files[0];
    setFilesWord([newFileWord]);
  };
  const handleFileRemove = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleWordRemove = (index) => {
    const newFilesWord = [...filesWord];
    newFilesWord.splice(index, 1);
    setFilesWord(newFilesWord);
  };

  const editExam = () => {
    console.log("pushing back");
    router.push({
      pathname: `/faculty/create_exam/ie`,
      query: {
        paper_id: exam.paper_id,
        is_edit: true,
      },
    });
  };

  const handleDelete = async (id) => {
    try {
      setLoading({
        message: "Deleting Exam...",
      });

      const res = await axios.delete(
        `/api/faculty/paper_creation/delete_excel?ie_id=${id}`
      );
      console.log(res);

      setLoading({});
      window.location.reload();
    } catch (error) {
      console.error(error);
      setLoading({
        error: "Error in Deleting Exam",
      });
    }
  };

  const handleUpload = async () => {
    if (filesWord.length < 1) {
      return
    }
    
    if (files.length < 1) {
      return
    }

    if (total_marks < 1) {
      return
    }

    try {
      setLoading({
        message: "Uploading Exam...",
      });
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("Excel", file);
      });
      filesWord.forEach((file) => {
        formData.append("Word", file);
      });
      formData.append("paperId", paperId);
      formData.append("total_marks", total_marks);
      const res = await axios.post(
        "/api/faculty/paper_creation/add_excel",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(res);
      setLoading({});
      setFiles([]);
      setFilesWord([]);
    } catch (error) {
      console.error(error);
      setLoading({
        error: "Error in Uploading Exam",
      });
    }
  };
  return (
    <div>
      <Spinner loading={loading} />

      <div className="flex flex-wrap gap-4">
        {ieFiles?.ie_questions?.length > 0 && (
          <table className="w-full mt-6 text-left table-collapse">
            <thead>
              <tr>
                <th className="px-4 py-2">SR#</th>
                <th className="px-4 py-2">File</th>
                <th className="px-4 py-2">Delete</th>
              </tr>
            </thead>
            <tbody>
              {ieFiles?.ie_questions?.map((IE, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{IE.fileName}</td>
                  <td
                    className="px-4 py-2"
                    onClick={() => handleDelete(IE.ie_id)}
                  >
                    <MdDelete />
                  </td>
                </tr>
              ))}
              {ieFilesWord?.ie_questions?.map((IE, index) => (
                <tr key={index} className="border-t">
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{IE.fileNameWord}</td>
                  <td
                    className="px-4 py-2"
                    onClick={() => handleWordDelete(IE.ie_id)}
                  >
                    <MdDelete />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {files.map((file, index) => (
          <div key={index} className="flex items-center">
            <p>{file.name}</p>
            <button onClick={() => handleFileRemove(index)}>
              <MdDelete />
            </button>
          </div>
        ))}
        {filesWord.map((fileWord, index) => (
          <div key={index} className="flex items-center">
            <p>{fileWord.name}</p>
            <button onClick={() => handleWordRemove(index)}>
              <MdDelete />
            </button>
          </div>
        ))}
      </div>
      <div>
        <label className="ml-2 inline-flex items-center justify-center px-4 py-2 bg-blue-800 text-white font-medium rounded cursor-pointer">
          <span>Upload IE Format</span>
          <input
            type="file"
            class="hidden"
            accept=".xlsx,.numbers,.xls"
            onChange={handleFileUpload}
          />
        </label>
        <label className="ml-2 inline-flex items-center justify-center px-4 py-2 bg-blue-800 text-white font-medium rounded cursor-pointer">
          <span>Upload IE Narrative</span>
          <input
            type="file"
            class="hidden"
            accept=".docx,.numbers"
            onChange={handleWordUpload}
          />
        </label>

      </div>
      <div className="mt-5 flex">
        <label className="block text-lg font-bold">
          Please Input total marks for this exam:
        </label>
        <input
          type="number"
          name="total_marks"
          id="total_marks"
          value={total_marks}
          onChange={(e) => setTotalMarks(e.target.value)}
          className="ml-2 bg-white rounded-md border-blue-800 border-2 p-2"
        />
      </div>

      <div className="mt-10 w-full pr-10 flex justify-end gap-x-5">
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
          onClick={async () => {
            await handleUpload(); // Wait for handleUpload to complete
            if (ieFiles?.ie_questions?.length > 0 || files.length > 0 && filesWord.length>0 && total_marks > 0) {
              setActive(3);
            }
          }}
        >
          Save and Proceed
        </button>
      </div>
    </div>
  );
};
export default IeExam;