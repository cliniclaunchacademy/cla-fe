"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAdminCourseEditor,
  createAdminModule,
  updateAdminModule,
  deleteAdminModule,
  reorderAdminModules,
  createAdminLesson,
  updateAdminLesson,
  deleteAdminLesson,
  reorderAdminLessons,
  uploadLessonThumbnail,
} from "apis/admin-courses.api";
import { addLessonResource, deleteLessonResource, getAdminResourcesByCourse } from "apis/admin-resources.api";

// ─── ID helper ────────────────────────────────────────────────────────────────
let _seq = 0;
const tmpId = () => `tmp_${++_seq}`;
const isTmp = (id) => typeof id === "string" && id.startsWith("tmp_");

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconGrip = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <circle cx="9" cy="6" r="1.2" fill="currentColor" />
    <circle cx="15" cy="6" r="1.2" fill="currentColor" />
    <circle cx="9" cy="12" r="1.2" fill="currentColor" />
    <circle cx="15" cy="12" r="1.2" fill="currentColor" />
    <circle cx="9" cy="18" r="1.2" fill="currentColor" />
    <circle cx="15" cy="18" r="1.2" fill="currentColor" />
  </svg>
);
const IconChevronUp = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconChevronDown = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconFileText = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconTrash = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6L18.1538 19.1538C18.0712 20.1953 17.2071 21 16.1625 21H7.8375C6.79291 21 5.92882 20.1953 5.84615 19.1538L5 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10 11V17M14 11V17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconLink = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M10 13C10.4295 13.5741 10.9774 14.0492 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59699 21.9548 8.33398 21.9434 7.02299C21.932 5.71199 21.4061 4.45799 20.4791 3.53099C19.5521 2.60399 18.2981 2.07799 16.9871 2.06659C15.6761 2.05519 14.4131 2.55920 13.47 3.46999L11.75 5.18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M14 11C13.5705 10.4259 13.0226 9.95083 12.3934 9.60707C11.7643 9.26331 11.0685 9.05893 10.3533 9.00773C9.63819 8.95652 8.92041 9.05973 8.24866 9.31027C7.57691 9.56082 6.96689 9.95299 6.46 10.46L3.46 13.46C2.54921 14.403 2.04519 15.666 2.05659 16.977C2.06799 18.288 2.59399 19.542 3.52099 20.469C4.44799 21.396 5.70199 21.922 7.01299 21.9334C8.32399 21.9448 9.58699 21.4408 10.53 20.53L12.24 18.82" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconPlus = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconArrowLeft = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M19 12H5M12 19L5 12L12 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconCheck = ({ size = 14 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path d="M5 13L9 17L19 7" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconChevronRight = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconImage = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8.5" cy="8.5" r="1.5" stroke="currentColor" strokeWidth="1.4" />
    <path d="M21 15L16 10L5 21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

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
                  <span style={{ color: "#B88934" }}><IconCheck size={14} /></span>
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

// ─── Add Resource Modal ───────────────────────────────────────────────────────
function AddResourceModal({ onClose, onAdd }) {
  const [type, setType] = useState("link");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const handleTypeChange = (e) => {
    setType(e.target.value);
    setUrl("");
    setFile(null);
  };

  const handleFileDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) setFile(dropped);
  };

  const handleAdd = () => {
    if (!title.trim()) return;
    if (type === "link" && !url.trim()) return;
    if (type === "file" && !file) return;
    onAdd({ _id: tmpId(), type, title: title.trim(), url: type === "link" ? url.trim() : "", file: type === "file" ? file : null });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-[584px] flex flex-col" style={{ background: "#17191B", border: "2px solid #313335", borderRadius: 16 }}>
        <div className="flex items-center justify-between px-8 py-7">
          <h2 className="text-[28px] font-semibold text-[#EFEFEE]">Add Resource</h2>
          <button onClick={onClose} className="text-[#ABADAF] hover:text-[#DFE1E3] transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <div style={{ borderTop: "2px solid #313335" }} />

        <div className="flex flex-col gap-6 px-8 py-7">
          {/* Resource type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[16px] font-semibold text-[#DFE1E3] pl-1">
              Resource type<span className="text-[#B88934]">*</span>
            </label>
            <div className="p-1">
              <div className="relative">
                <select
                  value={type}
                  onChange={handleTypeChange}
                  className="w-full appearance-none px-[14px] py-3 rounded-[8px] text-[16px] outline-none cursor-pointer"
                  style={{ background: "#E8F0FF", border: "1.5px solid #484942", color: "#0F1113" }}
                >
                  <option value="link">Link</option>
                  <option value="file">File</option>
                </select>
                <div className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M6 9L12 15L18 9" stroke="#0F1113" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[16px] font-semibold text-[#DFE1E3] pl-1">
              {type === "link" ? "Link title" : "File title"}<span className="text-[#B88934]">*</span>
            </label>
            <div className="p-1">
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Resource Title"
                className="w-full px-[14px] py-3 rounded-[8px] text-[16px] text-[#DFE1E3] placeholder:text-[#ABADAF] outline-none focus:border-[#B88934] transition-colors"
                style={{ background: "#232420", border: "1.5px solid #484942" }}
              />
            </div>
          </div>

          {/* Link URL */}
          {type === "link" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[16px] font-semibold text-[#DFE1E3] pl-1">
                Resource link<span className="text-[#B88934]">*</span>
              </label>
              <div className="p-1">
                <input
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://videolink"
                  className="w-full px-[14px] py-3 rounded-[8px] text-[16px] text-[#DFE1E3] placeholder:text-[#ABADAF] outline-none focus:border-[#B88934] transition-colors"
                  style={{ background: "#232420", border: "1.5px solid #484942" }}
                />
              </div>
            </div>
          )}

          {/* File drop zone */}
          {type === "file" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[16px] font-semibold text-[#DFE1E3] pl-1">
                File<span className="text-[#B88934]">*</span>
              </label>
              <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) setFile(f); }} />
              {file ? (
                <div
                  className="flex items-center justify-between px-4 py-3 rounded-[8px]"
                  style={{ background: "#232420", border: "1.5px solid #484942" }}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-[#B88934]">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                        <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M14 2V8H20" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    <span className="text-[14px] text-[#DFE1E3] truncate">{file.name}</span>
                    <span className="text-[12px] text-[#868889] flex-shrink-0">({(file.size / 1024).toFixed(0)} KB)</span>
                  </div>
                  <button type="button" onClick={() => setFile(null)} className="text-[#C0696B] hover:text-[#E07678] transition-colors flex-shrink-0 ml-3">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              ) : (
                <div
                  className="flex flex-col items-center justify-center gap-4 py-6 px-4 rounded-[10px] cursor-pointer transition-colors"
                  style={{ border: `1.5px dashed ${dragOver ? "#B88934" : "#484942"}`, background: dragOver ? "rgba(184,137,52,0.05)" : "transparent" }}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleFileDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#B88934" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="#B88934" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[15px] font-medium text-[#868889]">Drag file here</span>
                    <span className="text-[13px] text-[#5A5C5E]">or click to browse</span>
                  </div>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-4 py-2 rounded-[8px] text-[14px] font-medium text-[#DFE1E3] hover:bg-[#26282A] transition-colors"
                    style={{ border: "1.5px solid #ABADAF" }}
                    onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }}
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                      <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15M17 8L12 3L7 8M12 3V15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Upload File
                  </button>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-[8px] text-[16px] font-medium text-[#DFE1E3] transition-colors hover:bg-[#1C1E20]"
              style={{ border: "1.8px solid #ABADAF" }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleAdd}
              className="flex-1 py-3 rounded-[8px] text-[16px] font-semibold transition-colors hover:opacity-90"
              style={{ background: "#B88934", color: "#2C2313" }}
            >
              Add Resource
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Resource Row ─────────────────────────────────────────────────────────────
function ResourceRow({ resource, onDelete }) {
  const isLink = resource.type === "link";
  return (
    <div className="flex items-center justify-between py-2 px-2 group">
      <div className="flex items-center gap-2 min-w-0">
        {isLink ? (
          <span className="text-[#868889] flex-shrink-0"><IconLink size={16} /></span>
        ) : (
          <span className="text-[#ABADAF] flex-shrink-0"><IconFileText size={16} /></span>
        )}
        <span
          className="text-[15px] truncate"
          style={{ color: isLink ? "#437EDA" : "#ABADAF", textDecoration: isLink ? "underline" : "none" }}
        >
          {resource.title || resource.url}
        </span>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
        <button onClick={onDelete} className="text-[#C0696B] hover:text-[#E07678] transition-colors"><IconTrash /></button>
      </div>
    </div>
  );
}

// ─── Lesson Card ──────────────────────────────────────────────────────────────
function LessonCard({ lesson, lessonNumber, onUpdate, onDelete, onDeleteResource }) {
  const [showResourceModal, setShowResourceModal] = useState(false);
  const thumbnailInputRef = useRef(null);

  const thumbnailPreview = lesson.thumbnailFile
    ? URL.createObjectURL(lesson.thumbnailFile)
    : lesson.thumbnail || null;

  return (
    <>
      <div
        className="w-full flex flex-col"
        style={{ background: "#26282A", border: "1px solid #313335", borderRadius: 8 }}
      >
        <div className="flex items-center justify-between px-4 py-2.5">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <span className="text-[15px] font-medium text-[#868889] flex-shrink-0">Lecture {lessonNumber}</span>
            <span className="text-[#ABADAF] flex-shrink-0"><IconFileText size={18} /></span>
            <input
              value={lesson.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Lecture title..."
              className="bg-transparent text-[15px] font-medium text-[#EFEFEE] placeholder:text-[#5A5C5E] outline-none flex-1 min-w-0"
            />
          </div>
          <div className="flex items-center gap-3 flex-shrink-0 ml-3">
            <button onClick={onDelete} className="text-[#C0696B] hover:text-[#E07678] transition-colors"><IconTrash /></button>
            <button
              onClick={() => onUpdate({ collapsed: !lesson.collapsed })}
              className="text-[#ABADAF] hover:text-[#DFE1E3] transition-colors"
            >
              {lesson.collapsed ? <IconChevronDown size={20} /> : <IconChevronUp size={20} />}
            </button>
          </div>
        </div>

        {!lesson.collapsed && (
          <div className="flex flex-col gap-0" style={{ borderTop: "1px solid #313335" }}>
            <div className="flex flex-col gap-2 px-3 py-3">
              <div className="flex items-center gap-2">
                <span className="text-[#868889] flex-shrink-0"><IconLink size={15} /></span>
                <input
                  value={lesson.videoEmbed}
                  onChange={(e) => onUpdate({ videoEmbed: e.target.value })}
                  placeholder="Video URL..."
                  className="bg-transparent text-[14px] text-[#437EDA] placeholder:text-[#5A5C5E] outline-none flex-1"
                  style={{ textDecoration: lesson.videoEmbed ? "underline" : "none" }}
                />
                {lesson.videoEmbed && (
                  <button onClick={() => onUpdate({ videoEmbed: "" })} className="text-[#C0696B] hover:text-[#E07678] transition-colors flex-shrink-0">
                    <IconTrash />
                  </button>
                )}
              </div>

              {/* Description */}
              <textarea
                value={lesson.description || ""}
                onChange={(e) => onUpdate({ description: e.target.value })}
                placeholder="Lesson description (optional)..."
                rows={3}
                className="w-full bg-[#1C1E20] text-[14px] text-[#EFEFEE] placeholder:text-[#5A5C5E] outline-none resize-none rounded-[6px] px-3 py-2 border border-[#313335] focus:border-[#B88934] transition-colors"
              />

              {/* Thumbnail */}
              <div className="flex flex-col gap-1.5">
                <span className="text-[13px] font-medium text-[#868889]">Thumbnail</span>
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onUpdate({ thumbnailFile: f });
                    e.target.value = "";
                  }}
                />
                {thumbnailPreview ? (
                  <div className="relative w-[120px] h-[68px] rounded-[6px] overflow-hidden group flex-shrink-0" style={{ border: "1px solid #313335" }}>
                    <img src={thumbnailPreview} alt="thumbnail" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => thumbnailInputRef.current?.click()}
                        className="text-white hover:text-[#B88934] transition-colors"
                        title="Change thumbnail"
                      >
                        <IconImage size={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => onUpdate({ thumbnail: null, thumbnailFile: null })}
                        className="text-[#C0696B] hover:text-[#E07678] transition-colors"
                        title="Remove thumbnail"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => thumbnailInputRef.current?.click()}
                    className="flex items-center gap-2 w-fit px-3 py-1.5 rounded-[6px] text-[13px] text-[#868889] hover:text-[#DFE1E3] hover:bg-[#1C1E20] transition-colors"
                    style={{ border: "1px dashed #484942" }}
                  >
                    <IconImage size={14} />
                    Add thumbnail
                  </button>
                )}
              </div>

              {/* Coming Soon toggle */}
              <div className="flex flex-col gap-1.5">
                <label
                  className="flex items-center gap-2 cursor-pointer w-fit group"
                  onClick={() => onUpdate({ comingSoon: !lesson.comingSoon, releaseDate: !lesson.comingSoon ? lesson.releaseDate : "" })}
                >
                  <div
                    className={`w-4 h-4 rounded-[3px] border flex items-center justify-center flex-shrink-0 transition duration-150 ${
                      lesson.comingSoon ? "bg-[#B88934] border-[#B88934]" : "bg-transparent border-[#484942] group-hover:border-[#B88934]"
                    }`}
                  >
                    {lesson.comingSoon && <IconCheck size={10} />}
                  </div>
                  <span className="text-[13px] text-[#ABADAF] group-hover:text-[#DFE1E3] transition-colors select-none">
                    Coming Soon
                  </span>
                </label>
                {lesson.comingSoon && (
                  <input
                    type="date"
                    value={lesson.releaseDate ? lesson.releaseDate.slice(0, 10) : ""}
                    onChange={(e) => onUpdate({ releaseDate: e.target.value || null })}
                    className="bg-[#1C1E20] text-[13px] text-[#EFEFEE] placeholder:text-[#5A5C5E] outline-none rounded-[6px] px-3 py-1.5 border border-[#313335] focus:border-[#B88934] transition-colors w-[180px]"
                    style={{ colorScheme: "dark" }}
                  />
                )}
              </div>

              {(lesson.resources || []).map((res) => (
                <ResourceRow
                  key={res._id}
                  resource={res}
                  onDelete={() => {
                    if (!isTmp(res._id)) onDeleteResource(lesson._id, res._id);
                    onUpdate({ resources: lesson.resources.filter((r) => r._id !== res._id) });
                  }}
                />
              ))}

              <button
                type="button"
                onClick={() => setShowResourceModal(true)}
                className="flex items-center gap-1.5 text-[14px] font-medium transition-colors hover:opacity-80 mt-1 w-fit"
                style={{ color: "#B88934" }}
              >
                <IconPlus size={15} />
                Resource
              </button>
            </div>
          </div>
        )}
      </div>

      {showResourceModal && (
        <AddResourceModal
          onClose={() => setShowResourceModal(false)}
          onAdd={(resource) => {
            onUpdate({ resources: [...(lesson.resources || []), resource] });
          }}
        />
      )}
    </>
  );
}

// ─── Module Card ──────────────────────────────────────────────────────────────
function ModuleCard({ module, moduleIndex, moduleCount, onUpdate, onDelete, onMoveUp, onMoveDown, onDeleteLesson, onDeleteResource }) {
  const updateLesson = useCallback((lessonId, patch) => {
    onUpdate({ lessons: module.lessons.map((l) => l._id === lessonId ? { ...l, ...patch } : l) });
  }, [module.lessons, onUpdate]);

  const addLesson = () => {
    onUpdate({ lessons: [...module.lessons, { _id: tmpId(), title: "", videoEmbed: "", description: "", comingSoon: false, releaseDate: "", collapsed: false, thumbnail: null, thumbnailFile: null, resources: [] }] });
  };

  return (
    <div
      className="w-full flex flex-col gap-6 p-4"
      style={{ background: "#1C1E20", border: "1px solid #313335", borderRadius: 12 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4 min-w-0 flex-1">
          <div className="flex items-center gap-2.5 flex-shrink-0">
            <span className="text-[#ABADAF] cursor-grab"><IconGrip /></span>
            <div className="flex flex-col gap-1">
              <button onClick={onMoveUp} disabled={moduleIndex === 0} className="text-[#ABADAF] hover:text-[#DFE1E3] disabled:opacity-30 transition-colors">
                <IconChevronUp size={18} />
              </button>
              <button onClick={onMoveDown} disabled={moduleIndex === moduleCount - 1} className="text-[#ABADAF] hover:text-[#DFE1E3] disabled:opacity-30 transition-colors">
                <IconChevronDown size={18} />
              </button>
            </div>
          </div>
          <span className="text-[15px] font-medium text-[#868889] flex-shrink-0">Module {moduleIndex + 1}</span>
          <span className="text-[#ABADAF] flex-shrink-0"><IconFileText size={18} /></span>
          <input
            value={module.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Module title..."
            className="bg-transparent text-[15px] font-medium text-[#EFEFEE] placeholder:text-[#5A5C5E] outline-none flex-1 min-w-0"
          />
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 ml-3">
          <button onClick={onDelete} className="text-[#C0696B] hover:text-[#E07678] transition-colors"><IconTrash /></button>
          <button
            onClick={() => onUpdate({ collapsed: !module.collapsed })}
            className="text-[#ABADAF] hover:text-[#DFE1E3] transition-colors"
          >
            {module.collapsed ? <IconChevronDown size={22} /> : <IconChevronUp size={22} />}
          </button>
        </div>
      </div>

      {!module.collapsed && (
        <>
          <div className="flex flex-col gap-3" style={{ paddingLeft: 70 }}>
            {module.lessons.map((lesson, li) => (
              <LessonCard
                key={lesson._id}
                lesson={lesson}
                lessonNumber={li + 1}
                onUpdate={(patch) => updateLesson(lesson._id, patch)}
                onDelete={() => {
                  if (!isTmp(lesson._id)) onDeleteLesson(module._id, lesson._id);
                  onUpdate({ lessons: module.lessons.filter((l) => l._id !== lesson._id) });
                }}
                onDeleteResource={onDeleteResource}
              />
            ))}
          </div>

          <div style={{ paddingLeft: 70 }}>
            <button
              type="button"
              onClick={addLesson}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[8px] text-[15px] font-medium text-[#DFE1E3] transition-colors hover:bg-[#26282A]"
              style={{ border: "1px solid #313335" }}
            >
              <IconPlus size={15} />
              Lesson
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// ─── Safe delete — treats 404 as already gone ────────────────────────────────
async function safeDelete(fn) {
  try {
    await fn();
  } catch (err) {
    if (err?.response?.status !== 404) throw err;
  }
}

// ─── Save all local state to API ──────────────────────────────────────────────
async function syncCurriculum({ courseId, modules, deletedModuleIds, deletedLessonMap, deletedResourceMap }) {
  for (const moduleId of deletedModuleIds) {
    await safeDelete(() => deleteAdminModule({ courseId, moduleId }));
  }

  for (const [moduleId, lessonIds] of Object.entries(deletedLessonMap)) {
    for (const lessonId of lessonIds) {
      await safeDelete(() => deleteAdminLesson({ courseId, moduleId, lessonId }));
    }
  }

  for (const [lessonId, resourceIds] of Object.entries(deletedResourceMap)) {
    for (const resourceId of resourceIds) {
      await safeDelete(() => deleteLessonResource({ lessonId, resourceId }));
    }
  }

  const finalModuleIds = [];
  for (const mod of modules) {
    let realModuleId;

    if (isTmp(mod._id)) {
      const res = await createAdminModule({ courseId, title: mod.title || "Untitled Module" });
      realModuleId = res.data?._id ?? res.data?.module?._id;
    } else {
      realModuleId = mod._id;
      await updateAdminModule({ courseId, moduleId: realModuleId, title: mod.title || "Untitled Module" });
    }
    finalModuleIds.push(realModuleId);

    const finalLessonIds = [];
    for (const lesson of mod.lessons) {
      let realLessonId;
      const lessonData = {
        title: lesson.title || "Untitled Lesson",
        videoEmbed: lesson.videoEmbed || "",
        description: lesson.description || "",
        comingSoon: lesson.comingSoon || false,
        releaseDate: lesson.releaseDate || null,
        status: "draft",
      };

      if (isTmp(lesson._id)) {
        const res = await createAdminLesson({ courseId, moduleId: realModuleId, data: lessonData });
        realLessonId = res.data?._id ?? res.data?.lesson?._id;
      } else {
        realLessonId = lesson._id;
        await updateAdminLesson({ courseId, moduleId: realModuleId, lessonId: realLessonId, data: lessonData });
      }
      finalLessonIds.push(realLessonId);

      if (lesson.thumbnailFile) {
        await uploadLessonThumbnail({ courseId, moduleId: realModuleId, lessonId: realLessonId, file: lesson.thumbnailFile });
      }

      for (const resource of lesson.resources || []) {
        if (isTmp(resource._id)) {
          await addLessonResource({
            lessonId: realLessonId,
            data: { title: resource.title, type: resource.type, url: resource.url, status: "published" },
            file: resource.file || null,
          });
        }
      }
    }

    if (finalLessonIds.length > 1) {
      await reorderAdminLessons({ courseId, moduleId: realModuleId, order: finalLessonIds });
    }
  }

  if (finalModuleIds.length > 1) {
    await reorderAdminModules({ courseId, order: finalModuleIds });
  }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function EditCurriculumPage() {
  const router = useRouter();
  const { courseId } = useParams();
  const queryClient = useQueryClient();

  const [modules, setModules] = useState([]);
  const [initialized, setInitialized] = useState(false);
  const [deletedModuleIds, setDeletedModuleIds] = useState([]);
  const [deletedLessonMap, setDeletedLessonMap] = useState({});
  const [deletedResourceMap, setDeletedResourceMap] = useState({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState("");

  const { data: editorData, isLoading } = useQuery({
    queryKey: ["admin-course-editor", courseId],
    queryFn: () => getAdminCourseEditor(courseId),
    enabled: !!courseId,
  });

  const { data: resourcesQueryData } = useQuery({
    queryKey: ["admin-course-resources", courseId],
    queryFn: () => getAdminResourcesByCourse(courseId),
    enabled: !!courseId,
  });

  useEffect(() => {
    if (editorData && resourcesQueryData && !initialized) {
      const apiModules = editorData.data?.modules ?? [];
      const allResources = resourcesQueryData.data?.resources ?? [];

      // Build a map from lessonId -> resources[]
      const resourcesByLesson = {};
      allResources.forEach((r) => {
        const lessonId = r.lesson?._id ?? r.lesson ?? r.lessonId;
        if (!lessonId) return;
        if (!resourcesByLesson[lessonId]) resourcesByLesson[lessonId] = [];
        resourcesByLesson[lessonId].push(r);
      });

      setModules(
        apiModules.map((m) => ({
          ...m,
          collapsed: false,
          lessons: (m.lessons || []).map((l) => ({
            ...l,
            collapsed: false,
            thumbnail: l.thumbnail || null,
            thumbnailFile: null,
            resources: resourcesByLesson[l._id]
              ? resourcesByLesson[l._id].map((r) => ({ ...r }))
              : (l.resources || []).map((r) => ({ ...r })),
          })),
        }))
      );
      setInitialized(true);
    }
  }, [editorData, resourcesQueryData, initialized]);

  const updateModule = useCallback((moduleId, patch) => {
    setModules((prev) => prev.map((m) => m._id === moduleId ? { ...m, ...patch } : m));
  }, []);

  const deleteModule = (mod) => {
    if (!isTmp(mod._id)) {
      setDeletedModuleIds((prev) => [...prev, mod._id]);
    }
    setModules((prev) => prev.filter((m) => m._id !== mod._id));
  };

  const addModule = () => {
    setModules((prev) => [...prev, { _id: tmpId(), title: "", collapsed: false, lessons: [] }]);
  };

  const moveModule = (index, direction) => {
    const next = index + direction;
    if (next < 0 || next >= modules.length) return;
    const arr = [...modules];
    [arr[index], arr[next]] = [arr[next], arr[index]];
    setModules(arr);
  };

  const handleDeleteLesson = useCallback((moduleId, lessonId) => {
    setDeletedLessonMap((prev) => ({
      ...prev,
      [moduleId]: [...(prev[moduleId] || []), lessonId],
    }));
  }, []);

  const handleDeleteResource = useCallback((lessonId, resourceId) => {
    setDeletedResourceMap((prev) => ({
      ...prev,
      [lessonId]: [...(prev[lessonId] || []), resourceId],
    }));
  }, []);

  const handleSave = async (andNavigate) => {
    setSaveError("");
    setIsSaving(true);
    try {
      await syncCurriculum({ courseId, modules, deletedModuleIds, deletedLessonMap, deletedResourceMap });
      setDeletedModuleIds([]);
      setDeletedLessonMap({});
      setDeletedResourceMap({});
      setInitialized(false);
      await queryClient.invalidateQueries({ queryKey: ["admin-course-resources", courseId] });
      await queryClient.invalidateQueries({ queryKey: ["admin-course-editor", courseId] });
      if (andNavigate) {
        router.push(`/admin/courses/edit/${courseId}/preview`);
      }
    } catch (err) {
      setSaveError(err?.response?.data?.error || "Save failed. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen" style={{ background: "#121415" }}>
        <span className="text-[#868889] text-[16px]">Loading curriculum...</span>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-screen" style={{ background: "#121415" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-9 py-[22px]" style={{ borderBottom: "1px solid #1C1E20" }}>
        <button
          type="button"
          onClick={() => router.push(`/admin/courses/edit/${courseId}`)}
          className="flex items-center gap-2 text-[16px] font-medium text-[#DFE1E3] hover:text-white transition-colors"
        >
          <IconArrowLeft />
          Back to Overview
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => handleSave(false)}
            disabled={isSaving}
            className="flex items-center gap-2 px-[14px] py-3 rounded-[8px] text-[16px] font-medium text-[#DFE1E3] transition-colors hover:bg-[#1C1E20] disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ border: "1.8px solid #ABADAF" }}
          >
            {isSaving ? "Saving..." : "Save as Draft"}
          </button>
          <button
            type="button"
            onClick={() => handleSave(true)}
            disabled={isSaving}
            className="flex items-center gap-2 px-[14px] py-3 rounded-[8px] text-[16px] font-semibold transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ background: "#B88934", color: "#2C2313" }}
          >
            {isSaving ? "Saving..." : "Save & Next"}
            {!isSaving && <IconChevronRight />}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex flex-col px-9 py-7 gap-7">
        <StepIndicator currentStep={2} />

        {saveError && (
          <p className="text-[14px] text-red-400">{saveError}</p>
        )}

        <div className="flex flex-col gap-6 w-[80%]">
          {modules.map((mod, idx) => (
            <ModuleCard
              key={mod._id}
              module={mod}
              moduleIndex={idx}
              moduleCount={modules.length}
              onUpdate={(patch) => updateModule(mod._id, patch)}
              onDelete={() => deleteModule(mod)}
              onMoveUp={() => moveModule(idx, -1)}
              onMoveDown={() => moveModule(idx, 1)}
              onDeleteLesson={handleDeleteLesson}
              onDeleteResource={handleDeleteResource}
            />
          ))}

          <div>
            <button
              type="button"
              onClick={addModule}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[8px] text-[15px] font-medium text-[#DFE1E3] transition-colors hover:bg-[#1C1E20]"
              style={{ border: "1px solid #313335" }}
            >
              <IconPlus size={15} />
              Module
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
