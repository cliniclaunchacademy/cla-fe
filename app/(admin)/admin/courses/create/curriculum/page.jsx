"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

// ─── ID helper ───────────────────────────────────────────────────────────────
let _id = 0;
const uid = () => `id_${++_id}`;

// ─── Initial data helpers ─────────────────────────────────────────────────────
const makeResource = () => ({ id: uid(), type: "link", title: "", url: "" });
const makeLesson = () => ({ id: uid(), title: "", videoUrl: "", collapsed: false, resources: [] });
const makeModule = () => ({ id: uid(), title: "", collapsed: false, lessons: [makeLesson()] });

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
const IconEdit = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M18.5 2.5C18.8978 2.10217 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10217 21.5 2.5C21.8978 2.89783 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10217 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);
const IconEye = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M1 12C1 12 5 4 12 4C19 4 23 12 23 12C23 12 19 20 12 20C5 20 1 12 1 12Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6" />
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
              {/* Circle */}
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
              {/* Label */}
              <span
                className="text-[14px] font-medium whitespace-nowrap"
                style={{ color: isDone ? "#ABADAF" : isActive ? "#DFE1E3" : "#868889" }}
              >
                {step.label}
              </span>
            </div>
            {/* Connector */}
            {idx < STEPS.length - 1 && (
              <div
                className="flex-1 mx-3 min-w-[40px]"
                style={{
                  height: 0,
                  borderTop: `1px solid ${isDone ? "#AE9060" : "#37352B"}`,
                }}
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

  const handleFileChange = (e) => {
    const picked = e.target.files?.[0];
    if (picked) setFile(picked);
  };

  const handleAdd = () => {
    if (!title.trim()) return;
    if (type === "link" && !url.trim()) return;
    if (type === "file" && !file) return;
    onAdd({
      id: uid(),
      type,
      title: title.trim(),
      url: type === "link" ? url.trim() : file.name,
      file: type === "file" ? file : null,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div
        className="w-[584px] flex flex-col"
        style={{ background: "#17191B", border: "2px solid #313335", borderRadius: 16 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-7">
          <h2 className="text-[28px] font-semibold text-[#EFEFEE]">Add Resource</h2>
          <button onClick={onClose} className="text-[#ABADAF] hover:text-[#DFE1E3] transition-colors">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Divider */}
        <div style={{ borderTop: "2px solid #313335" }} />

        {/* Body */}
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

          {/* Link URL — only for type=link */}
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

          {/* File drop zone — only for type=file */}
          {type === "file" && (
            <div className="flex flex-col gap-1.5">
              <label className="text-[16px] font-semibold text-[#DFE1E3] pl-1">
                File<span className="text-[#B88934]">*</span>
              </label>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
              />
              {file ? (
                /* File selected — show name with remove option */
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
                    <span className="text-[12px] text-[#868889] flex-shrink-0">
                      ({(file.size / 1024).toFixed(0)} KB)
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-[#C0696B] hover:text-[#E07678] transition-colors flex-shrink-0 ml-3"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              ) : (
                /* Drop zone */
                <div
                  className="flex flex-col items-center justify-center gap-4 py-6 px-4 rounded-[10px] cursor-pointer transition-colors"
                  style={{
                    border: `1.5px dashed ${dragOver ? "#B88934" : "#484942"}`,
                    background: dragOver ? "rgba(184,137,52,0.05)" : "transparent",
                  }}
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

          {/* Buttons */}
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
        <button className="text-[#ABADAF] hover:text-[#DFE1E3] transition-colors"><IconEdit /></button>
        <button className="text-[#ABADAF] hover:text-[#DFE1E3] transition-colors"><IconEye /></button>
        <button onClick={onDelete} className="text-[#C0696B] hover:text-[#E07678] transition-colors"><IconTrash /></button>
      </div>
    </div>
  );
}

// ─── Lesson Card ──────────────────────────────────────────────────────────────
function LessonCard({ lesson, lessonNumber, onUpdate, onDelete, onAddResource, onDeleteResource }) {
  return (
    <div
      className="w-full flex flex-col"
      style={{ background: "#26282A", border: "1px solid #313335", borderRadius: 8 }}
    >
      {/* Lecture header */}
      <div className="flex items-center justify-between px-4 py-2.5">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <span className="text-[15px] font-medium text-[#868889] flex-shrink-0">
            Lecture {lessonNumber}
          </span>
          <span className="text-[#ABADAF] flex-shrink-0"><IconFileText size={18} /></span>
          <input
            value={lesson.title}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Lecture title..."
            className="bg-transparent text-[15px] font-medium text-[#EFEFEE] placeholder:text-[#5A5C5E] outline-none flex-1 min-w-0"
          />
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
          <button onClick={onDelete} className="text-[#C0696B] hover:text-[#E07678] transition-colors">
            <IconTrash />
          </button>
          <button
            onClick={() => onUpdate({ collapsed: !lesson.collapsed })}
            className="text-[#ABADAF] hover:text-[#DFE1E3] transition-colors"
          >
            {lesson.collapsed ? <IconChevronDown size={20} /> : <IconChevronUp size={20} />}
          </button>
        </div>
      </div>

      {/* Lecture body */}
      {!lesson.collapsed && (
        <div
          className="flex flex-col gap-0"
          style={{ borderTop: "1px solid #313335" }}
        >
          <div className="flex flex-col gap-2 px-3 py-3">
            {/* Video URL input */}
            <div className="flex items-center gap-2">
              <span className="text-[#868889] flex-shrink-0"><IconLink size={15} /></span>
              <input
                value={lesson.videoUrl}
                onChange={(e) => onUpdate({ videoUrl: e.target.value })}
                placeholder="Video URL..."
                className="bg-transparent text-[14px] text-[#437EDA] placeholder:text-[#5A5C5E] outline-none flex-1"
                style={{ textDecoration: lesson.videoUrl ? "underline" : "none" }}
              />
              {lesson.videoUrl && (
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button className="text-[#ABADAF] hover:text-[#DFE1E3] transition-colors"><IconEdit /></button>
                  <button className="text-[#ABADAF] hover:text-[#DFE1E3] transition-colors"><IconEye /></button>
                  <button
                    onClick={() => onUpdate({ videoUrl: "" })}
                    className="text-[#C0696B] hover:text-[#E07678] transition-colors"
                  >
                    <IconTrash />
                  </button>
                </div>
              )}
            </div>

            {/* Resources */}
            {lesson.resources.map((res) => (
              <ResourceRow
                key={res.id}
                resource={res}
                onDelete={() => onDeleteResource(res.id)}
              />
            ))}

            {/* + Resource */}
            <button
              type="button"
              onClick={onAddResource}
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
  );
}

// ─── Module Card ──────────────────────────────────────────────────────────────
function ModuleCard({ module, moduleIndex, moduleCount, onUpdate, onDelete, onMoveUp, onMoveDown }) {
  const [resourceTarget, setResourceTarget] = useState(null); // lessonId

  const updateLesson = useCallback((lessonId, patch) => {
    onUpdate({
      lessons: module.lessons.map((l) => (l.id === lessonId ? { ...l, ...patch } : l)),
    });
  }, [module.lessons, onUpdate]);

  const deleteLesson = (lessonId) => {
    onUpdate({ lessons: module.lessons.filter((l) => l.id !== lessonId) });
  };

  const addLesson = () => {
    onUpdate({ lessons: [...module.lessons, makeLesson()] });
  };

  const addResource = (lessonId, resource) => {
    onUpdate({
      lessons: module.lessons.map((l) =>
        l.id === lessonId ? { ...l, resources: [...l.resources, resource] } : l
      ),
    });
  };

  const deleteResource = (lessonId, resourceId) => {
    onUpdate({
      lessons: module.lessons.map((l) =>
        l.id === lessonId
          ? { ...l, resources: l.resources.filter((r) => r.id !== resourceId) }
          : l
      ),
    });
  };

  return (
    <>
      <div
        className="w-full flex flex-col gap-6 p-4"
        style={{ background: "#1C1E20", border: "1px solid #313335", borderRadius: 12 }}
      >
        {/* Module header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            {/* Drag + arrows */}
            <div className="flex items-center gap-2.5 flex-shrink-0">
              <span className="text-[#ABADAF] cursor-grab"><IconGrip /></span>
              <div className="flex flex-col gap-1">
                <button
                  onClick={onMoveUp}
                  disabled={moduleIndex === 0}
                  className="text-[#ABADAF] hover:text-[#DFE1E3] disabled:opacity-30 transition-colors"
                >
                  <IconChevronUp size={18} />
                </button>
                <button
                  onClick={onMoveDown}
                  disabled={moduleIndex === moduleCount - 1}
                  className="text-[#ABADAF] hover:text-[#DFE1E3] disabled:opacity-30 transition-colors"
                >
                  <IconChevronDown size={18} />
                </button>
              </div>
            </div>

            {/* Module N label */}
            <span className="text-[15px] font-medium text-[#868889] flex-shrink-0">
              Module {moduleIndex + 1}
            </span>

            {/* Title */}
            <span className="text-[#ABADAF] flex-shrink-0"><IconFileText size={18} /></span>
            <input
              value={module.title}
              onChange={(e) => onUpdate({ title: e.target.value })}
              placeholder="Module title..."
              className="bg-transparent text-[15px] font-medium text-[#EFEFEE] placeholder:text-[#5A5C5E] outline-none flex-1 min-w-0"
            />
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0 ml-3">
            <button
              onClick={() => onUpdate({ collapsed: !module.collapsed })}
              className="text-[#ABADAF] hover:text-[#DFE1E3] transition-colors"
            >
              {module.collapsed ? <IconChevronDown size={22} /> : <IconChevronUp size={22} />}
            </button>
          </div>
        </div>

        {/* Lessons */}
        {!module.collapsed && (
          <>
            {/* Lessons container — indented */}
            <div className="flex flex-col gap-3" style={{ paddingLeft: 70 }}>
              {module.lessons.map((lesson, li) => (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  lessonNumber={li + 1}
                  onUpdate={(patch) => updateLesson(lesson.id, patch)}
                  onDelete={() => deleteLesson(lesson.id)}
                  onAddResource={() => setResourceTarget(lesson.id)}
                  onDeleteResource={(rId) => deleteResource(lesson.id, rId)}
                />
              ))}
            </div>

            {/* + Lesson */}
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

      {/* Add Resource Modal */}
      {resourceTarget && (
        <AddResourceModal
          onClose={() => setResourceTarget(null)}
          onAdd={(res) => {
            addResource(resourceTarget, res);
            setResourceTarget(null);
          }}
        />
      )}
    </>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function CurriculumPage() {
  const router = useRouter();
  const [modules, setModules] = useState([makeModule()]);

  const updateModule = useCallback((moduleId, patch) => {
    setModules((prev) => prev.map((m) => (m.id === moduleId ? { ...m, ...patch } : m)));
  }, []);

  const deleteModule = (moduleId) => {
    setModules((prev) => prev.filter((m) => m.id !== moduleId));
  };

  const addModule = () => {
    setModules((prev) => [...prev, makeModule()]);
  };

  const moveModule = (index, direction) => {
    const next = index + direction;
    if (next < 0 || next >= modules.length) return;
    const arr = [...modules];
    [arr[index], arr[next]] = [arr[next], arr[index]];
    setModules(arr);
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen" style={{ background: "#121415" }}>
      {/* ── Header ── */}
      <div
        className="flex items-center justify-between px-9 py-[22px]"
        style={{ borderBottom: "1px solid #1C1E20" }}
      >
        <button
          type="button"
          onClick={() => router.push("/admin/courses")}
          className="flex items-center gap-2 text-[16px] font-medium text-[#DFE1E3] hover:text-white transition-colors"
        >
          <IconArrowLeft />
          Back to Programs
        </button>

        <div className="flex items-center gap-4">
          {/* Save as Draft */}
          <button
            type="button"
            className="flex items-center gap-2 px-[14px] py-3 rounded-[8px] text-[16px] font-medium text-[#DFE1E3] transition-colors hover:bg-[#1C1E20]"
            style={{ border: "1.8px solid #ABADAF" }}
          >
            Save as Draft
          </button>
          {/* Save & Next */}
          <button
            type="button"
            className="flex items-center gap-2 px-[14px] py-3 rounded-[8px] text-[16px] font-semibold transition-colors hover:opacity-90"
            style={{ background: "#B88934", color: "#2C2313" }}
          >
            Save &amp; Next
            <IconChevronRight />
          </button>
        </div>
      </div>

      {/* ── Main ── */}
      <div className="flex flex-col px-9 py-7 gap-7">
        <StepIndicator currentStep={2} />

        {/* Modules */}
        <div className="flex flex-col gap-6 w-[80%]">
          {modules.map((mod, idx) => (
            <ModuleCard
              key={mod.id}
              module={mod}
              moduleIndex={idx}
              moduleCount={modules.length}
              onUpdate={(patch) => updateModule(mod.id, patch)}
              onDelete={() => deleteModule(mod.id)}
              onMoveUp={() => moveModule(idx, -1)}
              onMoveDown={() => moveModule(idx, 1)}
            />
          ))}

          {/* + Module */}
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
