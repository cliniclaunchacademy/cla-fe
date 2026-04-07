"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
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
  const [search, setSearch] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["studentRecordings"],
    queryFn: getStudentRecordings,
  });

  const allCategories = data?.data?.categories ?? [];

  const filteredCategories = useMemo(() => {
    const q = search.trim().toLowerCase();
    const from = dateFrom ? new Date(dateFrom) : null;
    const to = dateTo ? new Date(dateTo + "T23:59:59") : null;

    return allCategories.map((cat) => ({
      ...cat,
      recordings: (cat.recordings ?? []).filter((rec) => {
        if (q && !rec.title.toLowerCase().includes(q)) return false;
        if (from || to) {
          if (!rec.recordedDate) return false;
          const d = new Date(rec.recordedDate);
          if (from && d < from) return false;
          if (to && d > to) return false;
        }
        return true;
      }),
    }));
  }, [allCategories, search, dateFrom, dateTo]);

  const isFiltering = search.trim() || dateFrom || dateTo;
  const categories = filteredCategories;
  const hasAny = allCategories.some((c) => c.recordings?.length > 0);

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

      {/* Search + Date filters */}
      <div className="flex flex-wrap gap-3 items-center">
        {/* Title search */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-[10px] flex-1 min-w-[220px] max-w-[400px]" style={{ background: "#1C1E20", border: "1.5px solid #26282A" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#ABADAF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recordings..."
            className="bg-transparent text-[#DFE1E3] text-[15px] placeholder-[#ABADAF] outline-none w-full"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-[#5A5C5E] hover:text-[#ABADAF] flex-shrink-0 transition">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          )}
        </div>

        {/* Date from */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-[10px]" style={{ background: "#1C1E20", border: "1.5px solid #26282A" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <path d="M8 2V6M16 2V6M3 10H21M5 4H19C20.1046 4 21 4.89543 21 6V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V6C3 4.89543 3.89543 4 5 4Z" stroke="#ABADAF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="text-[#5A5C5E] text-[13px] flex-shrink-0">From</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="bg-transparent text-[#DFE1E3] text-[14px] outline-none"
            style={{ colorScheme: "dark", width: 130 }}
          />
        </div>

        {/* Date to */}
        <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-[10px]" style={{ background: "#1C1E20", border: "1.5px solid #26282A" }}>
          <span className="text-[#5A5C5E] text-[13px] flex-shrink-0">To</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="bg-transparent text-[#DFE1E3] text-[14px] outline-none"
            style={{ colorScheme: "dark", width: 130 }}
          />
        </div>

        {/* Clear */}
        {isFiltering && (
          <button
            onClick={() => { setSearch(""); setDateFrom(""); setDateTo(""); }}
            className="textLabel14 text-[#ABADAF] hover:text-[#DFE1E3] transition underline underline-offset-2"
          >
            Clear
          </button>
        )}
      </div>

      {!hasAny ? (
        <div
          className="rounded-[16px] px-6 py-16 text-center"
          style={{ background: "#1C1E20", border: "1px solid #313335" }}
        >
          <p className="text-[#ABADAF] textBody16">No recordings available yet. Check back soon.</p>
        </div>
      ) : categories.every((c) => c.recordings?.length === 0) ? (
        <div
          className="rounded-[16px] px-6 py-16 text-center"
          style={{ background: "#1C1E20", border: "1px solid #313335" }}
        >
          <p className="text-[#ABADAF] textBody16">No recordings match your search.</p>
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
