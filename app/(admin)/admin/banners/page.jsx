"use client";

import { useState, useRef, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminBanners,
  createAdminBanner,
  updateAdminBanner,
  deleteAdminBanner,
  reorderAdminBanners,
} from "apis/admin-banners.api";
import { useToast } from "@components/Common/Toast/ToastProvider";
import Loader from "@common/Loader";

// ─── Icon components ──────────────────────────────────────────────────────────

function DragHandle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="cursor-grab text-[#ABADAF] flex-shrink-0">
      <path d="M9 5H7M9 9H7M9 13H7M9 17H7M17 5H15M17 9H15M17 13H15M17 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ active }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {active ? (
        <>
          <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </>
      ) : (
        <>
          <path d="M17.94 17.94C16.23 19.24 14.19 20 12 20C7 20 2.73 16.89 1 12.5C1.96 10.06 3.65 8 5.76 6.56M10.37 5.17C10.91 5.06 11.45 5 12 5C17 5 21.27 8.11 23 12.5C22.51 13.76 21.8 14.9 20.93 15.87M14.12 14.12C13.84 14.41 13.5 14.64 13.13 14.8C12.75 14.96 12.38 15.04 12 15.04C11.22 15.04 10.49 14.73 9.95 14.19C9.41 13.65 9.1 12.92 9.1 12.14C9.1 11.76 9.18 11.39 9.34 11.01C9.5 10.64 9.73 10.3 10.02 10.02" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M1 1L23 23" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.43741 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Image Upload Picker ───────────────────────────────────────────────────────

function ImagePicker({ file, previewUrl, onFile, label = "Upload Image" }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped && dropped.type.startsWith("image/")) onFile(dropped);
  };

  return (
    <div
      className="w-full rounded-[10px] flex flex-col items-center justify-center gap-4 py-5 px-8 cursor-pointer transition-colors"
      style={{
        border: `1px dashed ${dragOver ? "#B88934" : "#484942"}`,
        background: dragOver ? "rgba(184,137,52,0.04)" : "transparent",
        minHeight: 130,
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
        onChange={(e) => { const f = e.target.files?.[0]; if (f) onFile(f); }}
        onClick={(e) => e.stopPropagation()}
      />
      {previewUrl ? (
        <div className="flex flex-col items-center gap-2 w-full">
          <img src={previewUrl} alt="Preview" className="max-h-[90px] rounded-[6px] object-cover" />
          <span className="text-[13px] text-[#868889]">{file?.name ?? "Current image — click to replace"}</span>
        </div>
      ) : (
        <>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#B88934" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M14 2V8H20" stroke="#B88934" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="flex flex-col items-center gap-1">
            <span className="text-[14px] font-medium text-[#868889]">Drag image here or</span>
            <button
              type="button"
              className="text-[14px] font-medium text-[#B88934] hover:underline"
              onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
            >
              {label}
            </button>
          </div>
          <span className="text-[12px] text-[#ABADAF]">JPG, PNG, WebP — max 5 MB</span>
        </>
      )}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.7)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div
        className="w-full max-w-[480px] rounded-[14px] p-6 flex flex-col gap-5"
        style={{ background: "#1C1E20", border: "1.5px solid #313335" }}
      >
        <div className="flex items-center justify-between">
          <p className="text-[#DFE1E3] textHeading20">{title}</p>
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

function StyledInput({ label, value, onChange, placeholder, maxLength }) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <span className="text-[14px] font-semibold text-[#DFE1E3]">{label}</span>}
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        maxLength={maxLength}
        className="w-full px-[14px] py-3 rounded-[8px] text-[16px] text-[#DFE1E3] placeholder:text-[#ABADAF] outline-none focus:border-[#B88934] transition-colors"
        style={{ background: "#232420", border: "1.5px solid #484942" }}
      />
    </div>
  );
}

// ─── Delete Confirm ────────────────────────────────────────────────────────────

function DeleteConfirm({ banner, onConfirm, onCancel, isPending }) {
  return (
    <Modal title="Delete Banner" onClose={onCancel}>
      <p className="text-[#ABADAF] textBody16">
        Are you sure you want to delete <span className="text-[#DFE1E3] font-semibold">"{banner.label}"</span>? This cannot be undone.
      </p>
      <div className="flex justify-end gap-3 mt-2">
        <button
          onClick={onCancel}
          className="px-4 py-2.5 rounded-[8px] textLabel16 text-[#DFE1E3] border border-[#484942] hover:border-[#B88934] transition"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={isPending}
          className="px-4 py-2.5 rounded-[8px] textLabel16 text-white bg-red-700 hover:bg-red-600 transition disabled:opacity-50"
        >
          {isPending ? "Deleting..." : "Delete"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Add / Edit Banner Modal ───────────────────────────────────────────────────

function BannerFormModal({ banner, onClose, onSave, isPending }) {
  const isEdit = !!banner;
  const [label, setLabel] = useState(banner?.label ?? "");
  // status field: "active" | "inactive"
  const [status, setStatus] = useState(banner?.status ?? "active");
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFile = (f) => {
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  };

  const handleSubmit = () => {
    if (!label.trim()) return;
    if (!isEdit && !file) return; // image required on create
    onSave({ label: label.trim(), status, file });
  };

  return (
    <Modal title={isEdit ? "Edit Banner" : "Add Banner"} onClose={onClose}>
      <StyledInput
        label="Label"
        value={label}
        onChange={(e) => setLabel(e.target.value)}
        placeholder="e.g. Summer Promo Banner"
        maxLength={200}
      />

      {/* Image upload — only on create; images cannot be changed after creation */}
      {!isEdit && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[14px] font-semibold text-[#DFE1E3]">Image <span className="text-[#B88934]">*</span></span>
          <ImagePicker file={file} previewUrl={previewUrl} onFile={handleFile} label="Browse file" />
        </div>
      )}

      {isEdit && banner?.imageUrl && (
        <div className="flex flex-col gap-1.5">
          <span className="text-[14px] font-semibold text-[#DFE1E3]">Current Image</span>
          <img src={banner.imageUrl} alt={banner.label} className="w-full max-h-[100px] object-cover rounded-[8px]" />
          <span className="text-[12px] text-[#ABADAF]">Images cannot be changed after upload.</span>
        </div>
      )}

      <div className="flex items-center justify-between py-2">
        <span className="text-[14px] font-semibold text-[#DFE1E3]">Active</span>
        <button
          type="button"
          onClick={() => setStatus((s) => s === "active" ? "inactive" : "active")}
          className={`w-11 h-6 rounded-full transition-colors duration-200 relative flex-shrink-0 ${status === "active" ? "bg-[#B88934]" : "bg-[#313335]"}`}
        >
          <span
            className={`absolute top-[3px] w-[18px] h-[18px] rounded-full bg-white shadow transition-transform duration-200 ${status === "active" ? "translate-x-[22px]" : "translate-x-[3px]"}`}
          />
        </button>
      </div>

      <div className="flex justify-end gap-3">
        <button
          onClick={onClose}
          className="px-4 py-2.5 rounded-[8px] textLabel16 text-[#DFE1E3] border border-[#484942] hover:border-[#B88934] transition"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isPending || !label.trim() || (!isEdit && !file)}
          className="px-4 py-2.5 rounded-[8px] textLabel16 text-[#2C2313] bg-[#B88934] hover:bg-[#DFAF32] transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Saving..." : isEdit ? "Save Changes" : "Add Banner"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminBannersPage() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(null); // null | { type: "add" } | { type: "edit", banner } | { type: "delete", banner }
  const [localOrder, setLocalOrder] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["adminBanners"],
    queryFn: getAdminBanners,
  });

  const rawBanners = data?.data?.banners || [];
  const orderedBanners = localOrder
    ? localOrder.map((id) => rawBanners.find((b) => b._id === id)).filter(Boolean)
    : rawBanners;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return q ? orderedBanners.filter((b) => b.label?.toLowerCase().includes(q)) : orderedBanners;
  }, [orderedBanners, search]);

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["adminBanners"] });
    setLocalOrder(null);
  };

  // ── Mutations ──

  const { mutate: doCreate, isPending: isCreating } = useMutation({
    mutationFn: createAdminBanner,
    onSuccess: () => {
      invalidate();
      setModal(null);
      toast({ type: "success", title: "Banner added", message: "New banner has been created." });
    },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.message || "Something went wrong." }),
  });

  const { mutate: doUpdate, isPending: isUpdating } = useMutation({
    mutationFn: updateAdminBanner,
    onSuccess: () => {
      invalidate();
      setModal(null);
      toast({ type: "success", title: "Banner updated", message: "Changes have been saved." });
    },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.message || "Something went wrong." }),
  });

  const { mutate: doDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteAdminBanner,
    onSuccess: () => {
      invalidate();
      setModal(null);
      toast({ type: "success", title: "Banner deleted", message: "The banner has been removed." });
    },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.message || "Something went wrong." }),
  });

  const { mutate: doReorder } = useMutation({
    mutationFn: reorderAdminBanners,
    onError: () => {
      setLocalOrder(null);
      toast({ type: "error", title: "Reorder failed", message: "Could not save the new order." });
    },
  });

  // ── Modal handlers ──

  const handleSave = ({ label, status, file }) => {
    if (modal?.type === "add") {
      doCreate({ label, file });
    } else if (modal?.type === "edit") {
      doUpdate({ bannerId: modal.banner._id, data: { label, status } });
    }
  };

  // ── Drag-and-drop (same pattern as courses page) ──

  const handleDragStart = (index) => setDragIndex(index);
  const handleDragOver = (e, index) => { e.preventDefault(); setOverIndex(index); };
  const handleDragEnd = () => { setDragIndex(null); setOverIndex(null); };

  const handleDrop = (index) => {
    if (dragIndex === null || dragIndex === index) { handleDragEnd(); return; }
    const base = localOrder ? [...localOrder] : rawBanners.map((b) => b._id);
    const dragBanner = filtered[dragIndex];
    const overBanner = filtered[index];
    const fromPos = base.indexOf(dragBanner._id);
    const toPos = base.indexOf(overBanner._id);
    if (fromPos === -1 || toPos === -1) { handleDragEnd(); return; }
    const newBase = [...base];
    newBase.splice(fromPos, 1);
    newBase.splice(toPos, 0, dragBanner._id);
    setLocalOrder(newBase);
    doReorder(newBase);
    handleDragEnd();
  };

  const move = (index, direction) => {
    const base = localOrder ? [...localOrder] : rawBanners.map((b) => b._id);
    const dragBanner = filtered[index];
    const overBanner = filtered[index + direction];
    if (!dragBanner || !overBanner) return;
    const fromPos = base.indexOf(dragBanner._id);
    const toPos = base.indexOf(overBanner._id);
    if (fromPos === -1 || toPos === -1) return;
    const newBase = [...base];
    [newBase[fromPos], newBase[toPos]] = [newBase[toPos], newBase[fromPos]];
    setLocalOrder(newBase);
    doReorder(newBase);
  };

  // ── Render ──

  return (
    <div className="min-h-screen px-6 md:px-10 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="textDisplay36 text-[#EFEFEE] mb-2">Banners</h1>
          <p className="textBody18 text-[#ABADAF]">Manage dashboard slider banners</p>
        </div>
        <button
          onClick={() => setModal({ type: "add" })}
          className="flex items-center gap-2 bg-[#B88934] hover:bg-[#DFAF32] active:bg-[#B88934] text-[#2C2313] textHeading16 px-4 py-3 rounded-[8px] transition duration-200 flex-shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add Banner
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-[#17191B] border border-[#26282A] rounded-[8px] px-3.5 py-2.5 w-full max-w-[512px] mb-6">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
          <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#ABADAF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search banners..."
          className="bg-transparent text-[#DFE1E3] textLabel16 placeholder-[#ABADAF] outline-none w-full"
        />
      </div>

      {/* Table */}
      <div className="bg-[#1C1E20] border border-[#313335] rounded-[14px] overflow-hidden">

        {/* Drag hint bar */}
        <div className="flex items-center gap-2 px-5 py-3 border-b border-[#313335]">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M9 5H7M9 9H7M9 13H7M9 17H7M17 5H15M17 9H15M17 13H15M17 17H15" stroke="#B88934" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <span className="textBody16 text-[#ABADAF]">Drag items to reorder. Changes are saved automatically</span>
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="flex justify-center py-16"><Loader isLoading={true} /></div>
        ) : filtered.length === 0 ? (
          <div className="px-5 py-16 text-center textBody16 text-[#ABADAF]">
            {search ? "No banners match your search." : "No banners yet. Click \"Add Banner\" to get started."}
          </div>
        ) : (
          filtered.map((banner, index) => (
            <div
              key={banner._id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDrop={() => handleDrop(index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center px-5 py-4 border-b border-[#313335] last:border-b-0 transition-colors select-none ${
                overIndex === index && dragIndex !== index
                  ? "bg-[#2C2313]"
                  : index % 2 === 1 ? "bg-[#26282A]" : ""
              }`}
              style={{ opacity: dragIndex === index ? 0.4 : 1 }}
            >
              {/* Drag handle + up/down */}
              <div className="flex items-center gap-2 mr-4 flex-shrink-0">
                <DragHandle />
                <div className="flex flex-col gap-1">
                  <button
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="text-[#ABADAF] hover:text-[#DFE1E3] disabled:opacity-30 transition"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M18 15L12 9L6 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                  <button
                    onClick={() => move(index, 1)}
                    disabled={index === filtered.length - 1}
                    className="text-[#ABADAF] hover:text-[#DFE1E3] disabled:opacity-30 transition"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Thumbnail */}
              <div className="w-[168px] h-[94px] flex-shrink-0 rounded-[8px] overflow-hidden bg-[#232420] mr-5">
                {banner.imageUrl ? (
                  <img src={banner.imageUrl} alt={banner.label} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                      <path d="M21 19V5C21 3.9 20.1 3 19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19ZM8.5 13.5L11 16.51L14.5 12L19 18H5L8.5 13.5Z" fill="#484942" />
                    </svg>
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[#DFE1E3] textBody18 !font-semibold truncate mb-1">
                  {banner.label || "Untitled Banner"}
                </p>
                <p className="text-[#ABADAF] textBody14">Order:{index}</p>
              </div>

              {/* Active badge */}
              <div className="mx-6 flex-shrink-0">
                <span
                  className={`textLabel12 px-2.5 py-1 rounded-full border ${
                    banner.status === "active"
                      ? "text-[#6FCF6F] border-[#1E3A1E] bg-[#0D1A0D]"
                      : "text-[#ABADAF] border-[#313335] bg-transparent"
                  }`}
                >
                  {banner.status === "active" ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 flex-shrink-0">
                <button
                  onClick={() => doUpdate({
                    bannerId: banner._id,
                    data: { status: banner.status === "active" ? "inactive" : "active" },
                  })}
                  title={banner.status === "active" ? "Deactivate" : "Activate"}
                  className={`transition-colors duration-200 ${banner.status === "active" ? "text-[#B88934] hover:text-[#DFAF32]" : "text-[#ABADAF] hover:text-[#DFE1E3]"}`}
                >
                  <EyeIcon active={banner.status === "active"} />
                </button>
                <button
                  onClick={() => setModal({ type: "edit", banner })}
                  title="Edit"
                  className="text-[#ABADAF] hover:text-[#B88934] transition-colors duration-200"
                >
                  <EditIcon />
                </button>
                <button
                  onClick={() => setModal({ type: "delete", banner })}
                  title="Delete"
                  className="text-[#ABADAF] hover:text-red-400 transition-colors duration-200"
                >
                  <TrashIcon />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modals */}
      {(modal?.type === "add" || modal?.type === "edit") && (
        <BannerFormModal
          banner={modal.type === "edit" ? modal.banner : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
          isPending={isCreating || isUpdating}
        />
      )}

      {modal?.type === "delete" && (
        <DeleteConfirm
          banner={modal.banner}
          onConfirm={() => doDelete(modal.banner._id)}
          onCancel={() => setModal(null)}
          isPending={isDeleting}
        />
      )}
    </div>
  );
}
