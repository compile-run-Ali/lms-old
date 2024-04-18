import React, { useEffect, useState } from "react";

export default function NavigationGrid({
  totalQuestions,
  currentQuestion,
  setCurrentQuestion,
  flags,
  freeFlow,
  offset,
  attempted,
}) {
  console.log(attempted);
  console.log(attempted?.includes(0));
  return (
    <div className="mt-4 border-blue-800 ">
      <h1 className="text-2xl mb-2 font-poppins">Navigate</h1>
      <div className="grid grid-cols-2 md:grid-cols-5 max-w-[100px] md:max-w-[250px] ">
        {[...Array(totalQuestions)].map((_, index) => (
          <div
            onClick={() =>
              setCurrentQuestion(freeFlow ? index : index + offset)
            }
            key={index}
            className={`min-w-[20px] duration-300 transition-colors cursor-pointer border border-blue-800 w-full aspect-square flex justify-center items-center
          ${
            currentQuestion === index
              ? "bg-blue-800 text-white"
              : attempted?.includes(index) && !flags.includes(String(freeFlow ? index : index + offset))
              ? "bg-green-500 text-white"
              : flags.includes(String(freeFlow ? index : index + offset))
              ? "bg-yellow-400 text-black"
              : "bg-white text-black hover:bg-zinc-300  "
          }
            `}
          >
            {index + 1}
          </div>
        ))}
      </div>
    </div>
  );
}
