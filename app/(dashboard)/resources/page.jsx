"use client";

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getStudentResources } from "apis/student-resources.api";
import Loader from "@common/Loader";

function DocumentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#B88934" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 2V8H20" stroke="#B88934" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 13H8" stroke="#B88934" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M16 17H8" stroke="#B88934" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 9H9H8" stroke="#B88934" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="#ABADAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 3H21V9" stroke="#ABADAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 14L21 3" stroke="#ABADAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function BookIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M2 3H8C9.06087 3 10.0783 3.42143 10.8284 4.17157C11.5786 4.92172 12 5.93913 12 7V21C12 20.2044 11.6839 19.4413 11.1213 18.8787C10.5587 18.3161 9.79565 18 9 18H2V3Z" stroke="#B88934" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 3H16C14.9391 3 13.9217 3.42143 13.1716 4.17157C12.4214 4.92172 12 5.93913 12 7V21C12 20.2044 12.3161 19.4413 12.8787 18.8787C13.4413 18.3161 14.2044 18 15 18H22V3Z" stroke="#B88934" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
    >
      <path d="M6 9L12 15L18 9" stroke="#ABADAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ResourceCard({ resource }) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 bg-[#17191B] border border-[#26282A] rounded-[10px] px-4 py-4 hover:border-[#37352B] hover:bg-[#1C1E20] transition duration-200 group"
    >
      <div className="w-10 h-10 rounded-[8px] bg-[#AA7C3015] border border-[#37352B] flex items-center justify-center shrink-0">
        <DocumentIcon />
      </div>
      <p className="flex-1 textLabel14 text-[#DFE1E3] line-clamp-2 leading-snug">
        {resource.title}
      </p>
      <div className="shrink-0 opacity-60 group-hover:opacity-100 transition">
        <ExternalLinkIcon />
      </div>
    </a>
  );
}

function LessonSection({ lessonTitle, resources, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div>
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 py-3 hover:opacity-80 transition duration-200"
      >
        <BookIcon />
        <span className="flex-1 text-left textHeading16 text-[#B88934]">
          {lessonTitle}
        </span>
        <span className="textLabel12 text-[#ABADAF] bg-[#17191B] border border-[#26282A] rounded-full px-2 py-0.5 mr-2">
          {resources.length}
        </span>
        <ChevronIcon open={open} />
      </button>

      {open && (
        <div className="border border-[#26282A] rounded-[12px] px-5 pb-5 pt-4 mt-2 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            {resources.map((resource) => (
              <ResourceCard key={resource._id} resource={resource} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


export default function ResourcesPage() {
  const [filter, setFilter] = useState("all");

  const { data, isLoading, isError } = useQuery({
    queryKey: ["studentResources"],
    queryFn: getStudentResources,
  });

  // Group flat resources list by course
  const grouped = useMemo(() => {
    const raw = data?.data?.resources || [];
    const map = new Map();
    raw.forEach((r) => {
      const courseId = r.course?._id || "unknown";
      const courseTitle = r.course?.title || "General Resources";
      if (!map.has(courseId)) {
        map.set(courseId, { courseId, courseTitle, resources: [] });
      }
      map.get(courseId).resources.push(r);
    });
    return Array.from(map.values());
  }, [data]);

  const filtered =
    filter === "all"
      ? grouped
      : grouped.filter((g) => g.courseId === filter);

  return (
    <div className="min-h-screen px-6 md:px-10 py-8">
      {/* Page header */}
      <h1 className="textDisplay36 text-[#DFE1E3] mb-2">Resources</h1>
      <p className="textBody16 text-[#ABADAF] mb-8">
        Access documents, templates, and supporting materials for your courses.
      </p>

      {/* Filter bar */}
      <div className="flex items-center gap-3 mb-8">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="#ABADAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="relative">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="appearance-none bg-[#17191B] border border-[#26282A] text-[#DFE1E3] textLabel14 rounded-[8px] px-4 py-2.5 pr-9 focus:outline-none focus:border-[#B88934] cursor-pointer transition duration-200"
          >
            <option value="all">All Resources</option>
            {grouped.map((g) => (
              <option key={g.courseId} value={g.courseId}>
                {g.courseTitle}
              </option>
            ))}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 9L12 15L18 9" stroke="#ABADAF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

      {/* States */}
      {isLoading && <Loader isLoading={true} />}

      {isError && (
        <div className="text-center py-16">
          <p className="textHeading16 text-[#FF6B6B] mb-2">Failed to load resources</p>
          <p className="textBody14 text-[#ABADAF]">Please try refreshing the page.</p>
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && (
        <div className="text-center py-16">
          <BookIcon />
          <p className="textHeading16 text-[#DFE1E3] mt-4 mb-2">No resources found</p>
          <p className="textBody14 text-[#ABADAF]">Resources will appear here once they are published.</p>
        </div>
      )}

      {!isLoading && !isError && filtered.length > 0 && (
        <div className="flex flex-col gap-4">
          {filtered.map((group, i) => (
            <LessonSection
              key={group.courseId}
              lessonTitle={group.courseTitle}
              resources={group.resources}
              defaultOpen={i === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
}
