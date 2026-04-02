"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getStudentCourseById } from "apis/student-courses.api";
import Image from "next/image";
import courseBannerBottomBg from "@assets/images/courseBannerBottomBg.png";
import courseBanner from "@assets/images/courseBanner.png";
import React, { Suspense } from "react";
import Loader from "@common/Loader";

const ProgressBar = ({ percentage = 0, height = 7 }) => {
  const containerRef = React.useRef(null);
  const [resolvedWidth, setResolvedWidth] = React.useState(0);

  React.useEffect(() => {
    const observer = new ResizeObserver(([entry]) => {
      setResolvedWidth(entry.contentRect.width);
    });
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const filledWidth = (resolvedWidth * percentage) / 100;
  const rx = height / 2;

  return (
    <div ref={containerRef} style={{ width: "100%" }}>
      <svg width={resolvedWidth} height={height} viewBox={`0 0 ${resolvedWidth} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#prog_clip)">
          <rect width={resolvedWidth} height={height} rx={rx} fill="#313335" />
          <rect width={filledWidth} height={height} fill="#B88934" />
        </g>
        <defs>
          <clipPath id="prog_clip">
            <rect width={resolvedWidth} height={height} rx={rx} fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
  );
};

function CourseOverviewContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("id");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["student-course", courseId],
    queryFn: getStudentCourseById,
    enabled: !!courseId,
  });

  const course = data?.data?.course;
  const modules = data?.data?.modules || [];

  const totalLessons = modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0);
  const completedLessons = modules.reduce(
    (acc, m) => acc + (m.lessons?.filter((l) => l.completed).length || 0),
    0
  );
  const progressPercent = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  const allLessons = modules.flatMap((m) => m.lessons || []);
  const targetLesson =
    allLessons.find((l) => !l.completed) || allLessons[0];

  const handleStartContinue = () => {
    if (!targetLesson) return;
    router.push(
      `/courses/courseVideoPlayer?courseId=${courseId}&lessonId=${targetLesson._id}`
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader isLoading={true} />
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-[#ABADAF] textBody16">Failed to load course. Please try again.</p>
      </div>
    );
  }

  const instructorName = course.instructor
    ? `${course.instructor.firstName} ${course.instructor.lastName}`
    : "Unknown";

  return (
    <section className="pb-4">
      {/* Banner */}
      <div className="relative mb-10">
        {course.banner ? (
          <img src={course.banner} alt={course.title} className="w-full h-[420px] object-cover" />
        ) : (
          <Image src={courseBanner} className="w-full h-[420px]" alt="" />
        )}
        <div className="w-full absolute left-0 bottom-0 z-10">
          <Image src={courseBannerBottomBg} alt="" />
        </div>
        <button
          onClick={() => router.push("/courses")}
          className="absolute left-8 bottom-2 z-20 py-2.5 px-[14px] flex gap-2 items-center textLabel16 text-[#DFE1E3] rounded-[8px] bg-transparent hover:bg-[#313335] active:bg-transparent transition duration-300"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.46967 3.21967C8.76256 2.92678 9.23732 2.92678 9.53022 3.21967C9.82311 3.51256 9.82311 3.98732 9.53022 4.28022L5.56049 8.24994H14.2499C14.6642 8.24994 14.9999 8.58573 14.9999 8.99994C14.9999 9.41416 14.6642 9.74994 14.2499 9.74994H5.56049L9.53022 13.7197C9.82311 14.0126 9.82311 14.4873 9.53022 14.7802C9.23732 15.0731 8.76256 15.0731 8.46967 14.7802L3.21967 9.53022C2.92678 9.23732 2.92678 8.76256 3.21967 8.46967L8.46967 3.21967Z" fill="currentColor" />
          </svg>
          <span>Back to Programs</span>
        </button>
      </div>

      <div className="px-[34px] flex flex-col lg:flex-row gap-[44px] justify-between">
        {/* Left column */}
        <div className="w-full lg:w-8/12 flex flex-col gap-[34px]">
          <div>
            <h2 className="text-[#FFFFFF] textDisplay40 mb-6">{course.title}</h2>
            {course.subheading && (
              <p className="textHeading20 text-[#ABADAF]">{course.subheading}</p>
            )}
          </div>

          {course.about && (
            <div className="py-[34px] px-[26px] bg-[#1C1E20] border-2 border-[#26282A] rounded-[12px]">
              <p className="mb-7 text-[#EFEFEE] textDisplay24">About this program</p>
              <p className="text-[#ABADAF] textBody18">{course.about}</p>
            </div>
          )}

          {/* Modules */}
          <div className="border border-[#313335] rounded-[14px] bg-[#1C1E20] py-9 px-5">
            <div className="w-full flex justify-between items-center mb-[30px]">
              <p className="text-[#EFEFEE] textDisplay24">Modules</p>
            </div>
            <div>
              {modules.length === 0 && (
                <p className="text-[#ABADAF] textBody16 ps-5">No modules available.</p>
              )}
              {modules.map((module, index) => (
                <button
                  key={module._id}
                  onClick={() => {
                    const firstLesson = module.lessons?.[0];
                    if (firstLesson) {
                      router.push(
                        `/courses/courseVideoPlayer?courseId=${courseId}&lessonId=${firstLesson._id}`
                      );
                    }
                  }}
                  className="w-full ps-5 pr-[39px] py-[19px] text-start rounded-[16px] hover:bg-[#26282A] active:bg-transparent transition duration-200 flex justify-between items-center gap-5"
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-[46px] h-[46px] bg-[#37352B] rounded-full text-[#B88934] textBody18 !font-bold flex items-center justify-center flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="text-[#ABADAF]">
                      <p className="textBody18 !font-semibold">{module.title}</p>
                      <p className="textBody14 !font-semibold">
                        {module.lessons?.length ?? 0} lesson{module.lessons?.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8.29289 5.29289C8.68342 4.90237 9.31643 4.90237 9.70696 5.29289L15.707 11.2929C16.0975 11.6834 16.0975 12.3164 15.707 12.707L9.70696 18.707C9.31643 19.0975 8.68342 19.0975 8.29289 18.707C7.90237 18.3164 7.90237 17.6834 8.29289 17.2929L13.5859 11.9999L8.29289 6.70696C7.90237 6.31643 7.90237 5.68342 8.29289 5.29289Z" fill="#ABADAF" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 max-w-[448px] flex flex-col gap-[22px]">
          {/* Progress card */}
          <div className="border-2 border-[#26282A] bg-[#1C1E20] p-[26px] rounded-[12px]">
            <button onClick={handleStartContinue} className="w-full px-[14px] py-[13px] bg-[#B88934] hover:bg-[#DFAF32] active:bg-[#B88934] text-[#2C2313] rounded-[8px] flex gap-2 items-center justify-center textHeading16 transition duration-300 mb-[22px]">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.25732 1.49952C5.65319 1.50087 6.04187 1.6069 6.38379 1.80641L15.3794 7.05348H15.3801C15.7207 7.25111 16.0038 7.53483 16.2004 7.87599C16.3971 8.21715 16.5004 8.60426 16.5007 8.99806C16.5011 9.39181 16.398 9.77866 16.2019 10.1201C16.0303 10.4189 15.793 10.6739 15.5083 10.8657L15.3838 10.9441L6.38379 16.1941C6.04193 16.3935 5.6531 16.4989 5.25732 16.5003C4.86159 16.5015 4.47255 16.3985 4.12939 16.2014C3.78617 16.0043 3.50075 15.7201 3.30249 15.3775C3.10422 15.0348 2.99988 14.6454 3 14.2495V3.75026C2.99988 3.35446 3.10432 2.96567 3.30249 2.62306C3.50076 2.28039 3.78611 1.99556 4.12939 1.79835C4.47254 1.60128 4.86162 1.49824 5.25732 1.49952ZM4.5 14.2503C4.49997 14.3822 4.535 14.5118 4.60107 14.626C4.66716 14.7402 4.76206 14.8349 4.87647 14.9006C4.99079 14.9663 5.12035 15.0006 5.2522 15.0003C5.3841 14.9998 5.51399 14.9649 5.62793 14.8984L14.6279 9.64845L14.6287 9.64772C14.742 9.58165 14.8358 9.48681 14.9011 9.37306C14.9664 9.25933 15.0008 9.13064 15.0007 8.99952C15.0006 8.86826 14.9659 8.73898 14.9004 8.62526C14.8348 8.51161 14.7407 8.41718 14.6272 8.35133L14.6257 8.3506L5.62793 3.10206C5.51395 3.03555 5.38416 2.99997 5.2522 2.99952C5.12038 2.99914 4.99077 3.03348 4.87647 3.09913C4.7621 3.16483 4.66716 3.25966 4.60107 3.37379C4.53502 3.48795 4.5 3.61763 4.5 3.74952V14.2503Z" fill="currentColor" />
              </svg>
              <span>{completedLessons > 0 ? "Continue Program" : "Start Program"}</span>
            </button>
            <div className="flex flex-col gap-y-2">
              <div className="flex justify-between textLabel16">
                <span className="text-[#ABADAF]">Progress</span>
                <span className="text-[#DFE1E3]">{progressPercent}%</span>
              </div>
              <ProgressBar percentage={progressPercent} height={10} />
              <p className="text-[#ABADAF] textLabel14">
                {completedLessons} of {totalLessons} lesson{totalLessons !== 1 ? "s" : ""} completed
              </p>
            </div>
          </div>

          {/* Program details */}
          <div className="border-2 border-[#26282A] bg-[#1C1E20] rounded-[12px] p-[26px] flex flex-col gap-y-5">
            <p className="text-[#FFFFFF] textHeading20">Program Details</p>
            <div className="flex gap-4 items-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.332 3.33317C12.669 3.33317 12.0333 3.59675 11.5645 4.06559C11.0956 4.53443 10.832 5.17013 10.832 5.83317V14.6141C11.3346 14.3239 11.9083 14.1665 12.4987 14.1665H17.4987V3.33317H13.332ZM2.4987 14.1665H7.4987C8.08906 14.1665 8.66284 14.3239 9.16537 14.6141V5.83317C9.16537 5.17013 8.90178 4.53443 8.43294 4.06559C7.9641 3.59675 7.32841 3.33317 6.66536 3.33317H2.4987V14.1665ZM19.1654 14.1665C19.1654 14.6085 18.9896 15.0323 18.6771 15.3449C18.3645 15.6575 17.9407 15.8332 17.4987 15.8332H12.4987C12.0567 15.8332 11.6329 16.0089 11.3203 16.3215C11.0078 16.634 10.832 17.0578 10.832 17.4998C10.832 17.9601 10.4589 18.3332 9.9987 18.3332C9.53846 18.3332 9.16537 17.9601 9.16537 17.4998C9.16537 17.0578 8.98964 16.634 8.67708 16.3215C8.36452 16.0089 7.94073 15.8332 7.4987 15.8332H2.4987C2.05667 15.8332 1.63287 15.6575 1.32031 15.3449C1.00775 15.0323 0.832031 14.6085 0.832031 14.1665V3.33317C0.832031 2.89114 1.00775 2.46735 1.32031 2.15479C1.63287 1.84222 2.05667 1.6665 2.4987 1.6665H6.66536C7.77043 1.6665 8.82993 2.10581 9.61133 2.88721C9.75172 3.0276 9.88097 3.17697 9.9987 3.33398C10.1164 3.17697 10.2457 3.0276 10.3861 2.88721C11.1675 2.10581 12.227 1.6665 13.332 1.6665H17.4987C17.9407 1.6665 18.3645 1.84222 18.6771 2.15479C18.9896 2.46735 19.1654 2.89114 19.1654 3.33317V14.1665Z" fill="#B88934" />
              </svg>
              <span className="text-[#ABADAF] textLabel14">{modules.length} module{modules.length !== 1 ? "s" : ""}</span>
            </div>
            <div className="flex gap-4 items-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5.84017 1.66603C6.28002 1.66752 6.71188 1.78534 7.0918 2.00701L17.0869 7.83709H17.0877C17.4662 8.05668 17.7807 8.37193 17.9992 8.75099C18.2177 9.13006 18.3325 9.56018 18.3328 9.99774C18.3332 10.4352 18.2187 10.8651 18.0008 11.2445C17.8102 11.5765 17.5464 11.8598 17.2301 12.0729L17.0918 12.16L7.0918 17.9933C6.71195 18.2149 6.27992 18.332 5.84017 18.3335C5.40047 18.3349 4.9682 18.2205 4.58691 18.0015C4.20555 17.7824 3.88843 17.4666 3.66813 17.0859C3.44783 16.7052 3.3319 16.2726 3.33203 15.8327V4.16684C3.3319 3.72707 3.44794 3.29507 3.66813 2.9144C3.88843 2.53366 4.20549 2.21718 4.58691 1.99806C4.96818 1.77909 5.4005 1.6646 5.84017 1.66603Z" fill="#B88934" />
              </svg>
              <span className="text-[#ABADAF] textLabel14">{totalLessons} lesson{totalLessons !== 1 ? "s" : ""}</span>
            </div>
          </div>

          {/* Instructor */}
          {course.instructor && (
            <div className="border-2 border-[#26282A] bg-[#1C1E20] rounded-[12px] p-[26px] flex flex-col gap-y-5">
              <p className="text-[#FFFFFF] textHeading20">Instructor</p>
              <div className="flex gap-3 items-center">
                {course.instructor.photo ? (
                  <img
                    src={course.instructor.photo}
                    alt={instructorName}
                    className="w-[54px] h-[54px] rounded-full object-cover"
                  />
                ) : (
                  <div className="bg-[#37352B] w-[54px] h-[54px] rounded-full flex justify-center items-center flex-shrink-0">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M14 8C14 5.79086 12.2091 4 10 4C7.79086 4 6 5.79086 6 8C6 10.2091 7.79086 12 10 12C12.2091 12 14 10.2091 14 8ZM21 20C21 16.9893 19.1864 14.1394 17.4004 12.7998C17.1486 12.611 17 12.3147 17 12C17 11.6854 17.1479 11.3891 17.3994 11.2002C17.9253 10.8056 18.3461 10.2872 18.624 9.69141C18.902 9.09562 19.0287 8.44064 18.9932 7.78418C18.9576 7.12767 18.7607 6.49003 18.4199 5.92773C18.0792 5.36553 17.6054 4.89594 17.04 4.56055C16.565 4.27881 16.4077 3.66447 16.6895 3.18945C16.9712 2.71452 17.5856 2.55813 18.0605 2.83984C18.9086 3.34291 19.6198 4.04733 20.1309 4.89062C20.642 5.73409 20.9368 6.69098 20.9902 7.67578C21.0436 8.66055 20.8535 9.64336 20.4365 10.5371C20.1926 11.0599 19.8732 11.5405 19.4941 11.9697C21.3667 13.7926 23 16.777 23 20C23 20.5523 22.5523 21 22 21C21.4477 21 21 20.5523 21 20ZM16 8C16 9.94598 15.0726 11.6742 13.6367 12.7705C14.6434 13.2154 15.571 13.8424 16.3643 14.6357C18.0521 16.3236 19 18.6131 19 21C19 21.5523 18.5523 22 18 22C17.4477 22 17 21.5523 17 21C17 19.1435 16.2629 17.3626 14.9502 16.0498C13.6374 14.7371 11.8565 14 10 14C8.14348 14 6.36256 14.7371 5.0498 16.0498C3.73705 17.3626 3 19.1435 3 21C3 21.5523 2.55228 22 2 22C1.44772 22 1 21.5523 1 21C1 18.6131 1.94791 16.3236 3.63574 14.6357C4.42882 13.8427 5.35593 13.2153 6.3623 12.7705C4.92681 11.6742 4 9.9457 4 8C4 4.68629 6.68629 2 10 2C13.3137 2 16 4.68629 16 8Z" fill="#B88934" />
                    </svg>
                  </div>
                )}
                <div>
                  <p className="text-[#DFE1E3] textHeading20">{instructorName}</p>
                  {course.instructor.title && (
                    <p className="text-[#ABADAF] textBody14">{course.instructor.title}</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default function CourseOverview() {
  return (
    <Suspense>
      <CourseOverviewContent />
    </Suspense>
  );
}
