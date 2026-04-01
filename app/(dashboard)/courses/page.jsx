"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getStudentCourses } from "apis/student-courses.api";
import Loader from "@common/Loader";

const ProgressBar = ({ percentage = 0 }) => (
  <div className="w-full h-[6px] bg-[#313335] rounded-full overflow-hidden">
    <div className="h-full bg-[#B88934] rounded-full" style={{ width: `${percentage}%` }} />
  </div>
);

const LockOverlay = ({ releaseDate }) => (
  <div className="absolute top-0 left-0 w-full h-full bg-[#1D1D1DCC] backdrop-blur-[4px] flex items-center justify-center z-10">
    <div className="flex flex-col items-center gap-3">
      <svg width="72" height="72" viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="72" height="72" rx="36" fill="url(#lock_grad)" />
        <path d="M48 37.5C48 36.6716 47.3284 36 46.5 36H25.5C24.6716 36 24 36.6716 24 37.5V48C24 48.8284 24.6716 49.5 25.5 49.5H46.5C47.3284 49.5 48 48.8284 48 48V37.5ZM42 28.5C42 26.9087 41.3674 25.383 40.2422 24.2578C39.117 23.1326 37.5913 22.5 36 22.5C34.4087 22.5 32.883 23.1326 31.7578 24.2578C30.6326 25.383 30 26.9087 30 28.5V33H42V28.5ZM45 33H46.5C48.9853 33 51 35.0147 51 37.5V48C51 50.4853 48.9853 52.5 46.5 52.5H25.5C23.0147 52.5 21 50.4853 21 48V37.5C21 35.0147 23.0147 33 25.5 33H27V28.5C27 26.1131 27.9489 23.8245 29.6367 22.1367C31.3245 20.4489 33.6131 19.5 36 19.5C38.3869 19.5 40.6755 20.4489 42.3633 22.1367C44.0511 23.8245 45 26.1131 45 28.5V33Z" fill="#B88934" />
        <defs>
          <linearGradient id="lock_grad" x1="0" y1="36" x2="72" y2="36" gradientUnits="userSpaceOnUse">
            <stop stopColor="#AA7C30" stopOpacity="0.4" />
            <stop offset="1" stopColor="#AA7C30" stopOpacity="0.2" />
          </linearGradient>
        </defs>
      </svg>
      <p className="text-[#DFE1E3] textLabel16">Coming Soon</p>
      {releaseDate && (
        <p className="text-[#ABADAF] textBody14">{new Date(releaseDate).toLocaleDateString()}</p>
      )}
    </div>
  </div>
);

const CourseCard = ({ course, onClick }) => {
  const instructorName = course.instructor
    ? `${course.instructor.firstName} ${course.instructor.lastName}`
    : "Unknown";

  return (
    <div
      onClick={course.comingSoon ? undefined : onClick}
      className={`relative w-full rounded-[20px] border-2 border-[#37352B] overflow-hidden flex flex-col bg-[#1C1E20] ${!course.comingSoon ? "cursor-pointer hover:border-[#B88934] transition duration-200" : ""}`}
    >
      {/* Large portrait thumbnail */}
      <div className="w-full aspect-[3/4] overflow-hidden flex-shrink-0">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-[#26282A]" />
        )}
      </div>

      {/* Text content */}
      <div className="pt-5 ps-[22px] pr-[22px] pb-2 flex flex-col gap-2">
        <h1 className="text-[#EFEFEE] textHeading20 !font-bold leading-snug">{course.title}</h1>
        {course.subheading && (
          <p className="text-[#ABADAF] textBody14 line-clamp-2">{course.subheading}</p>
        )}
        <div className="flex items-center gap-2 text-[#ABADAF] textLabel14 mt-1">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect width="24" height="24" rx="12" fill="#37352B" />
            <path d="M13 10C13 8.89543 12.1046 8 11 8C9.89543 8 9 8.89543 9 10C9 11.1046 9.89543 12 11 12C12.1046 12 13 11.1046 13 10ZM14 10C14 10.973 13.5363 11.8371 12.8184 12.3853C13.3217 12.6077 13.7855 12.9212 14.1821 13.3179C15.026 14.1618 15.5 15.3065 15.5 16.5C15.5 16.7761 15.2761 17 15 17C14.7239 17 14.5 16.7761 14.5 16.5C14.5 15.5717 14.1315 14.6813 13.4751 14.0249C12.8187 13.3685 11.9283 13 11 13C10.0717 13 9.18128 13.3685 8.5249 14.0249C7.86853 14.6813 7.5 15.5717 7.5 16.5C7.5 16.7761 7.27614 17 7 17C6.72386 17 6.5 16.7761 6.5 16.5C6.5 15.3065 6.97396 14.1618 7.81787 13.3179C8.21441 12.9213 8.67796 12.6077 9.18115 12.3853C8.46341 11.8371 8 10.9729 8 10C8 8.34315 9.34315 7 11 7C12.6569 7 14 8.34315 14 10Z" fill="#AE9060" />
          </svg>
          <span>{instructorName}</span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto ps-[22px] pr-[22px] pb-6 pt-4 border-0 border-t-2 border-[#26282A]">
        {course.progressPercent > 0 ? (
          <div className="flex flex-col gap-1">
            <div className="flex justify-between textLabel14 text-[#ABADAF] mb-1">
              <span>Progress</span>
              <span>{course.progressPercent}%</span>
            </div>
            <ProgressBar percentage={course.progressPercent} />
            <p className="text-[#ABADAF] textLabel12 mt-1">
              {course.completedLessons} of {course.totalLessons} lessons
            </p>
          </div>
        ) : (
          <span className="inline-block px-3 py-[5px] rounded-full border border-[#2E6B3E] text-[#4CAF70] textLabel12 uppercase tracking-wide">
            {course.totalLessons ?? 0} Lessons
          </span>
        )}
      </div>

      {course.comingSoon && <LockOverlay releaseDate={course.releaseDate} />}
    </div>
  );
};

export default function Courses() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["student-courses"],
    queryFn: getStudentCourses,
  });

  const courses = data?.data?.courses || [];

  return (
    <section className="px-9 py-10">
      <div className="mb-10 flex gap-5 items-center">
        <button
          onClick={() => router.back()}
          className="bg-[#26282A] hover:bg-[#26282A]/80 active:bg-[#26282A] w-[44px] h-[44px] flex items-center justify-center rounded-full transition duration-200"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M11.2929 4.29289C11.6834 3.90237 12.3164 3.90237 12.707 4.29289C13.0975 4.68342 13.0975 5.31643 12.707 5.70696L7.41399 10.9999H18.9999C19.5522 10.9999 19.9999 11.4476 19.9999 11.9999C19.9999 12.5522 19.5522 12.9999 18.9999 12.9999H7.41399L12.707 18.2929C13.0975 18.6834 13.0975 19.3164 12.707 19.707C12.3164 20.0975 11.6834 20.0975 11.2929 19.707L4.29289 12.707C3.90237 12.3164 3.90237 11.6834 4.29289 11.2929L11.2929 4.29289Z" fill="#EFEFEE" />
          </svg>
        </button>
        <h3 className="text-[#EFEFEE] textDisplay40">Programs</h3>
      </div>

      {isLoading && (
        <div className="flex justify-center items-center h-64">
          <Loader isLoading={true} />
        </div>
      )}

      {isError && (
        <p className="text-[#ABADAF] textBody16 text-center mt-20">
          Failed to load courses. Please try again.
        </p>
      )}

      {!isLoading && !isError && courses.length === 0 && (
        <p className="text-[#ABADAF] textBody16 text-center mt-20">No courses available.</p>
      )}

      {!isLoading && !isError && courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[22px]">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onClick={() => router.push(`/courses/courseOverview?id=${course._id}`)}
            />
          ))}
        </div>
      )}
    </section>
  );
}
