import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { FaShareSquare } from "react-icons/fa";
import Spinner from "../Loader/Spinner";

const ShareModal = ({ showModal, setShowModal, exam }) => {
  const [facultyDetails, setFacultyDetails] = useState([]);
  const [selectedFacultyIds, setSelectedFacultyIds] = useState([]);
  const [loading, setLoading] = useState({});

  const session = useSession();
  const user = session.data.user;

  useEffect(() => {
    axios
      .get("/api/admin/faculty/get_faculty")
      .then((res) => {
        setFacultyDetails(
          res.data?.filter(
            (faculty) =>
              faculty.faculty_id !== user.id &&
              (faculty.level === 2 ||
                faculty.level === 3 ||
                faculty.level === 4)
          )
        );
      })
      .catch((err) => {
        console.log(err.message);
      });
  }, []);

  const handleCheckboxChange = (event, facultyId) => {
    if (event.target.checked) {
      setSelectedFacultyIds([...selectedFacultyIds, facultyId]);
    } else {
      setSelectedFacultyIds(
        selectedFacultyIds.filter((id) => id !== facultyId)
      );
    }
  };

  const handleShare = () => {
    setLoading({
      message: "Sharing result...",
    });
    axios
      .post("/api/faculty/share_exam", {
        faculty_ids: selectedFacultyIds,
        exam: exam,
        shared_by: user.name,
      })
      .then((res) => {
        console.log(res.data);
        setLoading({});
        setShowModal(false);
      })
      .catch((err) => {
        console.log("error in sharing result", err);
        setLoading({
          error: "An error occured.",
        });
      });
    setSelectedFacultyIds([]);
  };

  return (
    <>
      <Spinner loading={loading} />

      <Transition appear show={showModal} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={() => setShowModal(false)}
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
            <div className="fixed inset-0 bg-black bg-opacity-20 backdrop-blur-md" />
          </Transition.Child>
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
              <div className="inline-block w-full max-w-md p-6 mt-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <p className="text-2xl font-poppins mb-4">
                  Select the faculty.
                </p>
                <div className="mt-4 mb-8">
                  {facultyDetails
                    .sort((a, b) => a.level - b.level)
                    .map((faculty) => (
                      <div
                        key={faculty.faculty_id}
                        className="flex items-center justify-between w-4/5 mb-2"
                      >
                        <p className="text-sm mx-2 flex items-end">
                          <span className="text-lg font-poppins" href="#">
                            {faculty.name}
                          </span>
                        </p>
                        <p className="mr-2 mt-1 accent-blue-700">
                          <input
                            type="checkbox"
                            className="ml-2 text-xs mb-1 text-gray-400 cursor-pointer"
                            onChange={(event) =>
                              handleCheckboxChange(event, faculty.faculty_id)
                            }
                          />
                        </p>
                      </div>
                    ))}
                </div>

                <div className="flex justify-end">
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 w-24 rounded-lg duration-200 mr-4"
                    onClick={() => {
                      setSelectedFacultyIds([]);
                      setShowModal(false);
                    }} // close the modal when cancel is clicked
                  >
                    Cancel
                  </button>
                  <button
                    className="bg-blue-700 hover:bg-blue-800 text-white px-3 py-2 w-24 rounded-lg duration-200"
                    onClick={handleShare}
                  >
                    Share
                    <FaShareSquare className="inline-block ml-2 mb-0.5 text-lg" />
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default ShareModal;
