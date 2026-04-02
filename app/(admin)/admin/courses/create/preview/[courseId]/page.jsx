"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import { getAdminCourseEditor, updateAdminCourse } from "apis/admin-courses.api";

// ─── Step Indicator ───────────────────────────────────────────────────────────
const STEPS = [
  { number: 1, label: "Course Overview" },
  { number: 2, label: "Curriculum" },
  { number: 3, label: "Preview" },
];

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center w-full py-2">
      {STEPS.map((step, idx) => {
        const isActive = step.number === currentStep;
        const isDone = step.number < currentStep;
        return (
          <div key={step.number} className="flex items-center" style={{ flex: idx < STEPS.length - 1 ? "1" : "none" }}>
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={
                  isDone
                    ? { background: "#37352B" }
                    : isActive
                    ? { background: "#2C2313", border: "1px solid #765D2E" }
                    : { background: "#1C1E20" }
                }
              >
                {isDone ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 13L9 17L19 7" stroke="#B88934" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span className="text-[14px]" style={{ color: isActive ? "#FFFAFA" : "#868889" }}>
                    {step.number}
                  </span>
                )}
              </div>
              <span
                className="text-[14px] font-medium whitespace-nowrap"
                style={{ color: isDone ? "#ABADAF" : isActive ? "#DFE1E3" : "#868889" }}
              >
                {step.label}
              </span>
            </div>
            {idx < STEPS.length - 1 && (
              <div
                className="flex-1 mx-3 min-w-[40px]"
                style={{ height: 0, borderTop: `1px solid ${isDone ? "#AE9060" : "#37352B"}` }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function PreviewPage() {
  const router = useRouter();
  const { courseId } = useParams();
  const [activeLessonId, setActiveLessonId] = useState(null);

  const { data: editorData, isLoading } = useQuery({
    queryKey: ["admin-course-editor", courseId],
    queryFn: () => getAdminCourseEditor(courseId),
    enabled: !!courseId,
  });

  const course = editorData?.data?.course;
  const modules = editorData?.data?.modules ?? [];

  // Flatten all lessons to find the active one
  const allLessons = modules.flatMap((m) => m.lessons || []);
  const activeLesson = activeLessonId
    ? allLessons.find((l) => l._id === activeLessonId)
    : allLessons[0] ?? null;

  const { mutate: doPublish, isPending: isPublishing } = useMutation({
    mutationFn: updateAdminCourse,
    onSuccess: () => {
      router.push("/admin/courses");
    },
  });

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen" style={{ background: "#121415" }}>
        <span className="text-[#868889] text-[16px]">Loading preview...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen" style={{ background: "#121415" }}>
      {/* ── Header ── */}
      <div className="flex items-center justify-between px-9 py-[22px]" style={{ borderBottom: "1px solid #1C1E20" }}>
        <button
          type="button"
          onClick={() => router.push("/admin/courses")}
          className="flex items-center gap-2 text-[16px] font-medium text-[#DFE1E3] hover:text-white transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Programs
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.push(`/admin/courses/create/curriculum/${courseId}`)}
            className="flex items-center gap-2 px-[14px] py-3 rounded-[8px] text-[16px] font-medium text-[#DFE1E3] transition-colors hover:bg-[#1C1E20]"
            style={{ border: "1.8px solid #ABADAF" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to Curriculum
          </button>
          <button
            type="button"
            onClick={() => doPublish({ courseId, data: { status: "published" } })}
            disabled={isPublishing}
            className="flex items-center gap-2 px-[14px] py-3 rounded-[8px] text-[16px] font-semibold transition-colors hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "#B88934", color: "#2C2313" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 12C5 12 6 7 12 7C18 7 19 12 19 12C19 12 18 17 12 17C6 17 5 12 5 12Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.8" />
            </svg>
            {isPublishing ? "Publishing..." : "Publish Course"}
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex flex-col px-9 py-7 gap-7">
        <StepIndicator currentStep={3} />

        <div className="flex flex-col lg:flex-row gap-[30px]">

          {/* ── Left: video + details ── */}
          <div className="w-full lg:w-[68%]">

            {/* Video player or placeholder */}
            {activeLesson?.videoEmbed ? (
              <div className="w-full rounded-[12px] overflow-hidden" style={{ aspectRatio: "16/9" }}>
                <iframe
                  src={activeLesson.videoEmbed}
                  className="w-full h-full"
                  frameBorder="0"
                  allow="autoplay; fullscreen; picture-in-picture"
                  allowFullScreen
                  title={activeLesson.title}
                />
              </div>
            ) : (
              <div
                className="w-full rounded-[12px] flex flex-col items-center justify-center gap-4"
                style={{ aspectRatio: "16/9", background: "#1C1E20", border: "1px solid #313335" }}
              >
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center"
                  style={{ background: "rgba(184,137,52,0.15)", border: "1.5px solid #B88934" }}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M5 3L19 12L5 21V3Z" fill="#B88934" />
                  </svg>
                </div>
                <p className="text-[15px] text-[#868889]">{activeLesson?.title || "No lesson selected"}</p>
                <p className="text-[13px] text-[#5A5C5E]">No video URL set for this lesson</p>
              </div>
            )}

            {/* Title + actions */}
            <div className="flex flex-col 2xl:flex-row gap-6 justify-between items-start mt-6 mb-6">
              <div className="w-full 2xl:w-7/12">
                <h3 className="text-[28px] font-bold text-white leading-tight">
                  {activeLesson?.title || course?.title || ""}
                </h3>
                <p className="text-[15px] text-[#ABADAF] mt-2">
                  Preview mode — this is how students will see this lesson.
                </p>
              </div>

              <div className="flex gap-2.5 items-center flex-wrap">
                <div
                  className="px-[14px] py-2.5 flex gap-2 items-center rounded-[8px] border-2 text-[15px] font-medium select-none opacity-60 cursor-not-allowed"
                  style={{ background: "#271C13", borderColor: "#50392A", color: "#FFEEEF" }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Mark Complete
                </div>
                <div
                  className="px-[14px] py-2.5 flex gap-2 items-center rounded-[8px] border-2 text-[15px] font-medium select-none opacity-60 cursor-not-allowed"
                  style={{ borderColor: "#ABADAF", color: "#DFE1E3" }}
                >
                  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                    <path d="M3 3V8.25H6.75V3H3ZM8.25 8.25C8.25 9.07843 7.57843 9.75 6.75 9.75H3C2.17157 9.75 1.5 9.07843 1.5 8.25V3C1.5 2.17157 2.17157 1.5 3 1.5H6.75C7.57843 1.5 8.25 2.17157 8.25 3V8.25Z" fill="currentColor" />
                    <path d="M11.25 3V5.25H15V3H11.25ZM16.5 5.25C16.5 6.07843 15.8284 6.75 15 6.75H11.25C10.4216 6.75 9.75 6.07843 9.75 5.25V3C9.75 2.17157 10.4216 1.5 11.25 1.5H15C15.8284 1.5 16.5 2.17157 16.5 3V5.25Z" fill="currentColor" />
                    <path d="M11.25 9.75V15H15V9.75H11.25ZM16.5 15C16.5 15.8284 15.8284 16.5 15 16.5H11.25C10.4216 16.5 9.75 15.8284 9.75 15V9.75C9.75 8.92157 10.4216 8.25 11.25 8.25H15C15.8284 8.25 16.5 8.92157 16.5 9.75V15Z" fill="currentColor" />
                    <path d="M3 12.75V15H6.75V12.75H3ZM8.25 15C8.25 15.8284 7.57843 16.5 6.75 16.5H3C2.17157 16.5 1.5 15.8284 1.5 15V12.75C1.5 11.9216 2.17157 11.25 3 11.25H6.75C7.57843 11.25 8.25 11.9216 8.25 12.75V15Z" fill="currentColor" />
                  </svg>
                  Video issues?
                </div>
              </div>
            </div>

            {/* Resources (from active lesson — not loaded in editor API, shown as empty) */}
            <div className="flex gap-2 items-center mb-4">
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                <path d="M2.75 18.3332V3.6665C2.75 2.93716 3.03994 2.23789 3.55566 1.72217C4.07139 1.20644 4.77066 0.916504 5.5 0.916504H12.8333V0.917399C13.2439 0.916929 13.6509 0.996568 14.0302 1.15373C14.4094 1.31088 14.7537 1.54165 15.0435 1.83228L18.3306 5.11938L18.4372 5.23039C18.6792 5.49604 18.8738 5.80189 19.0119 6.13452C19.1695 6.51432 19.2505 6.92198 19.25 7.33317V18.3332C19.25 19.0625 18.9601 19.7618 18.4443 20.2775C17.9286 20.7932 17.2293 21.0832 16.5 21.0832H5.5C4.77065 21.0832 4.07139 20.7932 3.55566 20.2775C3.03994 19.7618 2.75 19.0625 2.75 18.3332Z" stroke="#B88934" strokeWidth="1.5" />
                <path d="M14.6667 14.6665H7.33333M14.6667 10.9998H7.33333M9.16667 7.33317H7.33333" stroke="#B88934" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span className="text-[#DFE1E3] text-[18px] font-semibold">Resources</span>
            </div>
            {allLessons.length === 0 || !activeLesson ? (
              <p className="text-[14px] text-[#5A5C5E]">No resources available.</p>
            ) : (
              <p className="text-[14px] text-[#5A5C5E]">Resources will appear here once the course is published.</p>
            )}
          </div>

          {/* ── Right: course sidebar ── */}
          <div className="w-full lg:w-[32%] lg:max-h-[calc(100vh-180px)] lg:overflow-y-auto scrollbar-thin">
            <h1 className="text-white text-[18px] font-bold mb-6">Course Content</h1>

            {modules.length === 0 ? (
              <p className="text-[14px] text-[#5A5C5E]">No modules yet.</p>
            ) : (
              <div className="flex flex-col gap-5">
                {modules.map((module, mi) => (
                  <div key={module._id}>
                    <div className="flex justify-between items-start gap-3 mb-3 px-1">
                      <p className="text-[#DFE1E3] text-[14px] font-semibold flex-1">
                        {module.title || `Module ${mi + 1}`}
                      </p>
                      <p className="text-[#ABADAF] text-[12px] font-semibold whitespace-nowrap mt-0.5">
                        {(module.lessons || []).length} {(module.lessons || []).length !== 1 ? "lessons" : "lesson"}
                      </p>
                    </div>

                    <div className="flex flex-col gap-2">
                      {(module.lessons || []).map((lesson, li) => {
                        const isActive = activeLesson?._id === lesson._id;
                        return (
                          <button
                            key={lesson._id}
                            onClick={() => setActiveLessonId(lesson._id)}
                            className={`p-3 border-2 rounded-[12px] flex gap-3 items-center text-start transition duration-200 w-full ${
                              isActive ? "border-[#50392A]" : "border-[#313335] hover:border-[#50392A]"
                            }`}
                            style={
                              isActive
                                ? { background: "linear-gradient(180deg, rgba(170,124,48,0.3) 0%, rgba(170,124,48,0.15) 100%)" }
                                : { background: "#1C1E20" }
                            }
                          >
                            {/* Thumbnail placeholder */}
                            <div
                              className="relative w-[100px] h-[68px] rounded-[8px] flex-shrink-0 overflow-hidden flex items-center justify-center"
                              style={{ background: "#37352B" }}
                            >
                              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                <div className="w-[26px] h-[26px] bg-[#EFEFEE] rounded-full flex items-center justify-center">
                                  <svg width="11" height="11" viewBox="0 0 20 20" fill="none">
                                    <path d="M3.33203 3.45952V17.0014C3.33203 17.7748 4.17242 18.2555 4.83905 17.8634L16.0689 11.2575C16.718 10.8757 16.7281 9.94056 16.0874 9.54482L4.85752 2.60872C4.1913 2.19723 3.33203 2.67646 3.33203 3.45952Z" fill="black" />
                                  </svg>
                                </div>
                              </div>
                              <div className="absolute bottom-1 right-1.5 text-[#DFE1E3] text-[10px] font-bold leading-none">
                                {li + 1}
                              </div>
                            </div>

                            <p className="text-white text-[14px] font-medium line-clamp-2 flex-1">
                              {lesson.title || `Lesson ${li + 1}`}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Preview notice */}
            <div
              className="mt-6 p-3 rounded-[8px] flex gap-2 items-start"
              style={{ background: "rgba(184,137,52,0.08)", border: "1px solid #37352B" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" stroke="#B88934" strokeWidth="1.8" />
                <path d="M12 8V12M12 16H12.01" stroke="#B88934" strokeWidth="2" strokeLinecap="round" />
              </svg>
              <p className="text-[13px] text-[#868889] leading-relaxed">
                This is a preview. Interactions are disabled until the course is published.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
