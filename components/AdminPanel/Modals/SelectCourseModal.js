import { Dialog, Transition } from "@headlessui/react";
import { useRouter } from "next/router";
import { Fragment, useState } from "react";

export default function SelectCourseModal({ isOpen, setIsOpen, courses }) {
  const router = useRouter();
  const [selectedCourseCode, setSelectedCourseCode] = useState("");

  console.log("courses:", selectedCourseCode);

  const handleConfirm = () => {
    if (!selectedCourseCode) {
      alert("Please select a course.");
    } else {
      router.push({
        pathname: `/faculty/create_exam/word`,
        query: {
          course_code: selectedCourseCode,
        },
      });
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10 font-poppins"
        onClose={() => setIsOpen(false)}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-md" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Create Word Exam
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Choose a course:</p>
                </div>
                <div className="flex w-full gap-x-5">
                  <div className="mb-10 w-full mt-6">
                    <label className="block mb-2">Courses</label>
                    <select
                      type="text"
                      value={selectedCourseCode}
                      onChange={(e) => setSelectedCourseCode(e.target.value)}
                      className="bg-white p-2 rounded-lg border border-primary-black border-opacity-[0.15] w-full focus:outline-none focus:border-[#FEC703]"
                    >
                      <option value="">Select Course</option>
                      {courses.map((course, index) => (
                        <option
                          key={index}
                          value={course.course_code}
                        >{`${course.course_name}`}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="mt-4 flex gap-x-3 justify-end">
                  <button
                    type="button"
                    className="inline-flex justify-center focus:outline-none active:outline-none rounded-md border border-transparent px-4 py-2 text-sm font-medium bg-[#FEC703] text-white hover:bg-[#edbd12]"
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center focus:outline-none active:outline-none rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
                    onClick={handleConfirm}
                  >
                    Confirm
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
