import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useRouter } from "next/router";


export default function SubmitObjectiveModal({
    showModal,
    handleSubmit,
    setShowModal,
    freeFlow
}) {
    const [flags, setFlags] = useState([])
    const router = useRouter();

    const {paper} = router.query;


    useEffect(() => {
        const paperObject = JSON.parse(localStorage.getItem(`paper ${paper}`));
        setFlags(paperObject.flags || [])
    }, [])



  return (
    <Transition appear show={showModal} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        onClose={() => setShowModal(false)}
      >
        <div className="min-h-screen px-4 text-center">
          <span
            className="inline-block h-screen align-middle"
            aria-hidden="true"
          >
            &#8203;
          </span>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
              <p className="text-lg font-bold mb-4">
                Are you sure you want to submit?
                {
                  // if there are any flags, show which questions are flagged
                  flags && flags.length > 0 && (
                    <span className="text-red-500 text-sm block">
                      {" "}
                      (You have flagged question number{" "}
                      {flags.map((flag) => {
                        return freeFlow
                          ? Number(flag) + 1
                          : Number(flag) + 1;
                      }) + " "}
                      )
                    </span>
                  )
                }
              </p>
              <div className="flex justify-end">
                <button
                  className="bg-gray-500 hover:bg-gray-600 px-3 py-2 w-24 rounded-lg shadow-md shadow-black duration-500 mr-4"
                  onClick={() => setShowModal(false)} // close the modal when cancel is clicked
                >
                  Cancel
                </button>
                <button
                  className="bg-green-500 hover:bg-green-600 px-3 py-2 w-24 rounded-lg shadow-md shadow-black duration-500"
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
}
