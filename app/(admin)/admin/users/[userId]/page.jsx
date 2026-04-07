"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getStudentOverview } from "apis/admin-dashboard.api";
import Loader from "@common/Loader";

function timeAgo(dateStr) {
  if (!dateStr) return "—";
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const ACTION_LABELS = {
  watched: "Watched lesson",
  completed: "Completed lesson",
  started: "Started course",
  enrolled: "Enrolled in course",
};

export default function StudentOverviewPage() {
  const { userId } = useParams();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["studentOverview", userId],
    queryFn: getStudentOverview,
    enabled: !!userId,
  });

  const user = data?.data?.user;
  const stats = data?.data?.stats;
  const recentActivity = data?.data?.recentActivity || [];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader isLoading={true} />
      </div>
    );
  }

  if (isError || !user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-[#ABADAF] textBody16">Failed to load student overview.</p>
      </div>
    );
  }

  return (
    <section className="px-9 py-10 flex flex-col gap-8">
      {/* Back */}
      <button
        onClick={() => router.back()}
        className="w-fit py-2.5 px-[14px] flex gap-2 items-center textLabel16 text-[#DFE1E3] rounded-[8px] bg-transparent hover:bg-[#313335] active:bg-transparent transition duration-300"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.46967 3.21967C8.76256 2.92678 9.23732 2.92678 9.53022 3.21967C9.82311 3.51256 9.82311 3.98732 9.53022 4.28022L5.56049 8.24994H14.2499C14.6642 8.24994 14.9999 8.58573 14.9999 8.99994C14.9999 9.41416 14.6642 9.74994 14.2499 9.74994H5.56049L9.53022 13.7197C9.82311 14.0126 9.82311 14.4873 9.53022 14.7802C9.23732 15.0731 8.76256 15.0731 8.46967 14.7802L3.21967 9.53022C2.92678 9.23732 2.92678 8.76256 3.21967 8.46967L8.46967 3.21967Z" fill="currentColor" />
        </svg>
        Back
      </button>

      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
        {user.profilePhoto ? (
          <img
            src={user.profilePhoto}
            alt={user.firstName}
            className="w-[72px] h-[72px] rounded-full object-cover border-2 border-[#313335]"
          />
        ) : (
          <div className="w-[72px] h-[72px] rounded-full bg-[#26282A] border-2 border-[#313335] flex items-center justify-center text-[#B88934] textHeading28 !font-bold">
            {user.firstName?.[0]}{user.lastName?.[0]}
          </div>
        )}
        <div>
          <h2 className="text-[#EFEFEE] textDisplay36">{user.firstName} {user.lastName}</h2>
          <p className="text-[#ABADAF] textBody16 mt-1">@{user.username} · {user.email}</p>
          <div className="flex gap-3 mt-2 flex-wrap">
            <span className={`textLabel12 px-2 py-0.5 rounded-full border ${user.status === "active" ? "text-[#6FCF6F] border-[#1E3A1E] bg-[#0D1A0D]" : "text-[#ABADAF] border-[#26282A] bg-[#1C1E20]"}`}>
              {user.status}
            </span>
            <span className="text-[#5A5C5E] textBody12">Joined {formatDate(user.createdAt)}</span>
            <span className="text-[#5A5C5E] textBody12">Last login {timeAgo(user.lastLogin)}</span>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid gap-5 [grid-template-columns:repeat(1,minmax(0,1fr))] sm:[grid-template-columns:repeat(3,minmax(0,1fr))]">
        <div className="bg-[#1C1E20] border-2 border-[#26282A] rounded-[16px] p-5 flex flex-col gap-1">
          <p className="text-[#ABADAF] textHeading16">Enrolled Courses</p>
          <p className="text-[#EFEFEE] textHeading28 !font-bold">{stats?.enrolledCourses ?? "—"}</p>
        </div>
        <div className="bg-[#1C1E20] border-2 border-[#26282A] rounded-[16px] p-5 flex flex-col gap-1">
          <p className="text-[#ABADAF] textHeading16">Completed Lessons</p>
          <p className="text-[#EFEFEE] textHeading28 !font-bold">{stats?.completedLessons ?? "—"}</p>
        </div>
        <div className="bg-[#1C1E20] border-2 border-[#26282A] rounded-[16px] p-5 flex flex-col gap-1">
          <p className="text-[#ABADAF] textHeading16">In Progress</p>
          <p className="text-[#EFEFEE] textHeading28 !font-bold">{stats?.inProgress ?? "—"}</p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#181818] border-2 border-[#2E2D26] rounded-[16px] p-8">
        <h3 className="text-[#DFE1E3] textDisplay22 mb-6">Recent Activity</h3>
        {recentActivity.length === 0 ? (
          <p className="text-[#ABADAF] textBody16">No activity recorded yet.</p>
        ) : (
          <div className="flex flex-col gap-3">
            {recentActivity.map((entry) => (
              <div
                key={entry._id}
                className="flex gap-4 items-start p-3 rounded-[10px] bg-[#1C1E20] border border-[#26282A]"
              >
                <div className="w-[8px] h-[8px] rounded-full bg-[#B88934] mt-[6px] shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-[#DFE1E3] textLabel14">
                    {ACTION_LABELS[entry.action] || entry.action}
                    {entry.lesson?.title && (
                      <span className="text-[#ABADAF]"> — {entry.lesson.title}</span>
                    )}
                  </p>
                  {entry.course?.title && (
                    <p className="text-[#5A5C5E] textBody12 mt-0.5">{entry.course.title}</p>
                  )}
                </div>
                <span className="text-[#5A5C5E] textBody12 shrink-0">{timeAgo(entry.createdAt)}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
