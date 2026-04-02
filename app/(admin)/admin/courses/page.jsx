"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminCourses,
  createAdminCourse,
  updateAdminCourse,
  deleteAdminCourse,
  reorderAdminCourses,
  getAdminInstructors,
} from "apis/admin-courses.api";
import { useToast } from "@components/Common/Toast/ToastProvider";
import Loader from "@common/Loader";

// ─── Badges ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[8px] textLabel14 text-[#13B882] bg-[#24312D] border-2 border-[#32564A]">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M2 12C2 12 6 7 12 7C18 7 22 12 22 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8"/></svg>
        Published
      </span>
    );
  }
  if (status === "unpublished") {
    return (
      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[8px] textLabel14 text-[#ABADAF] bg-[#1C1E20] border-2 border-[#313335]">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8"/><path d="M3 3L21 21" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
        Unpublished
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-[8px] textLabel14 text-[#ABADAF] bg-[#1C1E20] border-2 border-[#313335]">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.8" strokeDasharray="4 2"/></svg>
      Draft
    </span>
  );
}

function DifficultyBadge({ difficulty }) {
  if (!difficulty) return <span className="textBody14 text-[#ABADAF]">—</span>;

  const styles = {
    beginner:     { bg: "linear-gradient(0deg,rgba(0,0,0,.2),rgba(0,0,0,.2)),#333525", border: "#514920", color: "#B59E1E" },
    intermediate: { bg: "linear-gradient(0deg,rgba(0,0,0,.2),rgba(0,0,0,.2)),#333525", border: "#514920", color: "#B59E1E" },
    advanced:     { bg: "linear-gradient(0deg,rgba(0,0,0,.2),rgba(0,0,0,.2)),#2B1F14", border: "#6B3D1A", color: "#D4843A" },
  };
  const s = styles[difficulty.toLowerCase()] || styles.beginner;
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-[8px] textLabel14 capitalize"
      style={{ background: s.bg, border: `2px solid ${s.border}`, color: s.color }}
    >
      {difficulty}
    </span>
  );
}

function InstructorAvatar({ instructor }) {
  if (!instructor) return null;
  const initial = instructor.firstName?.[0]?.toUpperCase() || "?";
  if (instructor.photo) {
    return (
      <img
        src={instructor.photo}
        alt={instructor.firstName}
        title={`${instructor.firstName} ${instructor.lastName}`}
        className="w-9 h-9 rounded-full object-cover border-2 border-[#181818]"
      />
    );
  }
  return (
    <div
      title={`${instructor.firstName} ${instructor.lastName}`}
      className="w-9 h-9 rounded-full flex items-center justify-center border-2 border-[#181818] flex-shrink-0"
      style={{ background: "linear-gradient(180deg,rgba(170,124,48,.3) 12%,rgba(170,124,48,.15) 100%)" }}
    >
      <span className="text-[15px] font-bold text-[#B88934]">{initial}</span>
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel, isLoading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#1C1E20] border border-[#313335] rounded-[14px] w-full max-w-[380px] mx-4 p-6">
        <h2 className="textHeading20 text-[#DFE1E3] mb-2">{title}</h2>
        <p className="textBody14 text-[#ABADAF] mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 textLabel14 text-[#ABADAF] border border-[#484942] rounded-[8px] py-2.5 hover:border-[#B88934] hover:text-[#B88934] transition">Cancel</button>
          <button onClick={onConfirm} disabled={isLoading} className="flex-1 textLabel14 bg-[#C0696B] hover:bg-[#d07375] text-white rounded-[8px] py-2.5 transition disabled:opacity-50 disabled:cursor-not-allowed">
            {isLoading ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Create Course Modal ──────────────────────────────────────────────────────

const EMPTY_COURSE = { title: "", subheading: "", about: "", instructorId: "", status: "draft", difficulty: "beginner", comingSoon: false };

function CourseModal({ mode, course, instructors, onClose, onSave, isSaving }) {
  const [form, setForm] = useState(
    mode === "edit" && course
      ? {
          title: course.title || "",
          subheading: course.subheading || "",
          about: course.about || "",
          instructorId: course.instructor?._id || "",
          status: course.status || "draft",
          difficulty: course.difficulty || "beginner",
          comingSoon: course.comingSoon || false,
        }
      : EMPTY_COURSE
  );

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
  };

  const inputCls = "w-full bg-[#17191B] border border-[#484942] text-[#DFE1E3] textBody14 rounded-[8px] px-3 py-2 focus:outline-none focus:border-[#B88934] transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto py-8">
      <div className="bg-[#1C1E20] border border-[#313335] rounded-[14px] w-full max-w-[520px] mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="textHeading20 text-[#DFE1E3]">{mode === "edit" ? "Edit Course" : "Create Course"}</h2>
          <button onClick={onClose} className="text-[#ABADAF] hover:text-[#DFE1E3] transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="textLabel14 text-[#ABADAF] mb-1 block">Title <span className="text-red-400">*</span></label>
            <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Course title" required className={inputCls} />
          </div>
          <div>
            <label className="textLabel14 text-[#ABADAF] mb-1 block">Subheading</label>
            <input value={form.subheading} onChange={(e) => set("subheading", e.target.value)} placeholder="Short description" className={inputCls} />
          </div>
          <div>
            <label className="textLabel14 text-[#ABADAF] mb-1 block">About</label>
            <textarea value={form.about} onChange={(e) => set("about", e.target.value)} placeholder="Full course description..." rows={3}
              className="w-full bg-[#17191B] border border-[#484942] text-[#DFE1E3] textBody14 rounded-[8px] px-3 py-2 focus:outline-none focus:border-[#B88934] transition resize-none" />
          </div>
          <div>
            <label className="textLabel14 text-[#ABADAF] mb-1 block">Instructor <span className="text-red-400">*</span></label>
            <select value={form.instructorId} onChange={(e) => set("instructorId", e.target.value)} required className={inputCls}>
              <option value="">Select instructor…</option>
              {instructors.map((i) => (
                <option key={i._id} value={i._id}>{i.firstName} {i.lastName}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="textLabel14 text-[#ABADAF] mb-1 block">Status <span className="text-red-400">*</span></label>
              <select value={form.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
                <option value="draft">Draft</option>
                <option value="unpublished">Unpublished</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="textLabel14 text-[#ABADAF] mb-1 block">Difficulty</label>
              <select value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)} className={inputCls}>
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          <label className="flex items-center gap-3 cursor-pointer group">
            <div
              onClick={() => set("comingSoon", !form.comingSoon)}
              className={`w-5 h-5 rounded-[4px] border-2 flex items-center justify-center flex-shrink-0 transition duration-200 ${form.comingSoon ? "bg-[#B88934] border-[#B88934]" : "bg-transparent border-[#484942] group-hover:border-[#B88934]"}`}
            >
              {form.comingSoon && (
                <svg width="11" height="9" viewBox="0 0 11 9" fill="none"><path d="M1 4L4 7L10 1" stroke="#2C2313" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
              )}
            </div>
            <input type="checkbox" checked={form.comingSoon} onChange={(e) => set("comingSoon", e.target.checked)} className="sr-only" />
            <div>
              <p className="textLabel14 text-[#DFE1E3]">Coming Soon</p>
              <p className="textBody12 text-[#ABADAF]">Course will be visible but locked to students</p>
            </div>
          </label>

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 textLabel14 text-[#ABADAF] border border-[#484942] rounded-[8px] py-2.5 hover:border-[#B88934] hover:text-[#B88934] transition">Cancel</button>
            <button type="submit" disabled={isSaving} className="flex-1 textLabel14 bg-[#B88934] hover:bg-[#DFAF32] text-[#2C2313] rounded-[8px] py-2.5 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isSaving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CourseManagementPage() {
  const toast = useToast();
  const queryClient = useQueryClient();
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [modal, setModal] = useState(null); // { type: "create" | "edit", course? }
  const [deleteConfirm, setDeleteConfirm] = useState(null); // course

  const { data: coursesData, isLoading } = useQuery({
    queryKey: ["adminCourses"],
    queryFn: getAdminCourses,
  });

  const { data: instructorsData } = useQuery({
    queryKey: ["adminInstructors"],
    queryFn: getAdminInstructors,
  });

  const rawCourses = coursesData?.data?.courses || [];
  const instructors = instructorsData?.data?.instructors || [];

  // local ordered list for optimistic reorder
  const [localOrder, setLocalOrder] = useState(null);
  const orderedCourses = localOrder
    ? localOrder.map((id) => rawCourses.find((c) => c._id === id)).filter(Boolean)
    : rawCourses;

  const filtered = useMemo(() => {
    return orderedCourses.filter((c) => {
      const q = search.toLowerCase();
      const matchSearch = !q || c.title?.toLowerCase().includes(q) || c.subheading?.toLowerCase().includes(q);
      const matchStatus = !statusFilter || c.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [orderedCourses, search, statusFilter]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["adminCourses"] });
    setLocalOrder(null);
  };

  const { mutate: doCreate, isPending: isCreating } = useMutation({
    mutationFn: createAdminCourse,
    onSuccess: () => { invalidate(); setModal(null); toast({ type: "success", title: "Course created", message: "The new course has been added." }); },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.message || "Something went wrong." }),
  });

  const { mutate: doUpdate, isPending: isUpdating } = useMutation({
    mutationFn: updateAdminCourse,
    onSuccess: () => { invalidate(); setModal(null); toast({ type: "success", title: "Course updated", message: "Changes have been saved." }); },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.message || "Something went wrong." }),
  });

  const { mutate: doDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteAdminCourse,
    onSuccess: () => { invalidate(); setDeleteConfirm(null); toast({ type: "success", title: "Course deleted", message: "The course has been removed." }); },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.message || "Something went wrong." }),
  });

  const { mutate: doReorder } = useMutation({
    mutationFn: reorderAdminCourses,
    onError: () => { setLocalOrder(null); toast({ type: "error", title: "Reorder failed", message: "Could not save the new order." }); },
  });

  const toggleStatus = (course) => {
    const next = course.status === "published" ? "unpublished" : "published";
    doUpdate({ courseId: course._id, data: { status: next } });
    toast({ type: "success", title: `Course ${next}`, message: `"${course.title}" is now ${next}.` });
  };

  const move = (index, direction) => {
    const base = localOrder ? [...localOrder] : rawCourses.map((c) => c._id);
    const target = index + direction;
    if (target < 0 || target >= base.length) return;
    [base[index], base[target]] = [base[target], base[index]];
    setLocalOrder(base);
    doReorder(base);
  };

  return (
    <div className="min-h-screen px-6 md:px-10 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="textDisplay36 text-[#EFEFEE] mb-2">Course Management</h1>
          <p className="textBody18 text-[#ABADAF]">Manage courses, modules, and lessons. Drag to reorder.</p>
        </div>
        <button
          onClick={() => router.push("/admin/courses/create")}
          className="flex items-center gap-2 bg-[#B88934] hover:bg-[#DFAF32] active:bg-[#B88934] text-[#2C2313] textHeading16 px-4 py-3 rounded-[8px] transition duration-200 flex-shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Create Course
        </button>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col gap-3 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 bg-[#17191B] border border-[#26282A] rounded-[8px] px-3.5 py-2.5 w-full max-w-[512px]">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
              <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#ABADAF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search courses..."
              className="bg-transparent text-[#DFE1E3] textLabel16 placeholder-[#ABADAF] outline-none w-full"
            />
          </div>
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`flex items-center gap-2 border-[1.8px] textLabel16 px-3.5 py-2.5 rounded-[8px] transition duration-200 flex-shrink-0 ${showFilters ? "border-[#B88934] text-[#B88934]" : "border-[#ABADAF] text-[#DFE1E3] hover:border-[#B88934] hover:text-[#B88934]"}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 6H21M6 12H18M10 18H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
            Filters
          </button>
        </div>
        {showFilters && (
          <div className="flex items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#17191B] border border-[#484942] text-[#DFE1E3] textBody14 rounded-[8px] px-3 py-2 focus:outline-none focus:border-[#B88934] transition"
            >
              <option value="">All Statuses</option>
              <option value="published">Published</option>
              <option value="unpublished">Unpublished</option>
              <option value="draft">Draft</option>
            </select>
            {statusFilter && (
              <button onClick={() => setStatusFilter("")} className="textLabel14 text-[#ABADAF] hover:text-[#DFE1E3] transition">
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-[#1C1E20] border border-[#313335] rounded-[14px] overflow-hidden">

        {/* Reorder hint bar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[#313335]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 5H7M9 9H7M9 13H7M9 17H7M17 5H15M17 9H15M17 13H15M17 17H15" stroke="#B88934" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <span className="textBody16 text-[#ABADAF]">Use ↑↓ buttons or drag the handle to reorder. Changes save automatically.</span>
        </div>

        {/* Table header */}
        <div className="flex items-center px-5 py-3.5 border-b border-[#313335]">
          <div className="w-[80px]" />
          <span className="textLabel16 text-[#DFE1E3] flex-1">Course</span>
          <span className="textLabel16 text-[#DFE1E3] w-[130px]">Instructors</span>
          <span className="textLabel16 text-[#DFE1E3] w-[150px]">Status</span>
          <span className="textLabel16 text-[#DFE1E3] w-[100px]">Modules</span>
          <span className="textLabel16 text-[#DFE1E3] w-[140px]">Difficulty</span>
          <span className="textLabel16 text-[#DFE1E3] w-[120px]">Created</span>
          <span className="textLabel16 text-[#DFE1E3] text-right w-[140px]">Actions</span>
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader isLoading={true} /></div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-16 text-center textBody16 text-[#ABADAF]">No courses found.</div>
        ) : (
          filtered.map((course, index) => (
            <div key={course._id} className={`flex items-center px-5 py-4 border-b border-[#313335] last:border-b-0 ${index % 2 === 1 ? "bg-[#26282A]" : ""}`}>

              {/* Reorder controls */}
              <div className="w-[80px] flex items-center gap-2 flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="cursor-grab text-[#ABADAF]">
                  <path d="M9 5H7M9 9H7M9 13H7M9 17H7M17 5H15M17 9H15M17 13H15M17 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
                <div className="flex flex-col gap-1">
                  <button onClick={() => move(index, -1)} disabled={index === 0} className="text-[#ABADAF] hover:text-[#DFE1E3] disabled:opacity-30 transition">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                  <button onClick={() => move(index, 1)} disabled={index === filtered.length - 1} className="text-[#ABADAF] hover:text-[#DFE1E3] disabled:opacity-30 transition">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </button>
                </div>
              </div>

              {/* Course */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-[50px] h-[58px] rounded-[4px] overflow-hidden bg-[#26282A] flex-shrink-0">
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#484942" strokeWidth="1.5"/><path d="M3 9L9 15L13 11L21 19" stroke="#484942" strokeWidth="1.5" strokeLinecap="round"/></svg>
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="textLabel16 text-[#DFE1E3] line-clamp-2 leading-snug">{course.title}</p>
                  {course.subheading && <p className="textBody14 text-[#ABADAF] truncate mt-0.5">{course.subheading}</p>}
                </div>
              </div>

              {/* Instructor */}
              <div className="w-[130px]">
                <InstructorAvatar instructor={course.instructor} />
              </div>

              {/* Status */}
              <div className="w-[150px]">
                <StatusBadge status={course.status} />
              </div>

              {/* Modules */}
              <div className="w-[100px]">
                <span className="textBody16 text-[#DFE1E3]">{course.moduleCount ?? 0} modules</span>
              </div>

              {/* Difficulty */}
              <div className="w-[140px]">
                <DifficultyBadge difficulty={course.difficulty} />
              </div>

              {/* Created */}
              <div className="w-[120px]">
                <span className="textBody16 text-[#ABADAF]">
                  {course.createdAt ? new Date(course.createdAt).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" }) : "—"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 w-[140px] justify-end">
                {/* Edit */}
                <button onClick={() => setModal({ type: "edit", course })} className="text-[#ABADAF] hover:text-[#DFE1E3] transition" title="Edit">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.43741 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {/* Toggle publish/unpublish */}
                <button onClick={() => toggleStatus(course)} className="text-[#ABADAF] hover:text-[#DFE1E3] transition" title={course.status === "published" ? "Unpublish" : "Publish"}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="11" width="18" height="11" rx="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M7 11V7C7 4.23858 9.23858 2 12 2C14.7614 2 17 4.23858 17 7V11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>
                {/* Delete */}
                <button onClick={() => setDeleteConfirm(course)} className="text-[#C0696B] hover:text-[#e07375] transition" title="Delete">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6L18.1324 19.1313C18.0579 20.1928 17.1719 21 16.1076 21H7.89238C6.82811 21 5.94208 20.1928 5.86756 19.1313L5 6H19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {modal && (
        <CourseModal
          mode={modal.type}
          course={modal.course}
          instructors={instructors}
          onClose={() => setModal(null)}
          isSaving={isCreating || isUpdating}
          onSave={(payload) => {
            if (modal.type === "create") doCreate(payload);
            else doUpdate({ courseId: modal.course._id, data: payload });
          }}
        />
      )}

      {deleteConfirm && (
        <ConfirmDialog
          title="Delete Course"
          message={`Permanently delete "${deleteConfirm.title}"? This will also remove all modules, lessons and resources.`}
          confirmLabel="Delete Course"
          isLoading={isDeleting}
          onConfirm={() => doDelete(deleteConfirm._id)}
          onCancel={() => setDeleteConfirm(null)}
        />
      )}
    </div>
  );
}
