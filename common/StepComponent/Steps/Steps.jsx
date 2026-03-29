"use client";

import React from "react";

const Steps = ({ current, steps }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isActive = index === current;
          const isCompleted = index < current;

          return (
            <div key={index} className="flex-1 flex items-center">
              <div className="flex items-center gap-2.5 text-[#737272] textLabel16 redhat">
                {isCompleted
                  ?
                  <div className="w-7 h-7 flex items-center justify-center bg-[#F1DBFF] rounded-full ">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M17.9422 6.06729L7.94217 16.0673C7.88412 16.1254 7.81519 16.1715 7.73932 16.203C7.66344 16.2344 7.58212 16.2506 7.49998 16.2506C7.41785 16.2506 7.33652 16.2344 7.26064 16.203C7.18477 16.1715 7.11584 16.1254 7.05779 16.0673L2.68279 11.6923C2.56552 11.575 2.49963 11.416 2.49963 11.2501C2.49963 11.0843 2.56552 10.9252 2.68279 10.8079C2.80007 10.6906 2.95913 10.6248 3.12498 10.6248C3.29083 10.6248 3.44989 10.6906 3.56717 10.8079L7.49998 14.7415L17.0578 5.18292C17.1751 5.06564 17.3341 4.99976 17.5 4.99976C17.6658 4.99976 17.8249 5.06564 17.9422 5.18292C18.0594 5.30019 18.1253 5.45925 18.1253 5.6251C18.1253 5.79096 18.0594 5.95002 17.9422 6.06729Z" fill="#663F7E" />
                    </svg>
                  </div>
                  :
                  isActive
                    ?
                    <div className="w-fit p-[1.5px] rounded-full bg-[radial-gradient(29.45%_174.39%_at_50%_50%,#E5E1B3_0%,#E5C879_15.87%,#D5A459_31.73%,#E9BE5F_70.67%,#F9ECB8_85.34%,#F2D386_100%)]">
                      <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#663F7E] text-white textBody16 redhat ">
                        {index + 1}
                      </div>
                    </div>
                    :
                    <div className="w-7 h-7 flex items-center justify-center bg-[#D9D9D9] rounded-full redhat text-[#B0B0B0] ">
                      {index + 1}
                    </div>
                }
                <p>
                  {step.title}
                </p>
              </div>

              {/* Connector line */}
              {index !== steps.length - 1 && (
                <div
                  className={`flex-1 h-[1px] mx-2 transition
                    ${isCompleted
                      ? "bg-[#B683D5]"
                      : isActive
                        ? "bg-[#B683D5]"
                        : "bg-[#C4C4C4]"
                    }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Steps;