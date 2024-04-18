import { useState } from "react";
import { MdChevronRight } from "react-icons/md";

function UploadInstructions() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleAccordion = () => setIsOpen(!isOpen);

  return (
    <div className="bg-slate-200 my-4 rounded-lg">
      <div
        className="p-4 cursor-pointer flex justify-between items-center"
        onClick={toggleAccordion}
      >
        <h2 className="text-xl font-medium inline">
          {isOpen ? "Hide " : "Show "}
          Instructions
        </h2>
        <MdChevronRight
          className={`h-6 w-6 transform transition-transform inline ${
            isOpen ? "rotate-90" : ""
          }`}
        />
      </div>
      {isOpen && (
        <div className="px-6 pb-4">
          <ol className="list-decimal list-inside">
            <li>Download the .docx file from the button below</li>
            <li>Write your questions in the given format</li>
            <li>Save the .docx file as .txt file </li>
            <li>
              If you are using a Mac, use MS DOS formatting while saving as .txt
              file
            </li>
            <li>Check if the uploaded questions are correct</li>
            <li>Save and Proceed</li>
          </ol>
        </div>
      )}
    </div>
  );
}

export default UploadInstructions;
