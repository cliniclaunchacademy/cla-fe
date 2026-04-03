"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation } from "@tanstack/react-query";
import {
  createAdminCourse,
  uploadCourseThumbnail,
  uploadCourseBanner,
  getAdminInstructors,
} from "apis/admin-courses.api";

// ─── Step Indicator ───────────────────────────────────────────────────────────

const STEPS = [
  { number: 1, label: "Course Overview" },
  { number: 2, label: "Curriculum" },
  { number: 3, label: "Preview" },
];

function StepIndicator({ currentStep }) {
  return (
    <div className="flex items-center py-2 gap-0 w-full">
      {STEPS.map((step, idx) => {
        const isActive = step.number === currentStep;
        const isDone = step.number < currentStep;
        return (
          <div key={step.number} className="flex items-center">
            {/* Step node */}
            <div className="flex items-center gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={
                  isActive || isDone
                    ? { background: "#2C2313", border: "1px solid #765D2E" }
                    : { background: "#1C1E20" }
                }
              >
                {isDone ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12L10 17L19 8" stroke="#B88934" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  <span
                    className="text-[14px] leading-[140%]"
                    style={{ color: isActive ? "#DFE1E3" : "#868889" }}
                  >
                    {step.number}
                  </span>
                )}
              </div>
              <span
                className="text-[14px] font-medium leading-[140%] whitespace-nowrap"
                style={{ color: isActive ? "#DFE1E3" : "#868889" }}
              >
                {step.label}
              </span>
            </div>
            {/* Connector */}
            {idx < STEPS.length - 1 && (
              <div
                className="flex-1 mx-2.5 min-w-[60px]"
                style={{ height: 0, borderTop: "1px solid #37352B" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Field Wrapper ────────────────────────────────────────────────────────────

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="flex items-center pl-1">
        <span className="text-[16px] font-semibold leading-[140%] text-[#DFE1E3]">
          {label}
          {required && <span className="text-[#B88934]">*</span>}
        </span>
      </div>
      <div className="p-1 rounded-[14px]">{children}</div>
    </div>
  );
}

// ─── Styled Input ─────────────────────────────────────────────────────────────

function StyledInput({ placeholder, value, onChange, ...props }) {
  return (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-[14px] py-3 rounded-[8px] text-[16px] text-[#DFE1E3] placeholder:text-[#ABADAF] outline-none focus:border-[#B88934] transition-colors"
      style={{ background: "#232420", border: "1.5px solid #484942" }}
      {...props}
    />
  );
}

// ─── Styled Select ────────────────────────────────────────────────────────────

function StyledSelect({ value, onChange, placeholder, children }) {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={onChange}
        className="w-full appearance-none px-[14px] py-3 rounded-[8px] text-[16px] outline-none focus:border-[#B88934] transition-colors cursor-pointer"
        style={{
          background: "#232420",
          border: "1.5px solid #484942",
          color: value ? "#DFE1E3" : "#ABADAF",
        }}
      >
        <option value="" disabled hidden>
          {placeholder}
        </option>
        {children}
      </select>
      <div className="pointer-events-none absolute right-[14px] top-1/2 -translate-y-1/2">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M6 9L12 15L18 9" stroke="#ABADAF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

// ─── Thumbnail Upload ─────────────────────────────────────────────────────────

function ThumbnailUpload({ file, previewUrl, onFile }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type.startsWith("image/")) onFile(dropped);
  };

  const handleFileChange = (e) => {
    const picked = e.target.files?.[0];
    if (picked) onFile(picked);
  };

  return (
    <div
      className="w-full rounded-[10px] flex flex-col items-center justify-center gap-6 py-6 px-16 transition-colors cursor-pointer"
      style={{
        border: `1px dashed ${dragOver ? "#B88934" : "#484942"}`,
        background: dragOver ? "rgba(184,137,52,0.04)" : "transparent",
        minHeight: 168,
      }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
        onClick={(e) => e.stopPropagation()}
      />

      {previewUrl ? (
        <div className="relative w-full flex flex-col items-center gap-3">
          <img
            src={previewUrl}
            alt="Thumbnail preview"
            className="max-h-[120px] rounded-[8px] object-cover"
          />
          <span className="text-[14px] text-[#868889]">{file?.name}</span>
        </div>
      ) : (
        <>
          <div className="flex flex-col items-center gap-2">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#B88934" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M14 2V8H20" stroke="#B88934" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 13H8" stroke="#B88934" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M16 17H8" stroke="#B88934" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 9H9H8" stroke="#B88934" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span className="text-[16px] font-medium text-[#868889]">Drag Image here</span>
          </div>

          <button
            type="button"
            className="flex items-center gap-2 px-[14px] py-3 rounded-[8px] text-[16px] font-medium text-[#DFE1E3] transition-colors hover:bg-[#1C1E20]"
            style={{ border: "1.5px solid #ABADAF" }}
            onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M17 8L12 3L7 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 3V15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Upload Image
          </button>
        </>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CreateCoursePage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [about, setAbout] = useState("");
  const [instructorId, setInstructorId] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [bannerFile, setBannerFile] = useState(null);
  const [bannerPreview, setBannerPreview] = useState(null);
  const [error, setError] = useState("");

  const ABOUT_MAX = 500;

  const { data: instructorsData } = useQuery({
    queryKey: ["adminInstructors"],
    queryFn: getAdminInstructors,
  });
  const instructors =
    instructorsData?.data?.instructors ??
    instructorsData?.instructors ??
    [];

  const { mutate: doCreate, isPending } = useMutation({
    mutationFn: createAdminCourse,
    onSuccess: async (res) => {
      const courseId = res.data?.course?._id;
      if (thumbnailFile && courseId) {
        try {
          await uploadCourseThumbnail({ courseId, file: thumbnailFile });
        } catch {
          // non-fatal — course created, thumbnail failed
        }
      }
      if (bannerFile && courseId) {
        try {
          await uploadCourseBanner({ courseId, file: bannerFile });
        } catch {
          // non-fatal — course created, banner failed
        }
      }
      router.push(`/admin/courses/create/curriculum/${courseId}`);
    },
    onError: (err) => {
      setError(err?.response?.data?.message || "Failed to create course.");
    },
  });

  const handleThumbnailFile = (file) => {
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  const handleBannerFile = (file) => {
    setBannerFile(file);
    setBannerPreview(URL.createObjectURL(file));
  };

  const handleSaveNext = () => {
    setError("");
    if (!title.trim()) { setError("Course title is required."); return; }
    if (!instructorId) { setError("Please select an instructor."); return; }
    doCreate({
      title: title.trim(),
      subheading: subtitle.trim(),
      about: about.trim(),
      instructorId,
      status: "draft",
    });
  };

  return (
    <div className="flex-1 flex flex-col min-h-screen" style={{ background: "#121415" }}>
      {/* ── Top header bar ── */}
      <div className="flex items-center justify-between px-9 py-7" style={{ borderBottom: "1px solid #1C1E20" }}>
        <button
          type="button"
          onClick={() => router.push("/admin/courses")}
          className="flex items-center gap-2 text-[16px] font-medium text-[#DFE1E3] hover:text-white transition-colors"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 19L5 12L12 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to Programs
        </button>

        <button
          type="button"
          onClick={handleSaveNext}
          disabled={isPending}
          className="flex items-center gap-2 px-[14px] py-3 rounded-[8px] text-[16px] font-semibold transition-colors hover:opacity-90 active:opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "#B88934", color: "#2C2313" }}
        >
          {isPending ? "Saving..." : "Save & Next"}
          {!isPending && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Main content ── */}
      <div className="flex flex-col items-start px-9 py-7 gap-7 w-full">
        {/* Step indicator */}
        <StepIndicator currentStep={1} />

        {/* Error */}
        {error && (
          <p className="text-[14px] text-red-400">{error}</p>
        )}

        {/* Form */}
        <div className="flex flex-col gap-[22px] w-[80%]">
          {/* Course title */}
          <Field label="Course title" required>
            <StyledInput
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={200}
            />
          </Field>

          {/* Subtitle */}
          <Field label="Subtitle" required>
            <StyledInput
              placeholder="Subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              maxLength={300}
            />
          </Field>

          {/* About */}
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center pl-1">
              <span className="text-[16px] font-medium leading-[140%] text-[#DFE1E3]">About</span>
            </div>
            <div className="p-1 rounded-[14px]">
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value.slice(0, ABOUT_MAX))}
                placeholder="This is about.."
                rows={4}
                className="w-full px-3 py-3 rounded-[10px] text-[16px] text-[#DFE1E3] placeholder:text-[#ABADAF] outline-none focus:border-[#B88934] transition-colors resize-none"
                style={{ background: "#232420", border: "1.5px solid #484942" }}
              />
            </div>
            <div className="flex justify-end pr-1">
              <span className="text-[12px] text-[#ABADAF]">
                {about.length}/{ABOUT_MAX}
              </span>
            </div>
          </div>

          {/* Instructor + Difficulty side by side */}
          <div className="flex gap-3 w-full">
            <Field label="Instructor" required>
              <StyledSelect
                value={instructorId}
                onChange={(e) => setInstructorId(e.target.value)}
                placeholder={instructors.length === 0 ? "Loading instructors..." : "Select instructor"}
              >
                {instructors.map((inst) => (
                  <option key={inst._id} value={inst._id} style={{ background: "#232420", color: "#DFE1E3" }}>
                    {inst.firstName} {inst.lastName}
                  </option>
                ))}
              </StyledSelect>
            </Field>

            <Field label="Difficulty" required>
              <StyledSelect
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                placeholder="Select difficulty"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </StyledSelect>
            </Field>
          </div>

          {/* Thumbnail */}
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center pl-1">
              <span className="text-[16px] font-semibold leading-[140%] text-[#DFE1E3]">Thumbnail</span>
            </div>
            <p className="text-[14px] text-[#ABADAF] pl-1">
              Attach a valid document. Supported formats: JPG, PNG, WebP (max 5 MB).
            </p>
            <div className="w-full">
              <ThumbnailUpload
                file={thumbnailFile}
                previewUrl={thumbnailPreview}
                onFile={handleThumbnailFile}
              />
            </div>
          </div>

          {/* Banner */}
          <div className="flex flex-col gap-1.5 w-full">
            <div className="flex items-center pl-1">
              <span className="text-[16px] font-semibold leading-[140%] text-[#DFE1E3]">Banner</span>
            </div>
            <p className="text-[14px] text-[#ABADAF] pl-1">
              Course banner shown at the top of the course overview page. Supported formats: JPG, PNG, WebP (max 5 MB).
            </p>
            <div className="w-full">
              <ThumbnailUpload
                file={bannerFile}
                previewUrl={bannerPreview}
                onFile={handleBannerFile}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
