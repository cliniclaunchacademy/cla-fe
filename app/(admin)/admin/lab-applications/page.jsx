"use client";

import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminLabApplications,
  updateAdminLabApplicationStatus,
} from "apis/admin-lab-applications.api";
import { useToast } from "@components/Common/Toast/ToastProvider";
import Loader from "@common/Loader";

// ─── Icons ───────────────────────────────────────────────────────────────────

function IconPending() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#D97706" strokeWidth="1.6" />
      <path d="M12 7V12L15 14" stroke="#D97706" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconInReview() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15M9 5C9 5.55228 9.44772 6 10 6H14C14.5523 6 15 5.55228 15 5M9 5C9 4.44772 9.44772 4 10 4H14C14.5523 4 15 4.44772 15 3M12 12H15M12 16H15M9 12H9.01M9 16H9.01" stroke="#3B82F6" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconApproved() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#22C55E" strokeWidth="1.6" />
      <path d="M8.5 12L11 14.5L15.5 10" stroke="#22C55E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconRejected() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="1.6" />
      <path d="M9 9L15 15M15 9L9 15" stroke="#EF4444" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconSave() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
      <path d="M19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16L21 8V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M17 21V13H7V21M7 3V8H15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

// API uses hyphens: "in-review". Internally we keep hyphens throughout.
const STATUS_LABELS = {
  "pending":   "Pending",
  "in-review": "In Review",
  "approved":  "Approved",
  "rejected":  "Rejected",
};

const STATUS_COLORS = {
  "pending":   { bg: "#27200D", text: "#D97706", border: "#3D2E0F" },
  "in-review": { bg: "#0D1A2D", text: "#3B82F6", border: "#1A3050" },
  "approved":  { bg: "#0D1F12", text: "#22C55E", border: "#1A3824" },
  "rejected":  { bg: "#1F0D0D", text: "#EF4444", border: "#3B1414" },
};

const STATUS_OPTIONS = [
  { value: "pending",   label: "Pending" },
  { value: "in-review", label: "In Review" },
  { value: "approved",  label: "Approved" },
  { value: "rejected",  label: "Rejected" },
];

// Normalise status from API (may arrive as "in-review" or "in_review")
function normaliseStatus(raw) {
  if (!raw) return "pending";
  return raw.toLowerCase().replace("_", "-");
}

// Turn a snake_case / camelCase key into a readable label
function formatKey(key) {
  return key
    .replace(/[_-]/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({ icon, count, label, borderColor }) {
  return (
    <div
      className="flex-1 min-w-0 flex items-center gap-4 px-5 py-4 rounded-[12px]"
      style={{ background: "#1C1E20", border: `1px solid ${borderColor || "#313335"}` }}
    >
      <div className="flex-shrink-0">{icon}</div>
      <div>
        <p className="text-[28px] font-bold text-[#DFE1E3] leading-none">{count}</p>
        <p className="text-[14px] text-[#ABADAF] mt-0.5">{label}</p>
      </div>
    </div>
  );
}

// ─── Status Dropdown ──────────────────────────────────────────────────────────

function StatusDropdown({ value, onChange }) {
  const c = STATUS_COLORS[value] || STATUS_COLORS["pending"];
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full appearance-none px-4 py-2.5 rounded-[8px] text-[14px] font-medium pr-10 outline-none cursor-pointer transition-colors"
        style={{ background: c.bg, color: c.text, border: `1px solid ${c.border}` }}
      >
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value} style={{ background: "#1C1E20", color: "#DFE1E3" }}>
            {opt.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M6 9L12 15L18 9" stroke={c.text} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}

// ─── User Avatar ─────────────────────────────────────────────────────────────

function UserAvatar({ photo, name }) {
  const initials = name
    ? name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : "?";

  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        className="w-[44px] h-[44px] rounded-full object-cover flex-shrink-0"
      />
    );
  }
  return (
    <div
      className="w-[44px] h-[44px] rounded-full flex items-center justify-center text-[15px] font-bold text-[#B88934] flex-shrink-0"
      style={{ background: "#37352B" }}
    >
      {initials}
    </div>
  );
}

// ─── Form Data Section ───────────────────────────────────────────────────────

function FormDataSection({ formData }) {
  if (!formData || Object.keys(formData).length === 0) return null;

  const entries = Object.entries(formData);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
          <path d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z" stroke="#ABADAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M14 2V8H20M16 13H8M16 17H8M10 9H8" stroke="#ABADAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[14px] font-semibold text-[#DFE1E3]">Submitted Form Data</span>
      </div>
      <div
        className="rounded-[8px] overflow-hidden"
        style={{ border: "1px solid #26282A" }}
      >
        {entries.map(([key, value], i) => (
          <div
            key={key}
            className="flex gap-4 px-4 py-2.5"
            style={{
              background: i % 2 === 0 ? "#17191B" : "#1C1E20",
              borderBottom: i < entries.length - 1 ? "1px solid #26282A" : "none",
            }}
          >
            <span
              className="text-[13px] font-medium flex-shrink-0 w-[180px] truncate"
              style={{ color: "#868889" }}
              title={formatKey(key)}
            >
              {formatKey(key)}
            </span>
            <span className="text-[13px] text-[#DFE1E3] break-all">
              {String(value) || <span className="text-[#868889] italic">—</span>}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Application Card ─────────────────────────────────────────────────────────

function ApplicationCard({ application, isLast }) {
  const toast = useToast();
  const queryClient = useQueryClient();

  const user = application.user || {};
  const lab = application.lab || {};
  const formData = application.formData || {};

  const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ") || "Unknown";
  const email = user.email || application.submittedEmail || "";
  const labName = lab.name || "";
  const createdAt = application.appliedAt || application.createdAt;
  const dateLabel = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })
    : "";

  const [expanded, setExpanded] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(normaliseStatus(application.status));
  const [rejectionReason, setRejectionReason] = useState(application.rejectionReason || "");

  const { mutate: save, isPending: isSaving } = useMutation({
    mutationFn: () =>
      updateAdminLabApplicationStatus({
        id: application._id,
        status: selectedStatus,
        rejectionReason: selectedStatus === "rejected" ? rejectionReason : undefined,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["adminLabApplications"] });
      toast({ type: "success", title: "Saved", message: "Application updated successfully." });
    },
    onError: (e) =>
      toast({ type: "error", title: "Failed", message: e?.response?.data?.error || "Something went wrong." }),
  });

  const statusColor = STATUS_COLORS[selectedStatus] || STATUS_COLORS["pending"];

  return (
    <div style={{ borderBottom: isLast ? "none" : "1px solid #313335" }}>
      {/* Header row */}
      <button
        className="w-full flex items-center justify-between px-5 py-4 gap-4 hover:bg-[#ffffff04] transition-colors text-left"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <UserAvatar photo={user.profilePhoto} name={fullName} />
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[15px] font-semibold text-[#DFE1E3]">{fullName}</span>
            </div>
            {email && <p className="text-[13px] text-[#868889] mt-0.5">{email}</p>}
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {labName && (
            <span
              className="text-[12px] font-medium text-[#DFE1E3] px-2.5 py-1 rounded-[6px]"
              style={{ background: "#26282A", border: "1px solid #313335" }}
            >
              {labName}
            </span>
          )}
          <span
            className="text-[12px] font-semibold px-2.5 py-0.5 rounded-full hidden sm:inline"
            style={{ background: statusColor.bg, color: statusColor.text, border: `1px solid ${statusColor.border}` }}
          >
            {STATUS_LABELS[selectedStatus]}
          </span>
          {dateLabel && (
            <span className="text-[13px] text-[#ABADAF] hidden md:inline">{dateLabel}</span>
          )}
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            className="text-[#ABADAF] transition-transform duration-200 flex-shrink-0"
            style={{ transform: expanded ? "rotate(180deg)" : "rotate(0deg)" }}
          >
            <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-6 flex flex-col gap-6" style={{ borderTop: "1px solid #26282A" }}>

          {/* User info summary */}
          <div className="flex flex-wrap gap-4 pt-5">
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] text-[#868889] uppercase tracking-wide font-medium">Name</span>
              <span className="text-[14px] text-[#DFE1E3]">{fullName}</span>
            </div>
            {email && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-[#868889] uppercase tracking-wide font-medium">Email</span>
                <span className="text-[14px] text-[#DFE1E3]">{email}</span>
              </div>
            )}
            {labName && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-[#868889] uppercase tracking-wide font-medium">Requested Lab</span>
                <span className="text-[14px] text-[#DFE1E3]">{labName}</span>
              </div>
            )}
            {dateLabel && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-[#868889] uppercase tracking-wide font-medium">Applied</span>
                <span className="text-[14px] text-[#DFE1E3]">{dateLabel}</span>
              </div>
            )}
            {application.reviewedAt && (
              <div className="flex flex-col gap-0.5">
                <span className="text-[11px] text-[#868889] uppercase tracking-wide font-medium">Reviewed</span>
                <span className="text-[14px] text-[#DFE1E3]">
                  {new Date(application.reviewedAt).toLocaleDateString("en-US", { month: "numeric", day: "numeric", year: "numeric" })}
                </span>
              </div>
            )}
          </div>

          {/* Form data submitted by user */}
          <FormDataSection formData={formData} />

          {/* Status update */}
          <div className="flex flex-col gap-2">
            <p className="text-[14px] font-semibold text-[#DFE1E3]">Application Status</p>
            <p className="text-[12px] text-[#868889]">
              Pending → In Review → Approved / Rejected
            </p>
            <div className="max-w-[240px] mt-1">
              <StatusDropdown value={selectedStatus} onChange={setSelectedStatus} />
            </div>
          </div>

          {/* Rejection reason — only shown when rejected */}
          {selectedStatus === "rejected" && (
            <div className="flex flex-col gap-2">
              <p className="text-[14px] font-semibold text-[#DFE1E3]">Rejection Reason</p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Explain why this application is being rejected..."
                rows={3}
                className="w-full px-4 py-3 rounded-[8px] text-[14px] text-[#DFE1E3] placeholder:text-[#ABADAF] outline-none resize-none transition-colors"
                style={{ background: "#17191B", border: "1.5px solid #3B1414" }}
              />
            </div>
          )}

          {/* Save */}
          <div className="flex justify-end">
            <button
              onClick={() => save()}
              disabled={isSaving}
              className="flex items-center gap-2 px-4 py-2.5 rounded-[8px] text-[14px] font-semibold text-white bg-[#3B82F6] hover:bg-[#2563EB] transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <IconSave />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminLabApplicationsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["adminLabApplications"],
    queryFn: getAdminLabApplications,
  });

  const applications = data?.data?.applications ?? data?.applications ?? [];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return applications.filter((app) => {
      const user = app.user || {};
      const name = [user.firstName, user.lastName].filter(Boolean).join(" ").toLowerCase();
      const email = (user.email || app.submittedEmail || "").toLowerCase();
      const matchesSearch = !q || name.includes(q) || email.includes(q);
      const appStatus = normaliseStatus(app.status);
      const matchesStatus = !statusFilter || appStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [applications, search, statusFilter]);

  // Stats
  const counts = useMemo(() => {
    const c = { pending: 0, "in-review": 0, approved: 0, rejected: 0 };
    applications.forEach((app) => {
      const s = normaliseStatus(app.status);
      if (s in c) c[s]++;
    });
    return c;
  }, [applications]);

  const STATUS_FILTER_OPTIONS = [
    { value: "", label: "All Statuses" },
    { value: "pending", label: "Pending" },
    { value: "in-review", label: "In Review" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const activeFilterLabel = STATUS_FILTER_OPTIONS.find((o) => o.value === statusFilter)?.label || "All Statuses";

  return (
    <div className="min-h-screen px-6 md:px-10 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="textDisplay36 text-[#EFEFEE] mb-2">Lab Applications</h1>
        <p className="textBody18 text-[#ABADAF]">Review and manage lab partner portal access requests</p>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3 mb-6">
        <div
          className="flex items-center gap-2 px-3.5 py-3 flex-1 max-w-[660px] rounded-[8px]"
          style={{ background: "#17191B", border: "1.5px solid #26282A" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="flex-shrink-0">
            <path d="M21 21L16.514 16.506M19 10.5C19 15.194 15.194 19 10.5 19C5.806 19 2 15.194 2 10.5C2 5.806 5.806 2 10.5 2C15.194 2 19 5.806 19 10.5Z" stroke="#ABADAF" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email..."
            className="bg-transparent text-[#DFE1E3] text-[15px] placeholder-[#ABADAF] outline-none w-full"
          />
        </div>

        {/* Filter icon */}
        <button
          className="p-3 rounded-[8px] text-[#ABADAF] hover:text-[#DFE1E3] transition"
          style={{ background: "#17191B", border: "1.5px solid #26282A" }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M22 3H2L10 12.46V19L14 21V12.46L22 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Status dropdown */}
        <div className="relative">
          <button
            onClick={() => setStatusDropdownOpen((v) => !v)}
            className="flex items-center gap-2 px-4 py-3 rounded-[8px] text-[14px] font-medium text-[#DFE1E3] transition"
            style={{ background: "#17191B", border: "1.5px solid #26282A" }}
          >
            {activeFilterLabel}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          {statusDropdownOpen && (
            <div
              className="absolute right-0 top-full mt-1 z-20 rounded-[8px] py-1 min-w-[160px]"
              style={{ background: "#1C1E20", border: "1px solid #313335" }}
            >
              {STATUS_FILTER_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setStatusFilter(opt.value); setStatusDropdownOpen(false); }}
                  className="w-full text-left px-4 py-2 text-[14px] hover:bg-[#26282A] transition"
                  style={{ color: statusFilter === opt.value ? "#B88934" : "#DFE1E3" }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="flex gap-4 mb-6">
        <StatCard icon={<IconPending />}  count={counts["pending"]}   label="Pending"   borderColor="#3D2E0F" />
        <StatCard icon={<IconInReview />} count={counts["in-review"]} label="In Review" borderColor="#1A3050" />
        <StatCard icon={<IconApproved />} count={counts["approved"]}  label="Approved"  borderColor="#1A3824" />
        <StatCard icon={<IconRejected />} count={counts["rejected"]}  label="Rejected"  borderColor="#3B1414" />
      </div>

      {/* Applications List */}
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
            {search || statusFilter
              ? "No applications match your search."
              : "No lab applications yet."}
          </div>
        ) : (
          filtered.map((app, index) => (
            <ApplicationCard
              key={app._id}
              application={app}
              isLast={index === filtered.length - 1}
            />
          ))
        )}
      </div>
    </div>
  );
}
