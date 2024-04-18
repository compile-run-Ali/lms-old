import React from "react";
import { useRouter } from "next/router";

export default function Wizard({
  active,
  setActive,
  items,
  paperName,
  paperId,
  paperType,
}) {
  const router = useRouter();

  return (
    <div className=" font-cabin flex items-center border-b border-primary-black border-opacity-20 w-fit px-6">
      {paperName && (
        <div className="p-6 pl-0 border-r-primary-black border-opacity-20 border-r font-medium text-primary-black text-xl">
          {paperName}
        </div>
      )}
      {items.map((item) => (
        <div
          key={item.id}
          onClick={() => {
            if (item.id === 1 && active !== 1) {
              return;
              // let type;
              // switch (paperType) {
              //   case "Objective":
              //     type = "objective";
              //     break;
              //   case "Subjective/Objective":
              //     type = "subjective";
              //     break;
              //   case "Word":
              //     type = "word";
              //     break;
              //   case "IE":
              //     type = "ie";
              //   default:
              //     type = "subjective";
              //     break;
              // }
              // router.push({
              //   pathname: `/faculty/create_exam/${type}`,
              //   query: {
              //     paper_id: paperId,
              //     is_edit: true,
              //   },
              // });
            }

            if (active >= item.id) {
              console.log("clicked", item.id);
              setActive(item.id);
            } else {
              alert("Please save current information to proceed.");
            }
          }}
          className={`w-fit flex py-6 px-6 mx-2 cursor-pointer ${
            active === item.id ? "border-b-4 border-[#FEC703]" : ""
          }`}
        >
          <div
            className={`w-6 h-6 mr-3 rounded-full flex items-center justify-center ${
              active === item.id
                ? "bg-blue-800"
                : "border border-primary-black border-opacity-30"
            }`}
          >
            <span
              className={`font-bold text-sm ${
                active === item.id ? "text-white" : "text-primary-black"
              }`}
            >
              {item.id}
            </span>
          </div>

          <span className={`font-medium text-primary-black`}>{item.title}</span>
        </div>
      ))}
    </div>
  );
}
