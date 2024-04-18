import { Fragment, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { IoIosPaper } from "react-icons/io";
import { useRouter } from "next/router";

export default function Modal({ open, setOpen, courseCode }) {
  const [examType, setExamType] = useState("I.E");
  const router = useRouter();
  const cancelButtonRef = useRef(null);
  const handleNext = async () => {
    if (examType === "I.E") {
      // Redirect to create exam page for IE
      router.push({
        pathname: `/faculty/create_exam/ie`,
        query: {
          course_code: courseCode,
        },
      });
    } else if (examType === "SO") {
      // Redirect to create exam page for subjective/objective
      router.push({
        pathname: `/faculty/create_exam/subjective`,
        query: {
          course_code: courseCode,
        },
      });
    } else if (examType === "O") {
      // Redirect to create exam page for objective
      //make api call to create a new paper using axios

      //then redirect to create exam page for objectiv
      router.push({
        pathname: `/faculty/create_exam/objective`,
        query: {
          course_code: courseCode,
        },
      });   
    }

    else if (examType === "Ot") {
      // Redirect to create exam page for objective
      //make api call to create a new paper using axios

      //then redirect to create exam page for objectiv
      router.push({
        pathname: `/faculty/create_exam/objective`,
        query: {
          language: "urdu",
          course_code: courseCode,
        },
      });
    }
  };

  const handleInput = (e) => {

    setExamType(e.target.value);
    console.log(e.target.value)
  };

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
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
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <div className="bg-white px-4 pt-5 pb-4 font-poppins sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <IoIosPaper
                        className="h-6 w-6 text-blue-900"
                        aria-hidden="true"
                      />
                    </div>
                    <div className="pt-2 text-center sm:mt-0 sm:ml-4 sm:text-left">
                      <Dialog.Title
                        as="h3"
                        className="text-lg font-medium leading-6 text-gray-900"
                      >
                        Select Exam Type
                      </Dialog.Title>
                      <form>
                        <div className="mt-4">
                          <button type="button">
                            <input
                              type={"radio"}
                              value="I.E"
                              onChange={(e) => handleInput(e)}
                              checked={examType === "I.E"}
                              name="paperType"
                              className="mr-2"
                            />
                            I.E Exam
                          </button>
                        </div>
                        <div className="mt-2">
                          <button type="button">
                            <input
                              type={"radio"}
                              value="SO"
                              onChange={(e) => handleInput(e)}
                              name="paperType"
                              className="mr-2"
                            />
                            Subjective/Objective Exam
                          </button>
                        </div>

                        <div className="mt-2">
                          <button type="button">
                            <input
                              type={"radio"}
                              onChange={(e) => handleInput(e)}
                              value="O"
                              name="paperType"
                              className="mr-2"
                            />
                            Objective Exam
                          </button>
                        </div>
                        <div className="mt-2">
                          <button type="button">
                            <input
                              type={"radio"}
                              onChange={(e) => handleInput(e)}
                              value="Ot"
                              name="paperType"
                              className="mr-2"
                            />
                            Urdu Objective Exam
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    type="button"
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-900 px-5 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-800  sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                  <button
                    type="button"
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setOpen(false)}
                    ref={cancelButtonRef}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
