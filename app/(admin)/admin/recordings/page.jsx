"use client";

import { useState, useMemo } from "react";
import { useQuery, useQueries, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminRecordingCategories,
  getCategoryRecordings,
  createAdminRecording,
  updateAdminRecording,
  deleteAdminRecording,
} from "apis/admin-recordings.api";
import { useToast } from "@components/Common/Toast/ToastProvider";
import ReactSwitch from "react-switch";
import Loader from "@common/Loader";

// ─── Shared helpers ───────────────────────────────────────────────────────────

function StatusBadge({ status }) {
  const isPublished = status === "published";
  return (
    <span
      className="text-[12px] font-medium px-2.5 py-0.5 rounded-full border flex-shrink-0"
      style={
        isPublished
          ? { color: "#6FCF6F", borderColor: "#1E3A1E", background: "#0D1A0D" }
          : { color: "#ABADAF", borderColor: "#313335", background: "transparent" }
      }
    >
      {isPublished ? "Published" : "Hidden"}
    </span>
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
        className="w-full max-w-[500px] rounded-[14px] p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
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
      className="w-full px-[14px] py-3 rounded-[8px] text-[15px] text-[#DFE1E3] placeholder:text-[#ABADAF] outline-none focus:border-[#B88934] transition-colors"
      style={{ background: "#232420", border: "1.5px solid #484942" }}
    />
  );
}

function StyledSelect({ value, onChange, children, disabled }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className="w-full px-[14px] py-3 rounded-[8px] text-[15px] text-[#DFE1E3] outline-none focus:border-[#B88934] transition-colors appearance-none pr-10 disabled:opacity-50"
        style={{ background: "#232420", border: "1.5px solid #484942" }}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M6 9L12 15L18 9" stroke="#ABADAF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
    </div>
  );
}

// ─── Recording form modal ─────────────────────────────────────────────────────

function RecordingModal({ recording, categories, onClose, onSave, isPending }) {
  const isEdit = !!recording;
  const [categoryId, setCategoryId] = useState(recording?.categoryId ?? "");
  const [title, setTitle] = useState(recording?.title ?? "");
  const [subheading, setSubheading] = useState(recording?.subheading ?? "");
  const [videoEmbed, setVideoEmbed] = useState(recording?.videoEmbed ?? "");
  const [recordedDate, setRecordedDate] = useState(
    recording?.recordedDate ? recording.recordedDate.split("T")[0] : ""
  );
  const [status, setStatus] = useState(recording?.status ?? "published");

  const canSave = categoryId && title.trim() && videoEmbed.trim();

  const handleSave = () => {
    if (!canSave) return;
    onSave({
      categoryId,
      title: title.trim(),
      subheading: subheading.trim(),
      videoEmbed: videoEmbed.trim(),
      recordedDate: recordedDate ? new Date(recordedDate).toISOString() : null,
      status,
    });
  };

  return (
    <Modal title={isEdit ? "Edit Recording" : "Add Recording"} onClose={onClose}>
      <Field label="Category" required>
        <StyledSelect value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="" disabled>Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>{cat.name}</option>
          ))}
        </StyledSelect>
      </Field>

      <Field label="Title" required>
        <StyledInput value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g. Clinic Efficiency Tips" maxLength={300} />
      </Field>

      <Field label="Subheading">
        <StyledInput value={subheading} onChange={(e) => setSubheading(e.target.value)} placeholder="Brief description" maxLength={400} />
      </Field>

      <Field label="Video Embed URL" required>
        <StyledInput value={videoEmbed} onChange={(e) => setVideoEmbed(e.target.value)} placeholder="https://player.vimeo.com/video/..." />
      </Field>

      <Field label="Recorded Date">
        <input
          type="date"
          value={recordedDate}
          onChange={(e) => setRecordedDate(e.target.value)}
          className="w-full px-[14px] py-3 rounded-[8px] text-[15px] text-[#DFE1E3] outline-none focus:border-[#B88934] transition-colors"
          style={{ background: "#232420", border: "1.5px solid #484942", colorScheme: "dark" }}
        />
      </Field>

      <div className="flex items-center justify-between py-1">
        <div>
          <span className="text-[14px] font-semibold text-[#DFE1E3]">Published</span>
          <p className="text-[12px] text-[#868889] mt-0.5">Hidden recordings won't be visible to students</p>
        </div>
        <ReactSwitch
          checked={status === "published"}
          onChange={(checked) => setStatus(checked ? "published" : "hidden")}
          onColor="#B88934" offColor="#313335"
          onHandleColor="#ffffff" offHandleColor="#ffffff"
          handleDiameter={18} uncheckedIcon={false} checkedIcon={false}
          height={24} width={44} activeBoxShadow="0 0 0 2px rgba(184,137,52,0.3)"
        />
      </div>

      <div className="flex justify-end gap-3 pt-1">
        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-[8px] text-[14px] font-medium text-[#DFE1E3] border border-[#484942] hover:border-[#B88934] transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          disabled={isPending || !canSave}
          className="px-4 py-2.5 rounded-[8px] text-[14px] font-semibold text-[#2C2313] bg-[#B88934] hover:bg-[#DFAF32] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : isEdit ? "Save Changes" : "Add Recording"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Category form modal ──────────────────────────────────────────────────────

// ─── Delete confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({ label, onConfirm, onCancel, isPending, warning }) {
  return (
    <Modal title="Confirm Delete" onClose={onCancel}>
      <p className="text-[#ABADAF] text-[15px]">
        Are you sure you want to delete <span className="text-[#DFE1E3] font-semibold">"{label}"</span>? This cannot be undone.
      </p>
      {warning && <p className="text-[13px] text-[#F87171] -mt-2">{warning}</p>}
      <div className="flex justify-end gap-3">
        <button onClick={onCancel} className="px-4 py-2.5 rounded-[8px] text-[14px] font-medium text-[#DFE1E3] border border-[#484942] hover:border-[#B88934] transition">
          Cancel
        </button>
        <button onClick={onConfirm} disabled={isPending} className="px-4 py-2.5 rounded-[8px] text-[14px] font-semibold text-white bg-red-700 hover:bg-red-600 transition disabled:opacity-50">
          {isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Recording row ────────────────────────────────────────────────────────────

function RecordingRow({ recording, onEdit, onDelete, isLast }) {
  return (
    <div
      className="flex items-start justify-between px-5 py-5 gap-5"
      style={{ borderBottom: isLast ? "none" : "1px solid #313335" }}
    >
      {/* Left: icon + info */}
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <div className="w-10 h-10 rounded-[8px] flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: "#37352B" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M5 3L19 12L5 21V3Z" fill="#B88934"/>
          </svg>
        </div>

        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-[17px] font-semibold text-[#EFEFEE] truncate">{recording.title}</span>
            <span
              className="text-[12px] font-medium text-[#B88934] px-2.5 py-0.5 rounded-full flex-shrink-0"
              style={{ background: "#37352B" }}
            >
              {recording.categoryName}
            </span>
          </div>

          {recording.subheading && (
            <p className="text-[14px] text-[#ABADAF] line-clamp-1">{recording.subheading}</p>
          )}

          <div className="flex items-center gap-3 flex-wrap mt-0.5">
            {recording.recordedDate && (
              <span className="text-[13px] text-[#868889]">
                {new Date(recording.recordedDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </span>
            )}
            {recording.videoEmbed && (
              <span className="text-[13px] text-[#868889] truncate max-w-[280px]">{recording.videoEmbed}</span>
            )}
          </div>
        </div>
      </div>

      {/* Right: status + actions */}
      <div className="flex items-center gap-4 flex-shrink-0 pt-1">
        <StatusBadge status={recording.status} />
        <button onClick={() => onEdit(recording)} className="text-[#ABADAF] hover:text-[#B88934] transition-colors">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <button onClick={() => onDelete(recording)} className="text-[#ABADAF] hover:text-red-400 transition-colors">
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

export default function AdminRecordingsPage() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modal, setModal] = useState(null);

  // ── Fetch categories ──

  const { data: catsData, isLoading: isLoadingCats } = useQuery({
    queryKey: ["adminRecordingCategories"],
    queryFn: getAdminRecordingCategories,
  });
  const categories = catsData?.data?.categories ?? [];

  // ── Fetch recordings per category ──

  const recordingsQueries = useQueries({
    queries: categories.map((cat) => ({
      queryKey: ["categoryRecordings", cat._id],
      queryFn: () => getCategoryRecordings(cat._id),
      enabled: categories.length > 0,
    })),
  });

  const isLoadingRecordings = recordingsQueries.some((q) => q.isLoading);
  const isLoading = isLoadingCats || isLoadingRecordings;

  const allRecordings = useMemo(() => {
    return recordingsQueries.flatMap((q, i) => {
      const cat = categories[i];
      if (!cat) return [];
      return (q.data?.data?.recordings ?? []).map((r) => ({
        ...r,
        categoryId: cat._id,
        categoryName: cat.name,
      }));
    });
  }, [recordingsQueries, categories]);

  const filtered = useMemo(() => {
    let list = allRecordings;
    if (categoryFilter !== "all") list = list.filter((r) => r.categoryId === categoryFilter);
    const q = search.toLowerCase();
    if (q) list = list.filter((r) => r.title?.toLowerCase().includes(q) || r.subheading?.toLowerCase().includes(q));
    return list;
  }, [allRecordings, categoryFilter, search]);

  // ── Invalidate helpers ──

  const invalidateAll = () => {
    queryClient.invalidateQueries({ queryKey: ["adminRecordingCategories"] });
    categories.forEach((cat) => {
      queryClient.invalidateQueries({ queryKey: ["categoryRecordings", cat._id] });
    });
  };

  const invalidateCategory = (categoryId) => {
    queryClient.invalidateQueries({ queryKey: ["categoryRecordings", categoryId] });
    queryClient.invalidateQueries({ queryKey: ["adminRecordingCategories"] });
  };

  // ── Recording mutations ──

  const { mutate: doCreate, isPending: isCreating } = useMutation({
    mutationFn: ({ categoryId, data }) => createAdminRecording({ categoryId, data }),
    onSuccess: (_, vars) => {
      invalidateCategory(vars.categoryId);
      setModal(null);
      toast({ type: "success", title: "Recording added" });
    },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.error || "Something went wrong." }),
  });

  const { mutate: doUpdate, isPending: isUpdating } = useMutation({
    mutationFn: ({ recordingId, data }) => updateAdminRecording({ recordingId, data }),
    onSuccess: () => {
      invalidateAll();
      setModal(null);
      toast({ type: "success", title: "Recording updated" });
    },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.error || "Something went wrong." }),
  });

  const { mutate: doDelete, isPending: isDeleting } = useMutation({
    mutationFn: (recordingId) => deleteAdminRecording(recordingId),
    onSuccess: () => {
      invalidateAll();
      setModal(null);
      toast({ type: "success", title: "Recording deleted" });
    },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.error || "Something went wrong." }),
  });

  const handleSaveRecording = (fields) => {
    const { categoryId, ...data } = fields;
    if (modal?.type === "add") {
      doCreate({ categoryId, data });
    } else if (modal?.type === "edit") {
      doUpdate({ recordingId: modal.recording._id, data: { ...data, categoryId } });
    }
  };

  // ── Render ──

  return (
    <div className="min-h-screen px-6 md:px-10 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="textDisplay36 text-[#EFEFEE] mb-2">Recordings</h1>
          <p className="textBody18 text-[#ABADAF]">Manage all recordings across categories</p>
        </div>
        <button
          onClick={() => setModal({ type: "add" })}
          className="flex items-center gap-2 bg-[#B88934] hover:bg-[#DFAF32] active:bg-[#B88934] text-[#2C2313] text-[16px] font-semibold px-4 py-3 rounded-[8px] transition duration-200 flex-shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          Add Recording
        </button>
      </div>

      {/* Filters row */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2 px-3.5 py-3 flex-1 min-w-[200px] max-w-[400px] rounded-[8px]" style={{ background: "#17191B", border: "1.5px solid #26282A" }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#ABADAF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search recordings..."
            className="bg-transparent text-[#DFE1E3] text-[16px] font-medium placeholder-[#ABADAF] outline-none w-full"
          />
        </div>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-3.5 py-3 pr-9 rounded-[8px] text-[15px] text-[#DFE1E3] outline-none appearance-none"
            style={{ background: "#17191B", border: "1.5px solid #26282A" }}
          >
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
          <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 15L18 9" stroke="#ABADAF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* Recordings list */}
      <div className="rounded-[14px] overflow-hidden" style={{ background: "#1C1E20", border: "1px solid #313335" }}>
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader isLoading={true} /></div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-16 text-center text-[16px] text-[#ABADAF]">
            {search || categoryFilter !== "all"
              ? "No recordings match your filters."
              : 'No recordings yet. Click "Add Recording" to get started.'}
          </div>
        ) : (
          filtered.map((rec, index) => (
            <RecordingRow
              key={rec._id}
              recording={rec}
              onEdit={(r) => setModal({ type: "edit", recording: r })}
              onDelete={(r) => setModal({ type: "delete", recording: r })}
              isLast={index === filtered.length - 1}
            />
          ))
        )}
      </div>

      {/* Recording modals */}
      {(modal?.type === "add" || modal?.type === "edit") && (
        <RecordingModal
          recording={modal.type === "edit" ? modal.recording : null}
          categories={categories}
          onClose={() => setModal(null)}
          onSave={handleSaveRecording}
          isPending={isCreating || isUpdating}
        />
      )}
      {modal?.type === "delete" && (
        <DeleteConfirm
          label={modal.recording.title}
          onConfirm={() => doDelete(modal.recording._id)}
          onCancel={() => setModal(null)}
          isPending={isDeleting}
        />
      )}

    </div>
  );
}
