import { useState } from "react";
import { MdError } from "react-icons/md";
import { ImCross } from "react-icons/im";

const Spinner = ({ loading }) => {
  const [closed, setClosed] = useState(false);
  if (!loading.message && !loading.error) {
    return null;
  }

  if (loading.error && !closed) {
    return (
      <div
        style={{ height: "calc(100vh + 200px)" }}
        className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-50 bg-black bg-opacity-25"
      >
        <div className="bg-white bg-opacity-100 rounded-lg py-6 px-10 relative h-24 flex flex-col justify-end">
          <div
            className="absolute top-4 right-4 cursor-pointer"
            onClick={() => {
              setClosed(true);
            }}
          >
            <ImCross className="" />
          </div>
          <div className="flex items-center justify-center">
            <MdError className="text-red-600 text-4xl" />
            <div className="text-xs text-black text-center ml-2">
              {loading.error}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (closed) {
    return (
      <div className="bg-red-500 shadow-xl bg-opacity-100 rounded-lg p-4 absolute bottom-10 left-10">
        <MdError
          className="text-white text-4xl cursor-pointer"
          onClick={() => {
            // reload
            window.location.reload();
          }}
        />
      </div>
    );
  }
  return (
    <div
      style={{ height: "calc(100vh + 200px)" }}
      className="fixed top-0 left-0 w-full h-screen flex items-center justify-center z-50 bg-black bg-opacity-25"
    >
      <div className="bg-white bg-opacity-100 rounded-lg p-8 pb-6">
        <div
          className="animate-spin rounded-full aspect-square w-16 border-t-2 border-b-2 border-blue-900"
          style={{ animationDuration: "2s" }}
        ></div>
        <div className="text-xs text-black text-center mt-4 w-16">
          {loading.message}
        </div>
      </div>
    </div>
  );
};

export default Spinner;
