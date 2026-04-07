"use client";

import { useState, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaLinkedin, FaInstagram, FaXTwitter, FaGlobe } from "react-icons/fa6";
import {
  getAdminInstructors,
  createAdminInstructor,
  updateAdminInstructor,
  uploadInstructorPhoto,
  deleteAdminInstructor,
} from "apis/admin-instructors.api";
import { useToast } from "@components/Common/Toast/ToastProvider";
import Loader from "@common/Loader";

// ─── Avatar ──────────────────────────────────────────────────────────────────

function Avatar({ photo, size = 54 }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt="Instructor"
        className="rounded-full object-cover flex-shrink-0"
        style={{ width: size, height: size }}
      />
    );
  }
  return (
    <div
      className="rounded-full flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size, background: "#37352B" }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13M16 3.13C16.8604 3.3503 17.623 3.8507 18.1676 4.55231C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89317 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88M13 7C13 9.20914 11.2091 11 9 11C6.79086 11 5 9.20914 5 7C5 4.79086 6.79086 3 9 3C11.2091 3 13 4.79086 13 7Z" stroke="#B88934" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

// ─── Modal shell ─────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.75)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[540px] rounded-[14px] p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        style={{ background: "#1C1E20", border: "1.5px solid #313335" }}
      >
        <div className="flex items-center justify-between flex-shrink-0">
          <p className="text-[20px] font-semibold text-[#DFE1E3]">{title}</p>
          <button onClick={onClose} className="text-[#ABADAF] hover:text-[#DFE1E3] transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[14px] font-semibold text-[#DFE1E3]">
        {label}{required && <span className="text-[#B88934] ml-0.5">*</span>}
      </span>
      {children}
    </div>
  );
}

function StyledInput({ value, onChange, placeholder, maxLength, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full px-[14px] py-3 rounded-[8px] text-[16px] text-[#DFE1E3] placeholder:text-[#ABADAF] outline-none focus:border-[#B88934] transition-colors"
      style={{ background: "#232420", border: "1.5px solid #484942" }}
    />
  );
}

// ─── Photo picker ─────────────────────────────────────────────────────────────

function PhotoPicker({ currentPhotoUrl, file, previewUrl, onFile }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const display = previewUrl || currentPhotoUrl;

  return (
    <div
      className="w-full rounded-[10px] flex flex-col items-center justify-center gap-3 py-5 cursor-pointer transition-colors"
      style={{
        border: `1px dashed ${dragOver ? "#B88934" : "#484942"}`,
        background: dragOver ? "rgba(184,137,52,0.04)" : "transparent",
        minHeight: 120,
      }}
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault(); setDragOver(false);
        const f = e.dataTransfer.files?.[0];
        if (f && f.type.startsWith("image/")) onFile(f);
      }}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
        onClick={(e) => e.stopPropagation()}
      />
      {display ? (
        <div className="flex flex-col items-center gap-2">
          <img src={display} alt="Preview" className="w-[72px] h-[72px] rounded-full object-cover" />
          <span className="text-[13px] text-[#868889]">{file?.name ?? "Current photo — click to replace"}</span>
        </div>
      ) : (
        <>
          <div
            className="w-[54px] h-[54px] rounded-full flex items-center justify-center"
            style={{ background: "#37352B" }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 12C14.7614 12 17 9.76142 17 7C17 4.23858 14.7614 2 12 2C9.23858 2 7 4.23858 7 7C7 9.76142 9.23858 12 12 12Z" stroke="#B88934" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3.41 22C3.41 18.13 7.26 15 12 15" stroke="#B88934" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M19 22V16M16 19H22" stroke="#B88934" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="text-[13px] text-[#868889]">Click or drag to upload photo</span>
          <span className="text-[12px] text-[#ABADAF]">JPG, PNG, WebP — max 5 MB</span>
        </>
      )}
    </div>
  );
}

// ─── Add / Edit modal ─────────────────────────────────────────────────────────

function InstructorFormModal({ instructor, onClose, onSave, isPending }) {
  const isEdit = !!instructor;
  const [firstName, setFirstName] = useState(instructor?.firstName ?? "");
  const [lastName, setLastName] = useState(instructor?.lastName ?? "");
  const [title, setTitle] = useState(instructor?.title ?? "");
  const [bio, setBio] = useState(instructor?.bio ?? "");
  const [linkedin, setLinkedin] = useState(instructor?.linkedin ?? "");
  const [instagram, setInstagram] = useState(instructor?.instagram ?? "");
  const [twitter, setTwitter] = useState(instructor?.twitter ?? "");
  const [website, setWebsite] = useState(instructor?.website ?? "");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const handleFile = (f) => {
    setPhotoFile(f);
    setPhotoPreview(URL.createObjectURL(f));
  };

  const handleSubmit = () => {
    if (!firstName.trim() || !lastName.trim() || !title.trim()) return;
    onSave({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      title: title.trim(),
      bio: bio.trim(),
      linkedin: linkedin.trim(),
      instagram: instagram.trim(),
      twitter: twitter.trim(),
      website: website.trim(),
      status: "active",
      photoFile,
    });
  };

  const canSubmit = firstName.trim() && lastName.trim() && title.trim();

  return (
    <Modal title={isEdit ? "Edit Instructor" : "Add Instructor"} onClose={onClose}>
      <div className="flex gap-4">
        <Field label="First Name" required>
          <StyledInput value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" maxLength={100} />
        </Field>
        <Field label="Last Name" required>
          <StyledInput value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" maxLength={100} />
        </Field>
      </div>

      <Field label="Title / Position" required>
        <StyledInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Senior Clinic Consultant" maxLength={200} />
      </Field>

      <Field label="Bio">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Brief biography..."
          rows={4}
          maxLength={1000}
          className="w-full px-[14px] py-3 rounded-[8px] text-[16px] text-[#DFE1E3] placeholder:text-[#ABADAF] outline-none focus:border-[#B88934] transition-colors resize-none"
          style={{ background: "#232420", border: "1.5px solid #484942" }}
        />
      </Field>

      <Field label="Profile Photo">
        <PhotoPicker
          currentPhotoUrl={instructor?.photo}
          file={photoFile}
          previewUrl={photoPreview}
          onFile={handleFile}
        />
      </Field>

      {/* Social media links */}
      <div className="flex flex-col gap-1">
        <span className="text-[13px] font-semibold text-[#ABADAF] uppercase tracking-wide">Social Links (optional)</span>
        <div className="flex flex-col gap-2 mt-1">
          <div className="flex items-center gap-2">
            <FaLinkedin size={16} className="text-[#0A66C2] flex-shrink-0" />
            <StyledInput value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="LinkedIn URL" maxLength={300} />
          </div>
          <div className="flex items-center gap-2">
            <FaInstagram size={16} className="text-[#E1306C] flex-shrink-0" />
            <StyledInput value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Instagram URL" maxLength={300} />
          </div>
          <div className="flex items-center gap-2">
            <FaXTwitter size={16} className="text-[#ABADAF] flex-shrink-0" />
            <StyledInput value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="X / Twitter URL" maxLength={300} />
          </div>
          <div className="flex items-center gap-2">
            <FaGlobe size={16} className="text-[#ABADAF] flex-shrink-0" />
            <StyledInput value={website} onChange={(e) => setWebsite(e.target.value)} placeholder="Website URL" maxLength={300} />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-1">
        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-[8px] text-[14px] font-medium text-[#DFE1E3] border border-[#484942] hover:border-[#B88934] transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isPending || !canSubmit}
          className="px-4 py-2.5 rounded-[8px] text-[14px] font-semibold text-[#2C2313] bg-[#B88934] hover:bg-[#DFAF32] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : isEdit ? "Save Changes" : "Add Instructor"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Delete confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({ instructor, onConfirm, onCancel, isPending }) {
  return (
    <Modal title="Delete Instructor" onClose={onCancel}>
      <p className="text-[#ABADAF] text-[16px]">
        Are you sure you want to delete{" "}
        <span className="text-[#DFE1E3] font-semibold">
          {instructor.firstName} {instructor.lastName}
        </span>
        ? This cannot be undone.
      </p>
      <p className="text-[13px] text-[#868889] -mt-2">
        Note: deletion is blocked if this instructor is assigned to published or unpublished courses.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onCancel}
          className="px-4 py-2.5 rounded-[8px] text-[14px] font-medium text-[#DFE1E3] border border-[#484942] hover:border-[#B88934] transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isPending}
          className="px-4 py-2.5 rounded-[8px] text-[14px] font-semibold text-white bg-red-700 hover:bg-red-600 transition disabled:opacity-50"
        >
          {isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Instructor row ───────────────────────────────────────────────────────────

function InstructorRow({ instructor, onEdit, onDelete, isLast }) {
  const fullName = `${instructor.firstName} ${instructor.lastName}`;

  return (
    <div
      className="flex items-start justify-between px-5 py-5 gap-5"
      style={{ borderBottom: isLast ? "none" : "1px solid #313335" }}
    >
      {/* Left: avatar + info */}
      <div className="flex items-start gap-5 flex-1 min-w-0">
        <Avatar photo={instructor.photo} size={54} />

        <div className="flex flex-col gap-2 flex-1 min-w-0">
          {/* Name + badge */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[18px] font-semibold text-[#EFEFEE]">{fullName}</span>
            <span
              className="text-[13px] font-medium text-[#B88934] px-2.5 py-0.5 rounded-[14px] flex-shrink-0"
              style={{ background: "#37352B" }}
            >
              {instructor.coursesAssigned ?? 0} {instructor.coursesAssigned === 1 ? "course" : "courses"}
            </span>
          </div>

          {/* Title */}
          <p className="text-[14px] text-[#ABADAF]">{instructor.title}</p>

          {/* Bio */}
          {instructor.bio && (
            <p className="text-[14px] text-[#ABADAF] leading-relaxed line-clamp-2">{instructor.bio}</p>
          )}

          {/* Social links */}
          {(instructor.linkedin || instructor.instagram || instructor.twitter || instructor.website) && (
            <div className="flex gap-3 flex-wrap">
              {instructor.linkedin && (
                <a href={instructor.linkedin} target="_blank" rel="noopener noreferrer" className="text-[#ABADAF] hover:text-[#0A66C2] transition-colors" title="LinkedIn">
                  <FaLinkedin size={16} />
                </a>
              )}
              {instructor.instagram && (
                <a href={instructor.instagram} target="_blank" rel="noopener noreferrer" className="text-[#ABADAF] hover:text-[#E1306C] transition-colors" title="Instagram">
                  <FaInstagram size={16} />
                </a>
              )}
              {instructor.twitter && (
                <a href={instructor.twitter} target="_blank" rel="noopener noreferrer" className="text-[#ABADAF] hover:text-[#DFE1E3] transition-colors" title="X / Twitter">
                  <FaXTwitter size={16} />
                </a>
              )}
              {instructor.website && (
                <a href={instructor.website} target="_blank" rel="noopener noreferrer" className="text-[#ABADAF] hover:text-[#B88934] transition-colors" title="Website">
                  <FaGlobe size={16} />
                </a>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-3 flex-shrink-0 pt-1">
        <button
          onClick={() => onEdit(instructor)}
          title="Edit"
          className="text-[#ABADAF] hover:text-[#B88934] transition-colors duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.43741 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button
          onClick={() => onDelete(instructor)}
          title="Delete"
          className="text-[#ABADAF] hover:text-red-400 transition-colors duration-200"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminInstructorsPage() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | { type: "add" } | { type: "edit", instructor } | { type: "delete", instructor }

  const { data, isLoading } = useQuery({
    queryKey: ["adminInstructors"],
    queryFn: getAdminInstructors,
  });

  const instructors = data?.data?.instructors ?? data?.instructors ?? [];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    if (!q) return instructors;
    return instructors.filter((i) =>
      `${i.firstName} ${i.lastName}`.toLowerCase().includes(q) ||
      i.title?.toLowerCase().includes(q) ||
      i.bio?.toLowerCase().includes(q)
    );
  }, [instructors, search]);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["adminInstructors"] });

  // ── Mutations ──

  const { mutate: doCreate, isPending: isCreating } = useMutation({
    mutationFn: async ({ firstName, lastName, title, bio, linkedin, instagram, twitter, website, status, photoFile }) => {
      const res = await createAdminInstructor({ firstName, lastName, title, bio, linkedin, instagram, twitter, website, status });
      const newId = res.data?._id ?? res.data?.instructor?._id;
      if (photoFile && newId) {
        await uploadInstructorPhoto({ instructorId: newId, file: photoFile });
      }
      return res;
    },
    onSuccess: () => {
      invalidate();
      setModal(null);
      toast({ type: "success", title: "Instructor added", message: "New instructor has been created." });
    },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.error || "Something went wrong." }),
  });

  const { mutate: doUpdate, isPending: isUpdating } = useMutation({
    mutationFn: async ({ instructor, firstName, lastName, title, bio, linkedin, instagram, twitter, website, status, photoFile }) => {
      const res = await updateAdminInstructor({
        instructorId: instructor._id,
        data: { firstName, lastName, title, bio, linkedin, instagram, twitter, website, status },
      });
      if (photoFile) {
        await uploadInstructorPhoto({ instructorId: instructor._id, file: photoFile });
      }
      return res;
    },
    onSuccess: () => {
      invalidate();
      setModal(null);
      toast({ type: "success", title: "Instructor updated", message: "Changes have been saved." });
    },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.error || "Something went wrong." }),
  });

  const { mutate: doDelete, isPending: isDeleting } = useMutation({
    mutationFn: (instructorId) => deleteAdminInstructor(instructorId),
    onSuccess: () => {
      invalidate();
      setModal(null);
      toast({ type: "success", title: "Instructor deleted", message: "The instructor has been removed." });
    },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.error || "Something went wrong." }),
  });

  // ── Save handler ──

  const handleSave = (fields) => {
    if (modal?.type === "add") {
      doCreate(fields);
    } else if (modal?.type === "edit") {
      doUpdate({ instructor: modal.instructor, ...fields });
    }
  };

  // ── Render ──

  return (
    <div className="min-h-screen px-6 md:px-10 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="textDisplay36 text-[#EFEFEE] mb-2">Instructors</h1>
          <p className="textBody18 text-[#ABADAF]">Manage course instructors and their profiles</p>
        </div>
        <button
          onClick={() => setModal({ type: "add" })}
          className="flex items-center gap-2 bg-[#B88934] hover:bg-[#DFAF32] active:bg-[#B88934] text-[#2C2313] text-[16px] font-semibold px-4 py-3 rounded-[8px] transition duration-200 flex-shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add Instructor
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 px-3.5 py-3 w-full max-w-[512px] mb-6 rounded-[8px]" style={{ background: "#17191B", border: "1.5px solid #26282A" }}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#ABADAF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search instructors..."
          className="bg-transparent text-[#DFE1E3] text-[16px] font-medium placeholder-[#ABADAF] outline-none w-full"
        />
      </div>

      {/* List */}
      <div
        className="rounded-[14px] overflow-hidden"
        style={{ background: "#1C1E20", border: "1px solid #313335" }}
      >
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader isLoading={true} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-16 text-center text-[16px] text-[#ABADAF]">
            {search
              ? "No instructors match your search."
              : 'No instructors yet. Click "Add Instructor" to get started.'}
          </div>
        ) : (
          filtered.map((instructor, index) => (
            <InstructorRow
              key={instructor._id}
              instructor={instructor}
              onEdit={(i) => setModal({ type: "edit", instructor: i })}
              onDelete={(i) => setModal({ type: "delete", instructor: i })}
              isLast={index === filtered.length - 1}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {(modal?.type === "add" || modal?.type === "edit") && (
        <InstructorFormModal
          instructor={modal.type === "edit" ? modal.instructor : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
          isPending={isCreating || isUpdating}
        />
      )}

      {modal?.type === "delete" && (
        <DeleteConfirm
          instructor={modal.instructor}
          onConfirm={() => doDelete(modal.instructor._id)}
          onCancel={() => setModal(null)}
          isPending={isDeleting}
        />
      )}
    </div>
  );
}
