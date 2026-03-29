"use client";

import React, { useState } from "react";
import Steps from "../Steps/Steps";

const StepWrapper = ({ currentStep, setCurrentStep, steps }) => {
  // const steps = [
  //   { title: "First", content: "First step content..." },
  //   { title: "Second", content: "Second step content..." },
  //   { title: "Last", content: "Last step content..." },
  // ];


  const next = () => setCurrentStep((prev) => prev + 1);
  const prev = () => setCurrentStep((prev) => prev - 1);

  return (
    <div className="w-full">
      {/* Step Indicators */}
      <Steps current={currentStep} steps={steps} />

      <div className="w-full h-[1px] bg-[#EDEDED] my-6 "></div>

      {/* Content Box */}
      <div className="">
        {steps[currentStep].content}
      </div>

      {/* Navigation Buttons */}
      <div className="mt-6 flex items-center gap-4">
        {currentStep > 0 && (
          <button
            onClick={prev}
            className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
          >
            Previous
          </button>
        )}

        {currentStep < steps.length - 1 ? (
          <button
            onClick={next}
            // disabled={true}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next
          </button>
        ) : (
          <button
            onClick={() => alert("Process complete!")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Done
          </button>
        )}
      </div>
    </div>
  );
};

export default StepWrapper;
