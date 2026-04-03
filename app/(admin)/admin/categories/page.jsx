"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminRecordingCategories,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
} from "apis/admin-recordings.api";
import { useToast } from "@components/Common/Toast/ToastProvider";
import Loader from "@common/Loader";
import ReactSwitch from "react-switch";

// ─── Color palette — cycled by index for the dot indicator ──────────────────

const DOT_COLORS = [
  "#8563EA", // violet
  "#EA6395", // pink
  "#EA8A35", // orange
  "#4CAF7D", // green
  "#3585EA", // blue
  "#35C2C2", // teal
  "#C0696B", // red
  "#B88934", // gold
];

// ─── Tag icon ────────────────────────────────────────────────────────────────

function TagIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.46-6.46a2.426 2.426 0 0 0 0-3.42L12.586 2.586z"
        stroke="#8563EA"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7.5" cy="7.5" r="1.5" fill="#8563EA" />
    </svg>
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
        className="w-full max-w-[460px] rounded-[14px] p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
        style={{ background: "#1C1E20", border: "1.5px solid #313335" }}
      >
        <div className="flex items-center justify-between flex-shrink-0">
          <p className="text-[20px] font-semibold text-[#DFE1E3]">{title}</p>
          <button onClick={onClose} className="text-[#ABADAF] hover:text-[#DFE1E3] transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

function StyledInput({ value, onChange, placeholder, maxLength }) {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      maxLength={maxLength}
      className="w-full rounded-[8px] px-3.5 py-2.5 text-[15px] text-[#DFE1E3] placeholder-[#4B4F52] outline-none focus:ring-1 focus:ring-[#B88934]"
      style={{ background: "#17191B", border: "1.5px solid #313335" }}
    />
  );
}

// ─── Category Form Modal ─────────────────────────────────────────────────────

function CategoryModal({ initial, onClose, onSave, isSaving }) {
  const [name, setName]     = useState(initial?.name || "");
  const [status, setStatus] = useState(initial?.status || "published");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), status });
  };

  return (
    <Modal title={initial ? "Edit Category" : "Add Category"} onClose={onClose}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Field label="Name" required>
          <StyledInput
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mindset"
            maxLength={80}
          />
        </Field>

        <Field label="Status">
          <div className="flex items-center gap-3">
            <ReactSwitch
              checked={status === "published"}
              onChange={(checked) => setStatus(checked ? "published" : "hidden")}
              onColor="#B88934"
              offColor="#313335"
              onHandleColor="#ffffff"
              offHandleColor="#ffffff"
              handleDiameter={18}
              uncheckedIcon={false}
              checkedIcon={false}
              height={24}
              width={44}
              activeBoxShadow="0 0 0 2px rgba(184,137,52,0.3)"
            />
            <span className="text-[14px] text-[#ABADAF]">
              {status === "published" ? "Published" : "Hidden"}
            </span>
          </div>
        </Field>

        <div className="flex justify-end gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-[8px] text-[14px] font-semibold text-[#ABADAF] hover:text-[#DFE1E3] transition"
            style={{ background: "#17191B", border: "1.5px solid #313335" }}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSaving || !name.trim()}
            className="px-5 py-2.5 rounded-[8px] text-[14px] font-semibold transition disabled:opacity-50"
            style={{ background: "#B88934", color: "#2C2313" }}
          >
            {isSaving ? "Saving…" : initial ? "Save Changes" : "Add Category"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

// ─── Delete Confirm Modal ────────────────────────────────────────────────────

function DeleteModal({ category, onClose, onConfirm, isDeleting }) {
  return (
    <Modal title="Delete Category" onClose={onClose}>
      <p className="text-[15px] text-[#ABADAF]">
        Are you sure you want to delete{" "}
        <span className="text-[#DFE1E3] font-semibold">{category.name}</span>?
        This will also delete all recordings in this category.
      </p>
      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-5 py-2.5 rounded-[8px] text-[14px] font-semibold text-[#ABADAF] hover:text-[#DFE1E3] transition"
          style={{ background: "#17191B", border: "1.5px solid #313335" }}
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isDeleting}
          className="px-5 py-2.5 rounded-[8px] text-[14px] font-semibold text-white transition disabled:opacity-50"
          style={{ background: "#7A2020", border: "1.5px solid #C0696B" }}
        >
          {isDeleting ? "Deleting…" : "Delete"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Category Row ────────────────────────────────────────────────────────────

function CategoryRow({ category, colorDot, onEdit, onDelete, isLast }) {
  const count = category.recordingCount ?? 0;
  const isPublished = category.status === "published";

  return (
    <div>
      <div className="flex items-center justify-between gap-4 px-5 py-5">
        {/* Left: icon + info */}
        <div className="flex items-center gap-5 min-w-0">
          {/* Tag icon box */}
          <div
            className="flex-shrink-0 w-[46px] h-[46px] rounded-[8px] flex items-center justify-center"
            style={{ background: "#211E2D" }}
          >
            <TagIcon />
          </div>

          {/* Name + count + status */}
          <div className="flex flex-col gap-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[18px] font-semibold text-[#EFEFEE] leading-[140%]">
                {category.name}
              </span>
              <span
                className="w-[10px] h-[10px] rounded-full flex-shrink-0"
                style={{ background: colorDot }}
              />
              <span className="text-[14px] font-medium text-[#ABADAF]">
                ({count} {count === 1 ? "recording" : "recordings"})
              </span>
            </div>
            <span
              className="text-[12px] font-medium px-2 py-0.5 rounded-full border w-fit"
              style={
                isPublished
                  ? { color: "#6FCF6F", borderColor: "#1E3A1E", background: "#0D1A0D" }
                  : { color: "#ABADAF", borderColor: "#313335", background: "transparent" }
              }
            >
              {isPublished ? "Published" : "Hidden"}
            </span>
          </div>
        </div>

        {/* Right: actions */}
        <div className="flex items-center gap-5 flex-shrink-0">
          <button
            onClick={() => onEdit(category)}
            className="text-[#ABADAF] hover:text-[#DFE1E3] transition"
            title="Edit"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              />
              <path
                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={() => onDelete(category)}
            className="transition"
            style={{ color: "#C0696B" }}
            title="Delete"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
              />
              <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      {!isLast && <div style={{ borderTop: "1px solid #313335" }} />}
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function CategoriesPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const [search, setSearch]             = useState("");
  const [addModal, setAddModal]         = useState(false);
  const [editTarget, setEditTarget]     = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  // ── Fetch ──
  const { data, isLoading } = useQuery({
    queryKey: ["admin-recording-categories"],
    queryFn: getAdminRecordingCategories,
  });

  const categories = data?.data?.categories || [];

  const filtered = categories.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase())
  );

  // ── Create ──
  const { mutate: doCreate, isPending: isCreating } = useMutation({
    mutationFn: createAdminCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-recording-categories"] });
      showToast("Category created.", "success");
      setAddModal(false);
    },
    onError: () => showToast("Failed to create category.", "error"),
  });

  // ── Update ──
  const { mutate: doUpdate, isPending: isUpdating } = useMutation({
    mutationFn: updateAdminCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-recording-categories"] });
      showToast("Category updated.", "success");
      setEditTarget(null);
    },
    onError: () => showToast("Failed to update category.", "error"),
  });

  // ── Delete ──
  const { mutate: doDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteAdminCategory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-recording-categories"] });
      showToast("Category deleted.", "success");
      setDeleteTarget(null);
    },
    onError: () => showToast("Failed to delete category.", "error"),
  });

  return (
    <div className="min-h-screen px-6 py-8" style={{ background: "#121415" }}>
      {/* ── Header ── */}
      <div className="flex items-end justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-[32px] font-bold text-[#EFEFEE] leading-[120%]">
            Categories
          </h1>
          <p className="text-[16px] text-[#ABADAF] mt-1">
            Manage recording categories
          </p>
        </div>

        <button
          onClick={() => setAddModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-[8px] text-[15px] font-semibold transition hover:opacity-90"
          style={{ background: "#B88934", color: "#2C2313" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
          Add Category
        </button>
      </div>

      {/* ── Search ── */}
      <div
        className="flex items-center gap-2 px-3.5 py-2.5 rounded-[8px] mb-6 w-full max-w-[460px]"
        style={{ background: "#17191B", border: "1.5px solid #26282A" }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="#ABADAF" strokeWidth="1.5" />
          <path d="M21 21l-4.35-4.35" stroke="#ABADAF" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search categories..."
          className="flex-1 bg-transparent text-[15px] text-[#DFE1E3] placeholder-[#4B4F52] outline-none"
        />
      </div>

      {/* ── List ── */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      ) : filtered.length === 0 ? (
        <div
          className="rounded-[14px] flex flex-col items-center justify-center py-20 gap-3"
          style={{ background: "#1C1E20", border: "1px solid #313335" }}
        >
          <div
            className="w-[46px] h-[46px] rounded-[8px] flex items-center justify-center"
            style={{ background: "#211E2D" }}
          >
            <TagIcon />
          </div>
          <p className="text-[16px] text-[#ABADAF]">
            {search ? "No categories match your search." : "No categories yet. Add one to get started."}
          </p>
        </div>
      ) : (
        <div
          className="rounded-[14px] overflow-hidden"
          style={{ background: "#1C1E20", border: "1px solid #313335" }}
        >
          {filtered.map((cat, idx) => (
            <CategoryRow
              key={cat._id}
              category={cat}
              colorDot={DOT_COLORS[idx % DOT_COLORS.length]}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
              isLast={idx === filtered.length - 1}
            />
          ))}
        </div>
      )}

      {/* ── Modals ── */}
      {addModal && (
        <CategoryModal
          onClose={() => setAddModal(false)}
          onSave={(data) => doCreate(data)}
          isSaving={isCreating}
        />
      )}

      {editTarget && (
        <CategoryModal
          initial={editTarget}
          onClose={() => setEditTarget(null)}
          onSave={(data) =>
            doUpdate({ categoryId: editTarget._id, data })
          }
          isSaving={isUpdating}
        />
      )}

      {deleteTarget && (
        <DeleteModal
          category={deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={() => doDelete(deleteTarget._id)}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
}
