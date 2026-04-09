"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminLabs,
  createAdminLab,
  updateAdminLab,
  deleteAdminLab,
  uploadAdminLabLogo,
  reorderAdminLabs,
} from "apis/admin-labs.api";
import { useToast } from "@components/Common/Toast/ToastProvider";
import Loader from "@common/Loader";

// ─── Icons ───────────────────────────────────────────────────────────────────

function DragHandle() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="cursor-grab text-[#4B4D4F] flex-shrink-0">
      <circle cx="9" cy="5" r="1.2" fill="currentColor" />
      <circle cx="9" cy="10" r="1.2" fill="currentColor" />
      <circle cx="9" cy="15" r="1.2" fill="currentColor" />
      <circle cx="15" cy="5" r="1.2" fill="currentColor" />
      <circle cx="15" cy="10" r="1.2" fill="currentColor" />
      <circle cx="15" cy="15" r="1.2" fill="currentColor" />
    </svg>
  );
}

function IconEye() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M12 5C7 5 2.73 8.11 1 12.5C2.73 16.89 7 20 12 20C17 20 21.27 16.89 23 12.5C21.27 8.11 17 5 12 5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 15.5C13.933 15.5 15.5 13.933 15.5 12C15.5 10.067 13.933 8.5 12 8.5C10.067 8.5 8.5 10.067 8.5 12C8.5 13.933 10.067 15.5 12 15.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconExternalLink() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M15 3H21V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 14L21 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconEdit() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.5 2.5C18.8978 2.10218 19.4374 1.87868 20 1.87868C20.5626 1.87868 21.1022 2.10218 21.5 2.5C21.8978 2.89782 22.1213 3.43739 22.1213 4C22.1213 4.56261 21.8978 5.10218 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTrash() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M3 6H5H21" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconLink() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
      <path d="M10 13C10.4295 13.5741 10.9774 14.0491 11.6066 14.3929C12.2357 14.7367 12.9315 14.9411 13.6467 14.9923C14.3618 15.0435 15.0796 14.9403 15.7513 14.6897C16.4231 14.4392 17.0331 14.047 17.54 13.54L20.54 10.54C21.4508 9.59695 21.9548 8.33394 21.9434 7.02296C21.932 5.71198 21.4061 4.45791 20.4791 3.53087C19.5521 2.60383 18.298 2.07799 16.987 2.0666C15.676 2.05521 14.413 2.55918 13.47 3.46997L11.75 5.17997" stroke="#868889" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M14 11C13.5705 10.4259 13.0226 9.95087 12.3934 9.60705C11.7643 9.26323 11.0685 9.05885 10.3533 9.00766C9.63816 8.95647 8.92037 9.05966 8.24864 9.31023C7.5769 9.5608 6.96689 9.95296 6.46 10.46L3.46 13.46C2.54921 14.403 2.04524 15.666 2.05663 16.977C2.06802 18.288 2.59386 19.5421 3.5209 20.4691C4.44794 21.3961 5.70201 21.922 7.01299 21.9334C8.32398 21.9448 9.58697 21.4408 10.53 20.53L12.24 18.82" stroke="#868889" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Logo thumbnail ───────────────────────────────────────────────────────────

function LabLogo({ logo, name, size = 56 }) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).join("").slice(0, 2).toLowerCase()
    : "?";

  return (
    <div
      className="flex items-center justify-center rounded-[10px] flex-shrink-0 overflow-hidden"
      style={{ width: size, height: size, background: "#2A2C2E", border: "1px solid #313335" }}
    >
      {logo ? (
        <img src={logo} alt={name} className="w-full h-full object-contain" />
      ) : (
        <span className="font-bold select-none" style={{ fontSize: size * 0.38, color: "#B88934" }}>
          {initials}
        </span>
      )}
    </div>
  );
}

// ─── Status + GHL badges ──────────────────────────────────────────────────────

function GHLBadge() {
  return (
    <span
      className="text-[11px] font-semibold px-2 py-0.5 rounded-[4px]"
      style={{ background: "#0D1A2D", color: "#3B82F6", border: "1px solid #1A3050" }}
    >
      GHL Tracked
    </span>
  );
}

function StatusBadge({ status }) {
  if (status === "maintenance") {
    return (
      <span
        className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-[4px]"
        style={{ background: "#27200D", color: "#D97706", border: "1px solid #3D2E0F" }}
      >
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Maintenance
      </span>
    );
  }
  if (status === "coming_soon") {
    return (
      <span
        className="text-[11px] font-semibold px-2 py-0.5 rounded-[4px]"
        style={{ background: "#1A1A1A", color: "#868889", border: "1px solid #26282A" }}
      >
        Coming Soon
      </span>
    );
  }
  return (
    <span
      className="text-[11px] font-semibold px-2 py-0.5 rounded-[4px]"
      style={{ background: "#0D1F12", color: "#22C55E", border: "1px solid #1A3824" }}
    >
      Live
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
        className="w-full max-w-[560px] rounded-[14px] p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto"
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
      <span className="text-[13px] font-semibold text-[#DFE1E3]">
        {label}{required && <span className="text-[#B88934] ml-0.5">*</span>}
      </span>
      {children}
    </div>
  );
}

function StyledInput({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full px-[14px] py-2.5 rounded-[8px] text-[14px] text-[#DFE1E3] placeholder:text-[#ABADAF] outline-none focus:border-[#B88934] transition-colors"
      style={{ background: "#232420", border: "1.5px solid #484942" }}
    />
  );
}

function StyledTextarea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-[14px] py-2.5 rounded-[8px] text-[14px] text-[#DFE1E3] placeholder:text-[#ABADAF] outline-none focus:border-[#B88934] transition-colors resize-none"
      style={{ background: "#232420", border: "1.5px solid #484942" }}
    />
  );
}

// ─── Logo Picker ─────────────────────────────────────────────────────────────

function LogoPicker({ currentLogo, file, previewUrl, onFile }) {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const display = previewUrl || currentLogo;

  return (
    <div
      className="w-full rounded-[10px] flex flex-col items-center justify-center gap-2 py-5 cursor-pointer transition-colors"
      style={{
        border: `1px dashed ${dragOver ? "#B88934" : "#484942"}`,
        background: dragOver ? "rgba(184,137,52,0.04)" : "transparent",
        minHeight: 100,
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
          <img src={display} alt="Logo" className="w-[60px] h-[60px] rounded-[8px] object-contain" />
          <span className="text-[12px] text-[#868889]">{file?.name ?? "Current logo — click to replace"}</span>
        </div>
      ) : (
        <>
          <div className="w-[40px] h-[40px] rounded-[8px] flex items-center justify-center" style={{ background: "#37352B" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="#B88934" strokeWidth="1.5" />
              <path d="M3 16L8 11L12 15L16 11L21 16" stroke="#B88934" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="8.5" cy="8.5" r="1.5" fill="#B88934" />
            </svg>
          </div>
          <span className="text-[12px] text-[#868889]">Click or drag to upload logo</span>
          <span className="text-[11px] text-[#ABADAF]">JPG, PNG, WebP — max 5 MB</span>
        </>
      )}
    </div>
  );
}

// ─── Add / Edit modal ─────────────────────────────────────────────────────────

const STATUS_OPTIONS = [
  { value: "live", label: "Live" },
  { value: "coming_soon", label: "Coming Soon" },
  { value: "maintenance", label: "Maintenance" },
];

function LabFormModal({ lab, onClose, onSave, isPending }) {
  const isEdit = !!lab;

  const [name, setName] = useState(lab?.name ?? "");
  const [subheading, setSubheading] = useState(lab?.subheading ?? "");
  const [portalUrl, setPortalUrl] = useState(lab?.portalUrl ?? "");
  const [applicationEmbed, setApplicationEmbed] = useState(lab?.applicationEmbed ?? "");
  const [status, setStatus] = useState(lab?.status ?? "coming_soon");
  const [releaseDate, setReleaseDate] = useState(
    lab?.releaseDate ? lab.releaseDate.slice(0, 10) : ""
  );
  const [maintenanceMsg, setMaintenanceMsg] = useState(lab?.maintenanceMsg ?? "");
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const handleFile = (f) => {
    setLogoFile(f);
    setLogoPreview(URL.createObjectURL(f));
  };

  const canSubmit = name.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSave({
      name: name.trim(),
      subheading: subheading.trim(),
      portalUrl: portalUrl.trim(),
      applicationEmbed: applicationEmbed.trim(),
      status,
      releaseDate: releaseDate || null,
      maintenanceMsg: maintenanceMsg.trim(),
      logoFile,
    });
  };

  return (
    <Modal title={isEdit ? "Edit Lab Partner" : "Add Lab Partner"} onClose={onClose}>
      <Field label="Name" required>
        <StyledInput value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. AlphaBioMed Labs" />
      </Field>

      <Field label="Subheading">
        <StyledInput value={subheading} onChange={(e) => setSubheading(e.target.value)} placeholder="Short description shown to students" />
      </Field>

      <Field label="Portal URL">
        <StyledInput value={portalUrl} onChange={(e) => setPortalUrl(e.target.value)} placeholder="https://lab.example.com" />
      </Field>

      <Field label="GHL Application Embed">
        <StyledTextarea
          value={applicationEmbed}
          onChange={(e) => setApplicationEmbed(e.target.value)}
          placeholder="<iframe src='https://...'></iframe>"
          rows={4}
        />
        <span className="text-[11px] text-[#868889]">Paste the full GHL form embed code. If set, the lab will show as "GHL Tracked".</span>
      </Field>

      <Field label="Status" required>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full px-[14px] py-2.5 rounded-[8px] text-[14px] text-[#DFE1E3] outline-none cursor-pointer"
          style={{ background: "#232420", border: "1.5px solid #484942" }}
        >
          {STATUS_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} style={{ background: "#1C1E20" }}>{o.label}</option>
          ))}
        </select>
      </Field>

      {status === "coming_soon" && (
        <Field label="Release Date">
          <StyledInput
            type="date"
            value={releaseDate}
            onChange={(e) => setReleaseDate(e.target.value)}
          />
        </Field>
      )}

      {status === "maintenance" && (
        <Field label="Maintenance Message">
          <StyledInput
            value={maintenanceMsg}
            onChange={(e) => setMaintenanceMsg(e.target.value)}
            placeholder="We'll be back shortly..."
          />
        </Field>
      )}

      <Field label="Logo">
        <LogoPicker
          currentLogo={lab?.logo}
          file={logoFile}
          previewUrl={logoPreview}
          onFile={handleFile}
        />
      </Field>

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
          {isPending ? "Saving..." : isEdit ? "Save Changes" : "Add Lab"}
        </button>
      </div>
    </Modal>
  );
}

// ─── Delete confirm ───────────────────────────────────────────────────────────

function DeleteConfirm({ lab, onConfirm, onCancel, isPending }) {
  return (
    <Modal title="Delete Lab Partner" onClose={onCancel}>
      <p className="text-[#ABADAF] text-[15px]">
        Are you sure you want to delete{" "}
        <span className="text-[#DFE1E3] font-semibold">{lab.name}</span>?
        This will also delete all associated applications.
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

// ─── Preview modal ────────────────────────────────────────────────────────────

function PreviewModal({ lab, onClose }) {
  return (
    <Modal title="Lab Preview" onClose={onClose}>
      <div className="flex items-center gap-4">
        <LabLogo logo={lab.logo} name={lab.name} size={64} />
        <div>
          <p className="text-[18px] font-semibold text-[#DFE1E3]">{lab.name}</p>
          {lab.subheading && <p className="text-[14px] text-[#ABADAF] mt-0.5">{lab.subheading}</p>}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Row label="Status" value={<StatusBadge status={lab.status} />} />
        {lab.portalUrl && <Row label="Portal URL" value={<a href={lab.portalUrl} target="_blank" rel="noopener noreferrer" className="text-[#3B82F6] hover:underline text-[13px] break-all">{lab.portalUrl}</a>} />}
        {lab.releaseDate && <Row label="Release Date" value={new Date(lab.releaseDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} />}
        {lab.maintenanceMsg && <Row label="Maintenance Msg" value={lab.maintenanceMsg} />}
        <Row label="GHL Form" value={lab.applicationEmbed ? "Configured" : "Not set"} />
        <Row label="Total Applications" value={lab.totalApplications ?? 0} />
      </div>
    </Modal>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-start gap-3 py-2" style={{ borderBottom: "1px solid #26282A" }}>
      <span className="text-[12px] text-[#868889] w-[130px] flex-shrink-0 pt-0.5">{label}</span>
      <span className="text-[13px] text-[#DFE1E3] flex-1">{value}</span>
    </div>
  );
}

// ─── Lab Row ──────────────────────────────────────────────────────────────────

function LabRow({ lab, index, isLast, onEdit, onDelete, onPreview, dragIndex, overIndex, onDragStart, onDragOver, onDrop, onDragEnd }) {
  const isDragging = dragIndex === index;
  const isOver = overIndex === index && dragIndex !== index;

  return (
    <div
      draggable
      onDragStart={() => onDragStart(index)}
      onDragOver={(e) => onDragOver(e, index)}
      onDrop={() => onDrop(index)}
      onDragEnd={onDragEnd}
      className="flex items-center gap-4 px-5 py-4 transition-colors select-none"
      style={{
        borderBottom: isLast ? "none" : "1px solid #313335",
        opacity: isDragging ? 0.4 : 1,
        background: isOver ? "#2C2313" : "transparent",
      }}
    >
      {/* Drag handle */}
      <DragHandle />

      {/* Logo */}
      <LabLogo logo={lab.logo} name={lab.name} size={52} />

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-[15px] font-semibold text-[#DFE1E3]">{lab.name}</span>
          {lab.applicationEmbed && <GHLBadge />}
          <StatusBadge status={lab.status} />
        </div>
        {lab.subheading && (
          <p className="text-[13px] text-[#ABADAF] truncate">{lab.subheading}</p>
        )}
        {(lab.portalUrl || lab.releaseDate) && (
          <div className="flex items-center gap-1 mt-1">
            <IconLink />
            <span className="text-[12px] text-[#868889]">
              {lab.status === "coming_soon" && lab.releaseDate
                ? `coming ${new Date(lab.releaseDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })}`
                : lab.portalUrl
                  ? lab.portalUrl.replace(/^https?:\/\//, "").slice(0, 40)
                  : "coming soon"}
            </span>
          </div>
        )}
        {!lab.portalUrl && !lab.releaseDate && (
          <div className="flex items-center gap-1 mt-1">
            <IconLink />
            <span className="text-[12px] text-[#868889]">coming soon</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1 flex-shrink-0">
        <button
          onClick={() => onPreview(lab)}
          title="Preview"
          className="p-2 rounded-[6px] text-[#ABADAF] hover:text-[#DFE1E3] hover:bg-[#26282A] transition"
        >
          <IconEye />
        </button>
        {lab.portalUrl && (
          <a
            href={lab.portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open Portal"
            className="p-2 rounded-[6px] text-[#ABADAF] hover:text-[#DFE1E3] hover:bg-[#26282A] transition"
          >
            <IconExternalLink />
          </a>
        )}
        <button
          onClick={() => onEdit(lab)}
          title="Edit"
          className="p-2 rounded-[6px] text-[#ABADAF] hover:text-[#DFE1E3] hover:bg-[#26282A] transition"
        >
          <IconEdit />
        </button>
        <button
          onClick={() => onDelete(lab)}
          title="Delete"
          className="p-2 rounded-[6px] text-[#ABADAF] hover:text-red-400 hover:bg-[#26282A] transition"
        >
          <IconTrash />
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminLabPartnersPage() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [modal, setModal] = useState(null); // null | { type: "add" | "edit" | "delete" | "preview", lab? }
  const [localOrder, setLocalOrder] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const { data, isLoading } = useQuery({
    queryKey: ["adminLabs"],
    queryFn: getAdminLabs,
  });

  const rawLabs = data?.data?.labs ?? data?.labs ?? [];

  // Apply local reorder if pending
  const labs = localOrder
    ? [...rawLabs].sort((a, b) => localOrder.indexOf(a._id) - localOrder.indexOf(b._id))
    : rawLabs;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["adminLabs"] });

  // ── Mutations ──

  const { mutate: doCreate, isPending: isCreating } = useMutation({
    mutationFn: async ({ name, subheading, portalUrl, applicationEmbed, status, releaseDate, maintenanceMsg, logoFile }) => {
      const res = await createAdminLab({ name, subheading, portalUrl, applicationEmbed, status, releaseDate, maintenanceMsg });
      const newId = res.data?._id ?? res.data?.lab?._id;
      if (logoFile && newId) await uploadAdminLabLogo({ labId: newId, file: logoFile });
      return res;
    },
    onSuccess: () => { invalidate(); setModal(null); toast({ type: "success", title: "Lab created", message: "New lab partner has been added." }); },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.error || "Something went wrong." }),
  });

  const { mutate: doUpdate, isPending: isUpdating } = useMutation({
    mutationFn: async ({ lab, name, subheading, portalUrl, applicationEmbed, status, releaseDate, maintenanceMsg, logoFile }) => {
      const res = await updateAdminLab({ labId: lab._id, data: { name, subheading, portalUrl, applicationEmbed, status, releaseDate, maintenanceMsg } });
      if (logoFile) await uploadAdminLabLogo({ labId: lab._id, file: logoFile });
      return res;
    },
    onSuccess: () => { invalidate(); setModal(null); toast({ type: "success", title: "Lab updated", message: "Changes saved." }); },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.error || "Something went wrong." }),
  });

  const { mutate: doDelete, isPending: isDeleting } = useMutation({
    mutationFn: (labId) => deleteAdminLab(labId),
    onSuccess: () => { invalidate(); setModal(null); toast({ type: "success", title: "Lab deleted" }); },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.error || "Something went wrong." }),
  });

  const { mutate: doReorder } = useMutation({
    mutationFn: reorderAdminLabs,
    onError: () => { setLocalOrder(null); toast({ type: "error", title: "Reorder failed", message: "Could not save new order." }); },
  });

  // ── Save handler ──

  const handleSave = (fields) => {
    if (modal?.type === "add") doCreate(fields);
    else if (modal?.type === "edit") doUpdate({ lab: modal.lab, ...fields });
  };

  // ── Drag & drop ──

  const handleDragStart = (index) => setDragIndex(index);
  const handleDragOver = (e, index) => { e.preventDefault(); setOverIndex(index); };
  const handleDragEnd = () => { setDragIndex(null); setOverIndex(null); };

  const handleDrop = (index) => {
    if (dragIndex === null || dragIndex === index) { handleDragEnd(); return; }
    const base = localOrder ? [...localOrder] : rawLabs.map((l) => l._id);
    const fromId = labs[dragIndex]._id;
    const toId = labs[index]._id;
    const fromPos = base.indexOf(fromId);
    const toPos = base.indexOf(toId);
    if (fromPos === -1 || toPos === -1) { handleDragEnd(); return; }
    const newBase = [...base];
    newBase.splice(fromPos, 1);
    newBase.splice(toPos, 0, fromId);
    setLocalOrder(newBase);
    doReorder(newBase);
    handleDragEnd();
  };

  // ── Render ──

  return (
    <div className="min-h-screen px-6 md:px-10 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div>
          <h1 className="textDisplay36 text-[#EFEFEE]">Lab Partners</h1>
          <p className="textBody18 text-[#ABADAF] mt-1">Manage lab integrations with GHL tracking</p>
        </div>
        <button
          onClick={() => setModal({ type: "add" })}
          className="flex items-center gap-2 bg-[#B88934] hover:bg-[#DFAF32] active:bg-[#B88934] text-[#2C2313] text-[15px] font-semibold px-4 py-3 rounded-[8px] transition duration-200 flex-shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Add Lab Partner
        </button>
      </div>

      {/* List */}
      <div className="mt-8 rounded-[14px] overflow-hidden" style={{ background: "#1C1E20", border: "1px solid #313335" }}>
        {/* Hint */}
        <div
          className="flex items-center gap-2 px-5 py-3"
          style={{ borderBottom: "1px solid #313335", background: "#1A1C1E" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="9" cy="6" r="1.2" fill="#4B4D4F" />
            <circle cx="9" cy="12" r="1.2" fill="#4B4D4F" />
            <circle cx="9" cy="18" r="1.2" fill="#4B4D4F" />
            <circle cx="15" cy="6" r="1.2" fill="#4B4D4F" />
            <circle cx="15" cy="12" r="1.2" fill="#4B4D4F" />
            <circle cx="15" cy="18" r="1.2" fill="#4B4D4F" />
          </svg>
          <span className="text-[13px] text-[#868889]">Drag items to reorder. Changes are saved automatically</span>
        </div>

        {/* Rows */}
        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader isLoading={true} />
          </div>
        ) : labs.length === 0 ? (
          <div className="px-5 py-16 text-center text-[15px] text-[#ABADAF]">
            No lab partners yet. Click "Add Lab Partner" to get started.
          </div>
        ) : (
          labs.map((lab, index) => (
            <LabRow
              key={lab._id}
              lab={lab}
              index={index}
              isLast={index === labs.length - 1}
              onEdit={(l) => setModal({ type: "edit", lab: l })}
              onDelete={(l) => setModal({ type: "delete", lab: l })}
              onPreview={(l) => setModal({ type: "preview", lab: l })}
              dragIndex={dragIndex}
              overIndex={overIndex}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              onDragEnd={handleDragEnd}
            />
          ))
        )}
      </div>

      {/* Modals */}
      {(modal?.type === "add" || modal?.type === "edit") && (
        <LabFormModal
          lab={modal.type === "edit" ? modal.lab : null}
          onClose={() => setModal(null)}
          onSave={handleSave}
          isPending={isCreating || isUpdating}
        />
      )}
      {modal?.type === "delete" && (
        <DeleteConfirm
          lab={modal.lab}
          onConfirm={() => doDelete(modal.lab._id)}
          onCancel={() => setModal(null)}
          isPending={isDeleting}
        />
      )}
      {modal?.type === "preview" && (
        <PreviewModal lab={modal.lab} onClose={() => setModal(null)} />
      )}
    </div>
  );
}
