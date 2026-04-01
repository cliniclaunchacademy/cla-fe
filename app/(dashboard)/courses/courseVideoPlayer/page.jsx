"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getStudentLesson,
  getStudentCourseById,
  markLessonComplete,
  flagLessonVideo,
} from "apis/student-courses.api";
import React from "react";
import Loader from "@common/Loader";

function getVimeoEmbedUrl(url) {
  if (!url) return null;
  // Handles: vimeo.com/ID, vimeo.com/ID/HASH, player.vimeo.com/video/ID
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?/);
  if (!match) return null;
  const videoId = match[1];
  const hash = match[2];
  let embedUrl = `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479`;
  if (hash) embedUrl += `&h=${hash}`;
  return embedUrl;
}

export default function CourseVideoPlayer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const courseId = searchParams.get("courseId");
  const lessonId = searchParams.get("lessonId");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["student-lesson", courseId, lessonId],
    queryFn: getStudentLesson,
    enabled: !!courseId && !!lessonId,
  });

  const { data: courseData } = useQuery({
    queryKey: ["student-course", courseId],
    queryFn: getStudentCourseById,
    enabled: !!courseId,
  });

  const lesson = data?.data?.lesson;
  const resources = data?.data?.resources || [];
  const sidebar = data?.data?.sidebar || [];
  const course = courseData?.data?.course;

  // Build sequential lesson numbers across all modules
  let lessonCounter = 0;
  const sidebarWithNumbers = sidebar.map((module) => ({
    ...module,
    lessons: (module.lessons || []).map((l) => ({
      ...l,
      number: ++lessonCounter,
    })),
  }));

  const { mutate: complete, isPending: completing } = useMutation({
    mutationFn: markLessonComplete,
  });

  const { mutate: flagVideo, isPending: flagging } = useMutation({
    mutationFn: flagLessonVideo,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader isLoading={true} />
      </div>
    );
  }

  if (isError || !lesson) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-[#ABADAF] textBody16">
          Failed to load lesson. Please try again.
        </p>
      </div>
    );
  }

  return (
    <section className="px-9 py-10">
      <button
        onClick={() => router.push(`/courses/courseOverview?id=${courseId}`)}
        className="w-fit py-2.5 px-[14px] flex gap-2 items-center textLabel16 text-[#DFE1E3] rounded-[8px] bg-transparent hover:bg-[#313335] active:bg-transparent transition duration-300 mb-7"
      >
        <span>
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8.46967 3.21967C8.76256 2.92678 9.23732 2.92678 9.53022 3.21967C9.82311 3.51256 9.82311 3.98732 9.53022 4.28022L5.56049 8.24994H14.2499C14.6642 8.24994 14.9999 8.58573 14.9999 8.99994C14.9999 9.41416 14.6642 9.74994 14.2499 9.74994H5.56049L9.53022 13.7197C9.82311 14.0126 9.82311 14.4873 9.53022 14.7802C9.23732 15.0731 8.76256 15.0731 8.46967 14.7802L3.21967 9.53022C2.92678 9.23732 2.92678 8.76256 3.21967 8.46967L8.46967 3.21967Z"
              fill="currentColor"
            />
          </svg>
        </span>
        <span>Back to Programs</span>
      </button>

      <div className="flex flex-col lg:flex-row gap-[30px]">
        {/* Main content */}
        <div className="w-full lg:w-[68%]">
          {/* Video */}
          {(() => {
            const embedUrl = getVimeoEmbedUrl(lesson.videoEmbed);
            return embedUrl ? (
              <div
                className="w-full rounded-[12px] overflow-hidden"
                style={{ padding: "56.25% 0 0 0", position: "relative" }}
              >
                <iframe
                  src={embedUrl}
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                  }}
                  title={lesson.title}
                />
              </div>
            ) : (
              <div className="w-full aspect-video bg-[#1C1E20] rounded-[12px] flex items-center justify-center">
                <p className="text-[#ABADAF] textBody16">No video available</p>
              </div>
            );
          })()}

          {/* Title + Actions */}
          <div className="flex flex-col 2xl:flex-row gap-6 justify-between items-start mt-6 mb-[21px]">
            <div className="w-full 2xl:w-7/12">
              <h3 className="textDisplay36 text-[#FFFFFF]">{lesson.title}</h3>
              {lesson.subheading && (
                <p className="textBody16 text-[#ABADAF] mt-2">
                  {lesson.subheading}
                </p>
              )}
            </div>

            <div className="flex gap-2.5 items-center flex-wrap">
              <button
                onClick={() => complete({ courseId, lessonId })}
                disabled={completing}
                className="px-[14px] py-2.5 flex gap-2 items-center bg-[#271C13] hover:bg-[#313335] active:bg-transparent rounded-[8px] border-2 border-[#50392A] text-[#FFEEEF] textLabel16 transition duration-200 disabled:opacity-60"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g clipPath="url(#clip_mc)">
                    <path
                      d="M7.71625 0.848019C9.58029 0.554348 11.4885 0.909111 13.123 1.85217C13.4817 2.05912 13.6051 2.51736 13.3984 2.8761C13.1914 3.23487 12.7325 3.35776 12.3737 3.15075C11.0365 2.3792 9.47495 2.08949 7.94989 2.32971C6.4248 2.56998 5.0279 3.32597 3.99262 4.47131C2.95735 5.6167 2.34588 7.08259 2.26044 8.62414C2.17502 10.1657 2.62072 11.6904 3.52313 12.9432C4.42555 14.1959 5.73046 15.1016 7.21967 15.5089C8.70887 15.9161 10.2929 15.8006 11.7072 15.1815C13.1216 14.5624 14.2811 13.4766 14.9921 12.1061C15.7031 10.7356 15.9222 9.16282 15.614 7.65002C15.5313 7.24424 15.7934 6.84807 16.1992 6.76526C16.605 6.68256 17.0012 6.94462 17.0839 7.35046C17.4607 9.19952 17.192 11.1217 16.3229 12.7967C15.4539 14.4718 14.0372 15.7988 12.3085 16.5555C10.58 17.3122 8.64424 17.4531 6.82416 16.9554C5.00397 16.4576 3.4088 15.3511 2.30585 13.8199C1.20291 12.2888 0.658265 10.4255 0.762636 8.54138C0.867033 6.6572 1.61471 4.86565 2.88007 3.46569C4.14541 2.06582 5.85224 1.14169 7.71625 0.848019ZM15.9684 2.4696C16.2614 2.17704 16.7362 2.17685 17.029 2.4696C17.3219 2.76249 17.3219 3.23799 17.029 3.53088L9.52899 11.0309C9.23621 11.3236 8.76135 11.3234 8.46845 11.0309L6.21845 8.78088C5.92555 8.48799 5.92555 8.01249 6.21845 7.7196C6.51135 7.42704 6.98621 7.42685 7.27899 7.7196L8.99872 9.43933L15.9684 2.4696Z"
                      fill="#FFEEEF"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip_mc">
                      <rect width="18" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
                <span>{completing ? "Marking..." : "Mark Complete"}</span>
              </button>
              <button
                onClick={() => flagVideo({ courseId, lessonId })}
                disabled={flagging}
                className="px-[14px] py-2.5 flex gap-2 items-center bg-transparent hover:bg-[#313335] active:bg-transparent rounded-[8px] border-2 border-[#ABADAF] text-[#DFE1E3] textLabel16 transition duration-200 disabled:opacity-60"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3 3V8.25H6.75V3H3ZM8.25 8.25C8.25 9.07843 7.57843 9.75 6.75 9.75H3C2.17157 9.75 1.5 9.07843 1.5 8.25V3C1.5 2.17157 2.17157 1.5 3 1.5H6.75C7.57843 1.5 8.25 2.17157 8.25 3V8.25Z"
                    fill="#DFE1E3"
                  />
                  <path
                    d="M11.25 3V5.25H15V3H11.25ZM16.5 5.25C16.5 6.07843 15.8284 6.75 15 6.75H11.25C10.4216 6.75 9.75 6.07843 9.75 5.25V3C9.75 2.17157 10.4216 1.5 11.25 1.5H15C15.8284 1.5 16.5 2.17157 16.5 3V5.25Z"
                    fill="#DFE1E3"
                  />
                  <path
                    d="M11.25 9.75V15H15V9.75H11.25ZM16.5 15C16.5 15.8284 15.8284 16.5 15 16.5H11.25C10.4216 16.5 9.75 15.8284 9.75 15V9.75C9.75 8.92157 10.4216 8.25 11.25 8.25H15C15.8284 8.25 16.5 8.92157 16.5 9.75V15Z"
                    fill="#DFE1E3"
                  />
                  <path
                    d="M3 12.75V15H6.75V12.75H3ZM8.25 15C8.25 15.8284 7.57843 16.5 6.75 16.5H3C2.17157 16.5 1.5 15.8284 1.5 15V12.75C1.5 11.9216 2.17157 11.25 3 11.25H6.75C7.57843 11.25 8.25 11.9216 8.25 12.75V15Z"
                    fill="#DFE1E3"
                  />
                </svg>
                <span>{flagging ? "Flagging..." : "Video issues?"}</span>
              </button>
            </div>
          </div>

          {/* Resources */}
          {resources.length > 0 && (
            <>
              <div className="flex gap-2 items-center mb-4">
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 22 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M2.75 18.3332V3.6665C2.75 2.93716 3.03994 2.23789 3.55566 1.72217C4.07139 1.20644 4.77066 0.916504 5.5 0.916504H12.8333V0.917399C13.2439 0.916929 13.6509 0.996568 14.0302 1.15373C14.4094 1.31088 14.7537 1.54165 15.0435 1.83228L18.3306 5.11938L18.4372 5.23039C18.6792 5.49604 18.8738 5.80189 19.0119 6.13452C19.1695 6.51432 19.2505 6.92198 19.25 7.33317V18.3332C19.25 19.0625 18.9601 19.7618 18.4443 20.2775C17.9286 20.7932 17.2293 21.0832 16.5 21.0832H5.5C4.77065 21.0832 4.07139 20.7932 3.55566 20.2775C3.03994 19.7618 2.75 19.0625 2.75 18.3332ZM14.6667 14.6665C15.1729 14.6665 15.5833 15.0769 15.5833 15.5832C15.5833 16.0894 15.1729 16.4998 14.6667 16.4998H7.33333C6.82707 16.4998 6.41667 16.0894 6.41667 15.5832C6.41667 15.0769 6.82707 14.6665 7.33333 14.6665H14.6667ZM14.6667 10.9998C15.1729 10.9998 15.5833 11.4102 15.5833 11.9165C15.5833 12.4228 15.1729 12.8332 14.6667 12.8332H7.33333C6.82707 12.8332 6.41667 12.4228 6.41667 11.9165C6.41667 11.4102 6.82707 10.9998 7.33333 10.9998H14.6667ZM9.16667 7.33317C9.67293 7.33317 10.0833 7.74358 10.0833 8.24984C10.0833 8.7561 9.67293 9.1665 9.16667 9.1665H7.33333C6.82707 9.1665 6.41667 8.7561 6.41667 8.24984C6.41667 7.74358 6.82707 7.33317 7.33333 7.33317H9.16667ZM17.0353 6.4165L13.75 3.13118V6.4165H17.0353ZM4.58333 18.3332C4.58333 18.5763 4.67998 18.8094 4.85189 18.9813C5.0238 19.1532 5.25689 19.2498 5.5 19.2498H16.5C16.7431 19.2498 16.9762 19.1532 17.1481 18.9813C17.32 18.8094 17.4167 18.5763 17.4167 18.3332V8.24984H13.75C13.2638 8.24984 12.7976 8.05654 12.4538 7.71273C12.11 7.36891 11.9167 6.90273 11.9167 6.4165V2.74984H5.5C5.25689 2.74984 5.0238 2.84648 4.85189 3.01839C4.67998 3.1903 4.58333 3.42339 4.58333 3.6665V18.3332Z"
                    fill="#B88934"
                  />
                </svg>
                <span className="text-[#DFE1E3] textDisplay22">Resources</span>
              </div>
              <div className="flex flex-wrap gap-3">
                {resources.map((resource) => (
                  <a
                    key={resource._id}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex gap-2 items-center text-[#DFE1E3] textLabel16 px-5 py-2.5 border-[1.5px] border-[#313335] rounded-[8px] hover:bg-[#313335] active:bg-transparent transition duration-200"
                  >
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 18 18"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M1.5 14.25V11.25C1.5 10.8358 1.83579 10.5 2.25 10.5C2.66421 10.5 3 10.8358 3 11.25V14.25C3 14.4489 3.07907 14.6396 3.21973 14.7803C3.36038 14.9209 3.55109 15 3.75 15H14.25C14.4489 15 14.6396 14.9209 14.7803 14.7803C14.9209 14.6396 15 14.4489 15 14.25V11.25C15 10.8358 15.3358 10.5 15.75 10.5C16.1642 10.5 16.5 10.8358 16.5 11.25V14.25C16.5 14.8467 16.2628 15.4189 15.8408 15.8408C15.4189 16.2628 14.8467 16.5 14.25 16.5H3.75C3.15326 16.5 2.58114 16.2628 2.15918 15.8408C1.73722 15.4189 1.5 14.8467 1.5 14.25ZM8.25 2.25C8.25 1.83579 8.58579 1.5 9 1.5C9.41421 1.5 9.75 1.83579 9.75 2.25V9.43945L12.2197 6.96973C12.5126 6.67683 12.9874 6.67683 13.2803 6.96973C13.5732 7.26262 13.5732 7.73738 13.2803 8.03027L9.53027 11.7803C9.23738 12.0732 8.76262 12.0732 8.46973 11.7803L4.71973 8.03027C4.42683 7.73738 4.42683 7.26262 4.71973 6.96973C5.01262 6.67683 5.48738 6.67683 5.78027 6.96973L8.25 9.43945V2.25Z"
                        fill="#DFE1E3"
                      />
                    </svg>
                    <span>{resource.title}</span>
                  </a>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Sidebar */}
        <div className="w-full lg:w-[32%] lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto scrollbar-thin">
          <h1 className="text-[#FFFFFF] textHeading20 !font-bold mb-6">
            {course?.title || "Course Content"}
          </h1>
          <div className="flex flex-col gap-5">
            {sidebarWithNumbers.map((module) => (
              <div key={module._id}>
                {/* Module header */}
                <div className="flex justify-between items-start gap-3 mb-3 px-1">
                  <p className="text-[#DFE1E3] textBody14 !font-semibold flex-1">
                    {module.title}
                  </p>
                  <p className="text-[#ABADAF] textBody12 !font-semibold whitespace-nowrap mt-0.5">
                    {module.lessons?.length ?? 0}{" "}
                    {module.lessons?.length !== 1 ? "lessons" : "lesson"}
                  </p>
                </div>

                {/* Lesson cards */}
                <div className="flex flex-col gap-2">
                  {module.lessons?.map((sidebarLesson) => {
                    const isActive =
                      sidebarLesson.isActive || sidebarLesson._id === lessonId;
                    return (
                      <button
                        key={sidebarLesson._id}
                        onClick={() =>
                          router.push(
                            `/courses/courseVideoPlayer?courseId=${courseId}&lessonId=${sidebarLesson._id}`
                          )
                        }
                        className={`p-3 border-2 rounded-[12px] flex gap-3 items-center text-start transition duration-200 ${
                          isActive
                            ? "bg-gradient-to-b from-[rgba(170,124,48,0.3)] to-[rgba(170,124,48,0.15)] border-[#50392A]"
                            : "bg-[#1C1E20] border-[#313335] hover:border-[#50392A]"
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative w-[100px] h-[68px] bg-[#37352B] rounded-[8px] flex-shrink-0 overflow-hidden">
                          {course?.banner && (
                            <img
                              src={course.banner}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          )}
                          {/* Overlay: checkmark if completed, play button otherwise */}
                          <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.3)]">
                            {sidebarLesson.completed ? (
                              <svg
                                width="22"
                                height="22"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                                  stroke="#B88934"
                                  strokeWidth="2.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            ) : (
                              <div className="w-[26px] h-[26px] bg-[#EFEFEE] rounded-full flex items-center justify-center">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M3.33203 3.45952V17.0014C3.33203 17.7748 4.17242 18.2555 4.83905 17.8634L16.0689 11.2575C16.718 10.8757 16.7281 9.94056 16.0874 9.54482L4.85752 2.60872C4.1913 2.19723 3.33203 2.67646 3.33203 3.45952Z"
                                    fill="black"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>
                          {/* Lesson number badge */}
                          <div className="absolute bottom-1 right-1.5 text-[#DFE1E3] text-[10px] font-bold leading-none">
                            {sidebarLesson.number}
                          </div>
                        </div>

                        {/* Title */}
                        <p className="text-[#FFFFFF] textLabel14 line-clamp-2 flex-1">
                          {sidebarLesson.title}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
