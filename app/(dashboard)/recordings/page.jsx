"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { getStudentRecordings } from "apis/student-recordings.api";
import Loader from "@common/Loader";

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function RecordingCard({ recording, categoryName, onClick }) {
  return (
    <button
      onClick={onClick}
      className="w-full text-left rounded-[16px] border-2 border-[#26282A] bg-[#1C1E20] hover:border-[#B88934] transition duration-200 overflow-hidden flex flex-col group"
    >
      {/* Thumbnail / placeholder */}
      <div
        className="w-full aspect-video flex items-center justify-center flex-shrink-0 relative"
        style={{ background: "#232420" }}
      >
        <div className="w-14 h-14 rounded-full bg-[#37352B] flex items-center justify-center group-hover:bg-[#B88934] transition duration-200">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M5 3L19 12L5 21V3Z" fill="#B88934" className="group-hover:fill-[#2C2313] transition duration-200" />
          </svg>
        </div>

        {/* Category badge */}
        <div
          className="absolute top-3 left-3 text-[11px] font-semibold text-[#B88934] px-2.5 py-1 rounded-full"
          style={{ background: "rgba(55,53,43,0.9)" }}
        >
          {categoryName}
        </div>
      </div>

      {/* Info */}
      <div className="px-4 py-4 flex flex-col gap-1.5 flex-1">
        <h3 className="text-[#EFEFEE] text-[16px] font-semibold leading-snug line-clamp-2">
          {recording.title}
        </h3>
        {recording.subheading && (
          <p className="text-[#ABADAF] text-[13px] line-clamp-2 leading-relaxed">
            {recording.subheading}
          </p>
        )}
        {recording.recordedDate && (
          <p className="text-[#868889] text-[12px] mt-1">{formatDate(recording.recordedDate)}</p>
        )}
      </div>
    </button>
  );
}

export default function RecordingsPage() {
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["studentRecordings"],
    queryFn: getStudentRecordings,
  });

  const categories = data?.data?.categories ?? [];
  const hasAny = categories.some((c) => c.recordings?.length > 0);

  if (isLoading) {
    return (
      <section className="w-full flex justify-center items-center py-24">
        <Loader isLoading={true} />
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full px-9 py-10">
        <p className="text-[#ABADAF] textBody16">Failed to load recordings. Please try again.</p>
      </section>
    );
  }

  return (
    <section className="w-full px-9 py-10 flex flex-col gap-10">
      {/* Header */}
      <div>
        <h1 className="textDisplay40 text-[#EFEFEE] mb-2">Recordings</h1>
        <p className="textBody18 text-[#ABADAF]">Browse all recorded sessions and webinars</p>
      </div>

      {!hasAny ? (
        <div
          className="rounded-[16px] px-6 py-16 text-center"
          style={{ background: "#1C1E20", border: "1px solid #313335" }}
        >
          <p className="text-[#ABADAF] textBody16">No recordings available yet. Check back soon.</p>
        </div>
      ) : (
        categories
          .filter((cat) => cat.recordings?.length > 0)
          .map((category) => (
            <div key={category._id}>
              {/* Category heading */}
              <div className="flex items-center gap-3 mb-5">
                <h2 className="text-[#EFEFEE] textHeading20 !font-bold">{category.name}</h2>
                <span
                  className="text-[12px] font-semibold text-[#B88934] px-2.5 py-0.5 rounded-full"
                  style={{ background: "#37352B" }}
                >
                  {category.recordings.length}{" "}
                  {category.recordings.length === 1 ? "recording" : "recordings"}
                </span>
              </div>

              {/* Recordings grid */}
              <div
                className="grid gap-5"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                }}
              >
                {category.recordings.map((rec) => (
                  <RecordingCard
                    key={rec._id}
                    recording={rec}
                    categoryName={category.name}
                    onClick={() => router.push(`/recordings/${rec._id}`)}
                  />
                ))}
              </div>
            </div>
          ))
      )}
    </section>
  );
}
