"use client";

import Image from "next/image";
import courseBannerBottomBg from "@assets/images/courseBannerBottomBg.png";
import courseBanner from "@assets/images/courseBanner.png";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import React from "react";
import StatusButton from "@common/StatusButton";

const ProgressBar = ({ percentage = 14, width, height = 7 }) => {
  const containerRef = React.useRef(null);
  const [resolvedWidth, setResolvedWidth] = React.useState(width ?? 0);

  React.useEffect(() => {
    // If an explicit width is passed, skip measuring
    if (width !== undefined) {
      setResolvedWidth(width);
      return;
    }

    const observer = new ResizeObserver(([entry]) => {
      setResolvedWidth(entry.contentRect.width);
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [width]);

  const filledWidth = (resolvedWidth * percentage) / 100;
  const rx = height / 2;

  return (
    // This div stretches full width so ResizeObserver can measure it
    <div ref={containerRef} style={{ width: "100%" }}>
      <svg
        width={resolvedWidth}
        height={height}
        viewBox={`0 0 ${resolvedWidth} ${height}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g clipPath="url(#clip0_69_6730)">
          <rect width={resolvedWidth} height={height} rx={rx} fill="#313335" />
          <rect width={filledWidth} height={height} fill="#B88934" />
        </g>
        <defs>
          <clipPath id="clip0_69_6730">
            <rect width={resolvedWidth} height={height} rx={rx} fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

export default function CourseOverview() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <section className="pb-4 ">
      <div className="relative mb-10 ">
        <Image src={courseBanner} className="w-full h-[346px] " />
        <div className="w-full absolute left-0 bottom-0 z-10 ">
          <Image src={courseBannerBottomBg} />
        </div>
        <Link href="" className="absolute left-8 bottom-2 z-20 py-2.5 px-[14px] flex gap-2 items-center textLabel16 text-[#DFE1E3] rounded-[8px] bg-transparent hover:bg-[#313335] active:bg-transparent transition duration-300 ">
          <span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.46967 3.21967C8.76256 2.92678 9.23732 2.92678 9.53022 3.21967C9.82311 3.51256 9.82311 3.98732 9.53022 4.28022L5.56049 8.24994H14.2499C14.6642 8.24994 14.9999 8.58573 14.9999 8.99994C14.9999 9.41416 14.6642 9.74994 14.2499 9.74994H5.56049L9.53022 13.7197C9.82311 14.0126 9.82311 14.4873 9.53022 14.7802C9.23732 15.0731 8.76256 15.0731 8.46967 14.7802L3.21967 9.53022C2.92678 9.23732 2.92678 8.76256 3.21967 8.46967L8.46967 3.21967Z" fill="currentColor" />
            </svg>
          </span>
          <span>
            Back to Programs
          </span>
        </Link>
      </div>
      <div className="px-[34px] flex flex-col lg:flex-row gap-[44px] justify-between ">
        <div className="w-full lg:w-8/12 flex flex-col gap-[34px] ">
          {/*  */}
          <div>
            <h2 className="text-[#FFFFFF] textDisplay40 mb-6 ">Trusted Facilitator Positioning System</h2>
            <p className="textHeading20 ">Build absolute clarity, confidence, and trust in the facilitation model, the industry, and your role within it.</p>
          </div>
          {/*  */}
          <div className="py-[34px] px-[26px] bg-[#1C1E20] border-2 border-[#26282A] rounded-[12px] ">
            <p className="mb-7 text-[#EFEFEE] textDisplay24 ">About this program</p>
            <p className="text-[#ABADAF] textBody18 ">
              This phase lays the foundation of your entire journey, You’ll understand the facilitation economy, why this opportunity exists, and how it creates leverage for modern operators. More importantly you’ll build trust in the system -- the industry mechanics, the compliance landscape, and the tools you’ll use. By the end of this phase, confusion is eliminated and replaced with certainty, structure, and belief, You don’t just know what you’re doing --you understand why it works.
            </p>
          </div>
          {/*  */}
          <div className="border border-[#313335] rounded-[14px] bg-[#1C1E20] py-9 px-5 ">
            <div className="w-full flex justify-between items-center mb-[30px] ">
              <p className="text-[#EFEFEE] textDisplay24 ">Modules</p>
              <Link href="" className="text-[#B88934] flex gap-2 items-center textLabel16 ">
                <span>
                  View all
                </span>
                <span>
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6.21967 3.96967C6.51256 3.67678 6.98732 3.67678 7.28022 3.96967L11.7802 8.46967C12.0731 8.76256 12.0731 9.23732 11.7802 9.53022L7.28022 14.0302C6.98732 14.3231 6.51256 14.3231 6.21967 14.0302C5.92678 13.7373 5.92678 13.2626 6.21967 12.9697L10.1894 8.99994L6.21967 5.03022C5.92678 4.73732 5.92678 4.26256 6.21967 3.96967Z" fill="currentColor" />
                  </svg>
                </span>
              </Link>
            </div>
            <div>
              {/* button */}
              <button className="w-full ps-5 pr-[39px] py-[19px] text-start rounded-[16px] hover:bg-[#26282A] active:bg-transparent transition duration-200 flex justify-between items-center gap-5 ">
                <div className="flex gap-4 items-center ">
                  <div className="w-[46px] h-[46px] bg-[#37352B] rounded-full text-[#B88934] textBody18 !font-bold flex items-center justify-center ">
                    1
                  </div>
                  <div className="text-[#ABADAF] ">
                    <p className="textBody18 !font-semibold ">Tools & Operational Readiness</p>
                    <p className="textBody14 !font-semibold ">1 lessons</p>
                  </div>
                </div>
                <div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.29289 5.29289C8.68342 4.90237 9.31643 4.90237 9.70696 5.29289L15.707 11.2929C16.0975 11.6834 16.0975 12.3164 15.707 12.707L9.70696 18.707C9.31643 19.0975 8.68342 19.0975 8.29289 18.707C7.90237 18.3164 7.90237 17.6834 8.29289 17.2929L13.5859 11.9999L8.29289 6.70696C7.90237 6.31643 7.90237 5.68342 8.29289 5.29289Z" fill="#ABADAF" />
                  </svg>
                </div>
              </button>
              {/* button */}
              <button className="w-full ps-5 pr-[39px] py-[19px] text-start rounded-[16px] hover:bg-[#26282A] active:bg-transparent transition duration-200 flex justify-between items-center gap-5 ">
                <div className="flex gap-4 items-center ">
                  <div className="w-[46px] h-[46px] bg-[#37352B] rounded-full text-[#B88934] textBody18 !font-bold flex items-center justify-center ">
                    2
                  </div>
                  <div className="text-[#ABADAF] ">
                    <p className="textBody18 !font-semibold ">Tools & Operational Readiness</p>
                    <p className="textBody14 !font-semibold ">1 lessons</p>
                  </div>
                </div>
                <div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.29289 5.29289C8.68342 4.90237 9.31643 4.90237 9.70696 5.29289L15.707 11.2929C16.0975 11.6834 16.0975 12.3164 15.707 12.707L9.70696 18.707C9.31643 19.0975 8.68342 19.0975 8.29289 18.707C7.90237 18.3164 7.90237 17.6834 8.29289 17.2929L13.5859 11.9999L8.29289 6.70696C7.90237 6.31643 7.90237 5.68342 8.29289 5.29289Z" fill="#ABADAF" />
                  </svg>
                </div>
              </button>
              {/* button */}
              <button className="w-full ps-5 pr-[39px] py-[19px] text-start rounded-[16px] hover:bg-[#26282A] active:bg-transparent transition duration-200 flex justify-between items-center gap-5 ">
                <div className="flex gap-4 items-center ">
                  <div className="w-[46px] h-[46px] bg-[#37352B] rounded-full text-[#B88934] textBody18 !font-bold flex items-center justify-center ">
                    3
                  </div>
                  <div className="text-[#ABADAF] ">
                    <p className="textBody18 !font-semibold ">Tools & Operational Readiness</p>
                    <p className="textBody14 !font-semibold ">1 lessons</p>
                  </div>
                </div>
                <div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.29289 5.29289C8.68342 4.90237 9.31643 4.90237 9.70696 5.29289L15.707 11.2929C16.0975 11.6834 16.0975 12.3164 15.707 12.707L9.70696 18.707C9.31643 19.0975 8.68342 19.0975 8.29289 18.707C7.90237 18.3164 7.90237 17.6834 8.29289 17.2929L13.5859 11.9999L8.29289 6.70696C7.90237 6.31643 7.90237 5.68342 8.29289 5.29289Z" fill="#ABADAF" />
                  </svg>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="flex-1 max-w-[448px] flex flex-col gap-[22px] ">
          <div className="border-2 border-[#26282A] bg-[#1C1E20] p-[26px] rounded-[12px] ">
            <button className="w-full px-[14px] py-[13px] bg-[#B88934] hover:bg-[#DFAF32] active:bg-[#B88934] text-[#2C2313] rounded-[8px] flex gap-2 items-center justify-center textHeading16 transition duration-300 mb-[22px] ">
              <span>
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.25732 1.49952C5.65319 1.50087 6.04187 1.6069 6.38379 1.80641L15.3794 7.05348H15.3801C15.7207 7.25111 16.0038 7.53483 16.2004 7.87599C16.3971 8.21715 16.5004 8.60426 16.5007 8.99806C16.5011 9.39181 16.398 9.77866 16.2019 10.1201C16.0303 10.4189 15.793 10.6739 15.5083 10.8657L15.3838 10.9441L6.38379 16.1941C6.04193 16.3935 5.6531 16.4989 5.25732 16.5003C4.86159 16.5015 4.47255 16.3985 4.12939 16.2014C3.78617 16.0043 3.50075 15.7201 3.30249 15.3775C3.10422 15.0348 2.99988 14.6454 3 14.2495V3.75026C2.99988 3.35446 3.10432 2.96567 3.30249 2.62306C3.50076 2.28039 3.78611 1.99556 4.12939 1.79835C4.47254 1.60128 4.86162 1.49824 5.25732 1.49952ZM4.5 14.2503C4.49997 14.3822 4.535 14.5118 4.60107 14.626C4.66716 14.7402 4.76206 14.8349 4.87647 14.9006C4.99079 14.9663 5.12035 15.0006 5.2522 15.0003C5.3841 14.9998 5.51399 14.9649 5.62793 14.8984L14.6279 9.64845L14.6287 9.64772C14.742 9.58165 14.8358 9.48681 14.9011 9.37306C14.9664 9.25933 15.0008 9.13064 15.0007 8.99952C15.0006 8.86826 14.9659 8.73898 14.9004 8.62526C14.8348 8.51161 14.7407 8.41718 14.6272 8.35133L14.6257 8.3506L5.62793 3.10206C5.51395 3.03555 5.38416 2.99997 5.2522 2.99952C5.12038 2.99914 4.99077 3.03348 4.87647 3.09913C4.7621 3.16483 4.66716 3.25966 4.60107 3.37379C4.53502 3.48795 4.5 3.61763 4.5 3.74952V14.2503Z" fill="currentColor" />
                </svg>
              </span>
              <span>
                Start Program
              </span>
            </button>
            <div className="flex flex-col gap-y-2 ">
              <div className="flex justify-between textLabel16 ">
                <span className="text-[#ABADAF] ">Progress</span>
                <span className="text-[#DFE1E3] ">10%</span>
              </div>

              <ProgressBar percentage={10} height={10} />

              <p className="text-[#ABADAF] textLabel14 ">0 of 4 lessons completed</p>
            </div>
          </div>
          <div className="border-2 border-[#26282A] bg-[#1C1E20] rounded-[12px] p-[26px] flex flex-col gap-y-5 ">
            <p className="text-[#FFFFFF] textHeading20 ">Program Details</p>
            <div className="flex gap-4 items-center ">
              <span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M13.332 3.33317C12.669 3.33317 12.0333 3.59675 11.5645 4.06559C11.0956 4.53443 10.832 5.17013 10.832 5.83317V14.6141C11.3346 14.3239 11.9083 14.1665 12.4987 14.1665H17.4987V3.33317H13.332ZM2.4987 14.1665H7.4987C8.08906 14.1665 8.66284 14.3239 9.16537 14.6141V5.83317C9.16537 5.17013 8.90178 4.53443 8.43294 4.06559C7.9641 3.59675 7.32841 3.33317 6.66536 3.33317H2.4987V14.1665ZM19.1654 14.1665C19.1654 14.6085 18.9896 15.0323 18.6771 15.3449C18.3645 15.6575 17.9407 15.8332 17.4987 15.8332H12.4987C12.0567 15.8332 11.6329 16.0089 11.3203 16.3215C11.0078 16.634 10.832 17.0578 10.832 17.4998C10.832 17.9601 10.4589 18.3332 9.9987 18.3332C9.53846 18.3332 9.16537 17.9601 9.16537 17.4998C9.16537 17.0578 8.98964 16.634 8.67708 16.3215C8.36452 16.0089 7.94073 15.8332 7.4987 15.8332H2.4987C2.05667 15.8332 1.63287 15.6575 1.32031 15.3449C1.00775 15.0323 0.832031 14.6085 0.832031 14.1665V3.33317C0.832031 2.89114 1.00775 2.46735 1.32031 2.15479C1.63287 1.84222 2.05667 1.6665 2.4987 1.6665H6.66536C7.77043 1.6665 8.82993 2.10581 9.61133 2.88721C9.75172 3.0276 9.88097 3.17697 9.9987 3.33398C10.1164 3.17697 10.2457 3.0276 10.3861 2.88721C11.1675 2.10581 12.227 1.6665 13.332 1.6665H17.4987C17.9407 1.6665 18.3645 1.84222 18.6771 2.15479C18.9896 2.46735 19.1654 2.89114 19.1654 3.33317V14.1665Z" fill="#B88934" />
                </svg>
              </span>
              <span className="text-[#ABADAF] textLabel14 ">
                3 modules
              </span>
            </div>
            <div className="flex gap-4 items-center ">
              <span>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.84017 1.66603C6.28002 1.66752 6.71188 1.78534 7.0918 2.00701L17.0869 7.83709H17.0877C17.4662 8.05668 17.7807 8.37193 17.9992 8.75099C18.2177 9.13006 18.3325 9.56018 18.3328 9.99774C18.3332 10.4352 18.2187 10.8651 18.0008 11.2445C17.8102 11.5765 17.5464 11.8598 17.2301 12.0729L17.0918 12.16L7.0918 17.9933C6.71195 18.2149 6.27992 18.332 5.84017 18.3335C5.40047 18.3349 4.9682 18.2205 4.58691 18.0015C4.20555 17.7824 3.88843 17.4666 3.66813 17.0859C3.44783 16.7052 3.3319 16.2726 3.33203 15.8327V4.16684C3.3319 3.72707 3.44794 3.29507 3.66813 2.9144C3.88843 2.53366 4.20549 2.21718 4.58691 1.99806C4.96818 1.77909 5.4005 1.6646 5.84017 1.66603ZM4.9987 15.8335C4.99867 15.9801 5.03758 16.1241 5.111 16.251C5.18443 16.3779 5.28988 16.4831 5.41699 16.5562C5.54402 16.6291 5.68798 16.6673 5.83447 16.6668C5.98103 16.6663 6.12535 16.6276 6.25195 16.5537L16.252 10.7204L16.2528 10.7196C16.3787 10.6462 16.4829 10.5408 16.5555 10.4144C16.628 10.288 16.6662 10.1451 16.6662 9.99936C16.6661 9.85351 16.6275 9.70987 16.5547 9.58351C16.4818 9.45723 16.3772 9.35231 16.2511 9.27915L16.2495 9.27833L6.25195 3.44663C6.12531 3.37273 5.9811 3.33319 5.83447 3.3327C5.68801 3.33227 5.544 3.37043 5.41699 3.44337C5.28992 3.51637 5.18443 3.62173 5.111 3.74855C5.03761 3.87539 4.9987 4.01949 4.9987 4.16603V15.8335Z" fill="#B88934" />
                </svg>
              </span>
              <span className="text-[#ABADAF] textLabel14 ">
                4 lessons
              </span>
            </div>
            <StatusButton status="golden" label="Beginner" />
          </div>
          <div className="border-2 border-[#26282A] bg-[#1C1E20] rounded-[12px] p-[26px] flex flex-col gap-y-5 ">
            <p className="text-[#FFFFFF] textHeading20 ">Instructors</p>
            <div className="flex gap-3 items-center">
              <div className="bg-[#37352B] w-[54px] h-[54px] rounded-full flex justify-center items-center ">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14 8C14 5.79086 12.2091 4 10 4C7.79086 4 6 5.79086 6 8C6 10.2091 7.79086 12 10 12C12.2091 12 14 10.2091 14 8ZM21 20C21 16.9893 19.1864 14.1394 17.4004 12.7998C17.1486 12.611 17 12.3147 17 12C17 11.6854 17.1479 11.3891 17.3994 11.2002C17.9253 10.8056 18.3461 10.2872 18.624 9.69141C18.902 9.09562 19.0287 8.44064 18.9932 7.78418C18.9576 7.12767 18.7607 6.49003 18.4199 5.92773C18.0792 5.36553 17.6054 4.89594 17.04 4.56055C16.565 4.27881 16.4077 3.66447 16.6895 3.18945C16.9712 2.71452 17.5856 2.55813 18.0605 2.83984C18.9086 3.34291 19.6198 4.04733 20.1309 4.89062C20.642 5.73409 20.9368 6.69098 20.9902 7.67578C21.0436 8.66055 20.8535 9.64336 20.4365 10.5371C20.1926 11.0599 19.8732 11.5405 19.4941 11.9697C21.3667 13.7926 23 16.777 23 20C23 20.5523 22.5523 21 22 21C21.4477 21 21 20.5523 21 20ZM16 8C16 9.94598 15.0726 11.6742 13.6367 12.7705C14.6434 13.2154 15.571 13.8424 16.3643 14.6357C18.0521 16.3236 19 18.6131 19 21C19 21.5523 18.5523 22 18 22C17.4477 22 17 21.5523 17 21C17 19.1435 16.2629 17.3626 14.9502 16.0498C13.6374 14.7371 11.8565 14 10 14C8.14348 14 6.36256 14.7371 5.0498 16.0498C3.73705 17.3626 3 19.1435 3 21C3 21.5523 2.55228 22 2 22C1.44772 22 1 21.5523 1 21C1 18.6131 1.94791 16.3236 3.63574 14.6357C4.42882 13.8427 5.35593 13.2153 6.3623 12.7705C4.92681 11.6742 4 9.9457 4 8C4 4.68629 6.68629 2 10 2C13.3137 2 16 4.68629 16 8Z" fill="#B88934" />
                </svg>
              </div>
              <p className="text-[#DFE1E3] textHeading20 ">
                Mark Suh
              </p>
            </div>
            <p className="text-[#ABADAF] ">
              Founder & Lead Instructor at Clinic Launch Academy. Expert in business mindset, operations, and scaling strategies. Mark has helped hundrd...
            </p>
            <div className="flex gap-2 items-center flex-wrap ">
              <StatusButton status="golden" label="Business Strategy" />
              <StatusButton status="golden" label="Mindset" />
              <StatusButton status="golden" label="Scaling" />
            </div>
            <div className="flex gap-3 items-center ">
              <Link href="" className="w-[30px] h-[30px] rounded-[2px] bg-[#313335] flex items-center justify-center ">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.24873 1.6665C6.51103 1.6665 6.75785 1.79032 6.91523 2.00016L18.1652 17.0002C18.3545 17.2527 18.3853 17.5903 18.2442 17.8726C18.103 18.1549 17.8144 18.3332 17.4987 18.3332H13.7487C13.4813 18.3332 13.23 18.2049 13.0733 17.9881L2.23994 2.98812C2.05676 2.73449 2.03086 2.3992 2.17321 2.12061C2.31567 1.84197 2.60245 1.6665 2.91539 1.6665H6.24873ZM14.1752 16.6665H15.8329C11.9276 11.4595 9.73812 8.54016 5.83288 3.33317H4.54544L14.1752 16.6665Z" fill="#ABADAF" />
                  <path d="M16.25 2.0835L11.25 8.3335L11.6667 9.16683L17.5 2.0835H16.25Z" fill="#ABADAF" />
                  <path d="M17.4988 1.6665C17.6599 1.6665 17.8067 1.75932 17.8756 1.90495C17.9444 2.05071 17.9226 2.2232 17.8202 2.34766L11.9869 9.43099C11.8972 9.53987 11.7584 9.59658 11.6183 9.58073C11.4782 9.56477 11.3558 9.47892 11.2927 9.35286L10.8761 8.51953C10.8034 8.37417 10.8217 8.19966 10.9233 8.07275L15.9233 1.82275L15.99 1.75684C16.0629 1.69899 16.1539 1.6665 16.2488 1.6665H17.4988ZM11.7403 8.38525L11.7509 8.40641L16.6166 2.49984H16.449L11.7403 8.38525Z" fill="#ABADAF" />
                  <path d="M2.5 17.9167L8.33333 11.25L9.16667 12.0833C7.05133 14.5241 6.28201 15.4759 4.16667 17.9167H2.5Z" fill="#ABADAF" />
                  <path d="M8.31799 10.8332C8.43323 10.8294 8.54488 10.8738 8.62642 10.9553L9.45975 11.7886C9.61427 11.9432 9.62309 12.1907 9.4801 12.3559C8.42378 13.5747 7.70355 14.4221 6.98254 15.2701C6.2613 16.1183 5.53895 16.9674 4.4801 18.1892C4.40095 18.2805 4.28599 18.3332 4.16515 18.3332H2.49849C2.33513 18.3332 2.18689 18.2378 2.11926 18.0891C2.0517 17.9402 2.07751 17.7654 2.18517 17.6423L8.01851 10.9757L8.08117 10.9171C8.14908 10.8659 8.23165 10.8361 8.31799 10.8332ZM3.41646 17.4999H3.97391C4.96322 16.3572 5.65536 15.544 6.34777 14.7297C7.00988 13.951 7.67367 13.1722 8.59712 12.1044L8.35135 11.8586L3.41646 17.4999Z" fill="#ABADAF" />
                </svg>
              </Link>
              <Link href="" className="w-[30px] h-[30px] rounded-[2px] bg-[#313335] flex items-center justify-center ">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clip-path="url(#clip0_105_10589)">
                    <path d="M5.83073 18.333V6.66634H1.66406V18.333H5.83073ZM3.33073 8.33301H4.16406V16.6663H3.33073V8.33301Z" fill="#ABADAF" />
                    <mask id="mask0_105_10589" style={{ maskType: "luminance" }}
                      maskUnits="userSpaceOnUse" x="-2" y="-2" width="24" height="24">
                      <path d="M-1.66797 -1.66683H21.6654V21.6665H-1.66797V-1.66683Z" fill="white" />
                    </mask>
                    <g mask="url(#mask0_105_10589)">
                      <path d="M4.37891 3.84733C4.37891 4.14219 4.13991 4.38118 3.84505 4.38118C3.55019 4.38118 3.3112 4.14219 3.3112 3.84733C3.3112 3.55247 3.55019 3.31348 3.84505 3.31348C4.13991 3.31348 4.37891 3.55247 4.37891 3.84733ZM6.04557 3.84733C6.04557 2.632 5.06039 1.64681 3.84505 1.64681C2.62972 1.64681 1.64453 2.632 1.64453 3.84733C1.64453 5.06267 2.62972 6.04785 3.84505 6.04785C5.06039 6.04785 6.04557 5.06267 6.04557 3.84733Z" fill="#ABADAF" />
                      <path d="M13.9492 18.3525H18.3503V11.7087C18.3503 8.79441 15.9878 6.43197 13.0736 6.43197C12.531 6.43197 12.0074 6.51535 11.5143 6.66797V6.43197H7.11328V18.3525H11.5143V12.0505C11.5143 11.3781 12.0594 10.833 12.7318 10.833C13.4042 10.833 13.9492 11.3781 13.9492 12.0505V18.3525ZM15.6159 12.0505C15.6159 10.4576 14.3246 9.16634 12.7318 9.16634C11.1389 9.16634 9.84766 10.4576 9.84766 12.0505V16.6859H8.77995V8.09863H9.84766V9.48779L11.1302 8.66667C11.6912 8.30737 12.357 8.09863 13.0736 8.09863C15.0673 8.09863 16.6836 9.71488 16.6836 11.7087V16.6859H15.6159V12.0505Z" fill="#ABADAF" />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_105_10589">
                      <rect width="20" height="20" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
