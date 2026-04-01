"use client";

import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAdminUsers,
  createAdminUser,
  updateAdminUser,
  banAdminUser,
  unbanAdminUser,
  resendWelcomeEmail,
  deleteAdminUser,
} from "apis/admin-users.api";
import { useToast } from "@components/Common/Toast/ToastProvider";
import Loader from "@common/Loader";

// ─── Badges ──────────────────────────────────────────────────────────────────

function RoleBadge({ role }) {
  if (role === "admin" || role === "superAdmin") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-[8px] border-2 border-[#37352B] bg-[#AA7C3022] textLabel14 text-[#B88934] capitalize">
        {role === "superAdmin" ? "Super Admin" : "Admin"}
      </span>
    );
  }
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded-[8px] textLabel14"
      style={{
        background: "linear-gradient(0deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), #333525",
        border: "2px solid #514920",
        color: "#B59E1E",
      }}
    >
      Authenticated
    </span>
  );
}

function StatusBadge({ status }) {
  if (status === "active") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-[8px] textLabel14 text-[#13B882] bg-[#24312D] border-2 border-[#32564A]">
        Active
      </span>
    );
  }
  if (status === "banned") {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-[8px] textLabel14 text-[#C0696B] bg-[#2D1C1C] border-2 border-[#56323A]">
        Banned
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-[8px] textLabel14 text-[#ABADAF] bg-[#1C1E20] border-2 border-[#313335]">
      Inactive
    </span>
  );
}

function Avatar({ firstName, lastName, profilePhoto }) {
  if (profilePhoto) {
    return <img src={profilePhoto} alt="" className="w-[46px] h-[46px] rounded-full object-cover flex-shrink-0" />;
  }
  const initial = firstName?.[0]?.toUpperCase() || "?";
  return (
    <div className="w-[46px] h-[46px] rounded-full bg-[#37352B] flex items-center justify-center flex-shrink-0">
      <span className="text-[18px] font-bold text-[#B88934]">{initial}</span>
    </div>
  );
}

function formatLastLogin(dateStr) {
  if (!dateStr) return "Never";
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Add / Edit Modal ─────────────────────────────────────────────────────────

const EMPTY_FORM = { firstName: "", lastName: "", username: "", email: "", password: "", role: "student", sendWelcomeEmail: true };

function UserModal({ mode, user, onClose, onSave, isSaving }) {
  const [form, setForm] = useState(
    mode === "edit" && user
      ? { firstName: user.firstName || "", lastName: user.lastName || "", username: user.username || "", email: user.email || "", role: user.role || "student", password: "" }
      : EMPTY_FORM
  );

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = { ...form };
    if (mode === "edit" && !payload.password) delete payload.password;
    onSave(payload);
  };

  const inputCls = "w-full bg-[#17191B] border border-[#484942] text-[#DFE1E3] textBody14 rounded-[8px] px-3 py-2 focus:outline-none focus:border-[#B88934] transition";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#1C1E20] border border-[#313335] rounded-[14px] w-full max-w-[480px] mx-4 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="textHeading20 text-[#DFE1E3]">{mode === "edit" ? "Edit User" : "Add User"}</h2>
          <button onClick={onClose} className="text-[#ABADAF] hover:text-[#DFE1E3] transition">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="textLabel14 text-[#ABADAF] mb-1 block">First Name</label>
              <input value={form.firstName} onChange={(e) => set("firstName", e.target.value)} placeholder="First name" required className={inputCls} />
            </div>
            <div className="flex-1">
              <label className="textLabel14 text-[#ABADAF] mb-1 block">Last Name</label>
              <input value={form.lastName} onChange={(e) => set("lastName", e.target.value)} placeholder="Last name" required className={inputCls} />
            </div>
          </div>
          <div>
            <label className="textLabel14 text-[#ABADAF] mb-1 block">Username</label>
            <input value={form.username} onChange={(e) => set("username", e.target.value)} placeholder="username" required className={inputCls} />
          </div>
          <div>
            <label className="textLabel14 text-[#ABADAF] mb-1 block">Email</label>
            <input type="email" value={form.email} onChange={(e) => set("email", e.target.value)} placeholder="user@example.com" required className={inputCls} />
          </div>
          <div>
            <label className="textLabel14 text-[#ABADAF] mb-1 block">
              Password {mode === "edit" && <span className="text-[#ABADAF] font-normal">(leave blank to keep current)</span>}
            </label>
            <input type="password" value={form.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••••" required={mode === "add"} minLength={8} className={inputCls} />
          </div>
          <div>
            <label className="textLabel14 text-[#ABADAF] mb-1 block">Role</label>
            <select value={form.role} onChange={(e) => set("role", e.target.value)} className={inputCls}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {mode === "add" && (
            <label className="flex items-center gap-3 cursor-pointer group">
              <div
                onClick={() => set("sendWelcomeEmail", !form.sendWelcomeEmail)}
                className={`w-5 h-5 rounded-[4px] border-2 flex items-center justify-center flex-shrink-0 transition duration-200 ${
                  form.sendWelcomeEmail
                    ? "bg-[#B88934] border-[#B88934]"
                    : "bg-transparent border-[#484942] group-hover:border-[#B88934]"
                }`}
              >
                {form.sendWelcomeEmail && (
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4L4 7L10 1" stroke="#2C2313" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                checked={form.sendWelcomeEmail}
                onChange={(e) => set("sendWelcomeEmail", e.target.checked)}
                className="sr-only"
              />
              <div>
                <p className="textLabel14 text-[#DFE1E3]">Send welcome email</p>
                <p className="textBody12 text-[#ABADAF]">Email the user their login credentials</p>
              </div>
            </label>
          )}

          <div className="flex gap-3 mt-2">
            <button type="button" onClick={onClose} className="flex-1 textLabel14 text-[#ABADAF] border border-[#484942] rounded-[8px] py-2.5 hover:border-[#B88934] hover:text-[#B88934] transition">
              Cancel
            </button>
            <button type="submit" disabled={isSaving} className="flex-1 textLabel14 bg-[#B88934] hover:bg-[#DFAF32] text-[#2C2313] rounded-[8px] py-2.5 transition disabled:opacity-50 disabled:cursor-not-allowed">
              {isSaving ? "Saving..." : mode === "edit" ? "Save Changes" : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────

function ConfirmDialog({ title, message, confirmLabel, danger, onConfirm, onCancel, isLoading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-[#1C1E20] border border-[#313335] rounded-[14px] w-full max-w-[380px] mx-4 p-6">
        <h2 className="textHeading20 text-[#DFE1E3] mb-2">{title}</h2>
        <p className="textBody14 text-[#ABADAF] mb-6">{message}</p>
        <div className="flex gap-3">
          <button onClick={onCancel} className="flex-1 textLabel14 text-[#ABADAF] border border-[#484942] rounded-[8px] py-2.5 hover:border-[#B88934] hover:text-[#B88934] transition">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 textLabel14 rounded-[8px] py-2.5 transition disabled:opacity-50 disabled:cursor-not-allowed ${danger ? "bg-[#C0696B] hover:bg-[#d07375] text-white" : "bg-[#B88934] hover:bg-[#DFAF32] text-[#2C2313]"}`}
          >
            {isLoading ? "Please wait..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-5 py-3.5 border-t border-[#313335]">
      <span className="textBody14 text-[#ABADAF]">Page {page} of {totalPages}</span>
      <div className="flex gap-2">
        <button
          onClick={() => onPage(page - 1)}
          disabled={page === 1}
          className="textLabel14 text-[#ABADAF] border border-[#484942] rounded-[8px] px-3 py-1.5 hover:border-[#B88934] hover:text-[#B88934] transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPage(page + 1)}
          disabled={page === totalPages}
          className="textLabel14 text-[#ABADAF] border border-[#484942] rounded-[8px] px-3 py-1.5 hover:border-[#B88934] hover:text-[#B88934] transition disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function UserManagementPage() {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const [modal, setModal] = useState(null); // { type: "add" | "edit", user? }
  const [confirm, setConfirm] = useState(null); // { type: "ban"|"unban"|"delete"|"email", user }

  const queryKey = ["adminUsers", { page, search, role: roleFilter, status: statusFilter }];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () => getAdminUsers({ page, limit: 20, search, role: roleFilter, status: statusFilter }),
    keepPreviousData: true,
  });

  const users = data?.data?.users || [];
  const pagination = data?.data?.pagination;

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["adminUsers"] });

  const { mutate: doCreate, isPending: isCreating } = useMutation({
    mutationFn: createAdminUser,
    onSuccess: () => { invalidate(); setModal(null); toast({ type: "success", title: "User created", message: "New user has been added." }); },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.message || "Something went wrong." }),
  });

  const { mutate: doUpdate, isPending: isUpdating } = useMutation({
    mutationFn: updateAdminUser,
    onSuccess: () => { invalidate(); setModal(null); toast({ type: "success", title: "User updated", message: "Changes have been saved." }); },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.message || "Something went wrong." }),
  });

  const { mutate: doBan, isPending: isBanning } = useMutation({
    mutationFn: banAdminUser,
    onSuccess: () => { invalidate(); setConfirm(null); toast({ type: "success", title: "User banned", message: "The user has been banned." }); },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.message || "Something went wrong." }),
  });

  const { mutate: doUnban, isPending: isUnbanning } = useMutation({
    mutationFn: unbanAdminUser,
    onSuccess: () => { invalidate(); setConfirm(null); toast({ type: "success", title: "User unbanned", message: "The user has been restored." }); },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.message || "Something went wrong." }),
  });

  const { mutate: doResend, isPending: isResending } = useMutation({
    mutationFn: resendWelcomeEmail,
    onSuccess: () => { setConfirm(null); toast({ type: "success", title: "Email sent", message: "Welcome email has been sent." }); },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.message || "Something went wrong." }),
  });

  const { mutate: doDelete, isPending: isDeleting } = useMutation({
    mutationFn: deleteAdminUser,
    onSuccess: () => { invalidate(); setConfirm(null); toast({ type: "success", title: "User deleted", message: "The user has been removed." }); },
    onError: (e) => toast({ type: "error", title: "Failed", message: e?.response?.data?.message || "Something went wrong." }),
  });

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value);
    setPage(1);
  }, []);

  const handleConfirm = () => {
    if (!confirm) return;
    if (confirm.type === "ban") doBan(confirm.user._id);
    else if (confirm.type === "unban") doUnban(confirm.user._id);
    else if (confirm.type === "delete") doDelete(confirm.user._id);
    else if (confirm.type === "email") doResend(confirm.user._id);
  };

  const confirmLoading = isBanning || isUnbanning || isDeleting || isResending;

  const confirmConfig = confirm ? {
    ban:    { title: "Ban User", message: `Ban ${confirm.user.firstName} ${confirm.user.lastName}? They won't be able to log in.`, confirmLabel: "Ban User", danger: true },
    unban:  { title: "Unban User", message: `Restore access for ${confirm.user.firstName} ${confirm.user.lastName}?`, confirmLabel: "Unban", danger: false },
    delete: { title: "Delete User", message: `Permanently delete ${confirm.user.firstName} ${confirm.user.lastName}? This cannot be undone.`, confirmLabel: "Delete", danger: true },
    email:  { title: "Resend Email", message: `Send a welcome email to ${confirm.user.email}?`, confirmLabel: "Send Email", danger: false },
  }[confirm.type] : null;

  return (
    <div className="min-h-screen px-6 md:px-10 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="textDisplay36 text-[#EFEFEE] mb-2">User Management</h1>
          <p className="textBody18 text-[#ABADAF]">Manage users, roles and permissions</p>
        </div>
        <button
          onClick={() => setModal({ type: "add" })}
          className="flex items-center gap-2 bg-[#B88934] hover:bg-[#DFAF32] active:bg-[#B88934] text-[#2C2313] textHeading16 px-4 py-3 rounded-[8px] transition duration-200 flex-shrink-0"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          Add User
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
              onChange={handleSearch}
              placeholder="Search users..."
              className="bg-transparent text-[#DFE1E3] textLabel16 placeholder-[#ABADAF] outline-none w-full"
            />
          </div>
          <button
            onClick={() => setShowFilters((p) => !p)}
            className={`flex items-center gap-2 border-[1.8px] textLabel16 px-3.5 py-2.5 rounded-[8px] transition duration-200 flex-shrink-0 ${showFilters ? "border-[#B88934] text-[#B88934]" : "border-[#ABADAF] text-[#DFE1E3] hover:border-[#B88934] hover:text-[#B88934]"}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M3 6H21M6 12H18M10 18H14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Filters
          </button>
        </div>

        {showFilters && (
          <div className="flex items-center gap-3">
            <select
              value={roleFilter}
              onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
              className="bg-[#17191B] border border-[#484942] text-[#DFE1E3] textBody14 rounded-[8px] px-3 py-2 focus:outline-none focus:border-[#B88934] transition"
            >
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-[#17191B] border border-[#484942] text-[#DFE1E3] textBody14 rounded-[8px] px-3 py-2 focus:outline-none focus:border-[#B88934] transition"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="banned">Banned</option>
              <option value="inactive">Inactive</option>
            </select>
            {(roleFilter || statusFilter) && (
              <button
                onClick={() => { setRoleFilter(""); setStatusFilter(""); setPage(1); }}
                className="textLabel14 text-[#ABADAF] hover:text-[#DFE1E3] transition"
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="bg-[#1C1E20] border border-[#313335] rounded-[14px] overflow-hidden">
        {/* Table Header */}
        <div className="flex items-center px-5 py-3.5 border-b border-[#313335]">
          <span className="textLabel16 text-[#DFE1E3] w-[280px]">User</span>
          <span className="textLabel16 text-[#DFE1E3] w-[240px]">Email</span>
          <span className="textLabel16 text-[#DFE1E3] w-[160px]">Role</span>
          <span className="textLabel16 text-[#DFE1E3] w-[120px]">Status</span>
          <span className="textLabel16 text-[#DFE1E3] flex-1">Last Login</span>
          <span className="textLabel16 text-[#DFE1E3] text-right w-[180px]">Actions</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader isLoading={true} />
          </div>
        ) : users.length === 0 ? (
          <div className="px-5 py-16 text-center textBody16 text-[#ABADAF]">No users found.</div>
        ) : (
          users.map((user) => (
            <div key={user._id} className="flex items-center px-5 py-4 bg-[#26282A] border-b border-[#313335] last:border-b-0">
              {/* User */}
              <div className="flex items-center gap-3.5 w-[280px]">
                <Avatar firstName={user.firstName} lastName={user.lastName} profilePhoto={user.profilePhoto} />
                <div className="min-w-0">
                  <p className="textLabel16 text-[#DFE1E3] truncate">{user.firstName} {user.lastName}</p>
                  <p className="textBody14 text-[#ABADAF] truncate">@{user.username}</p>
                </div>
              </div>

              {/* Email */}
              <div className="w-[240px]">
                <span className="textBody16 text-[#DFE1E3] truncate block">{user.email}</span>
              </div>

              {/* Role */}
              <div className="w-[160px]">
                <RoleBadge role={user.role} />
              </div>

              {/* Status */}
              <div className="w-[120px]">
                <StatusBadge status={user.status} />
              </div>

              {/* Last Login */}
              <div className="flex-1">
                <span className="textBody16 text-[#ABADAF]">{formatLastLogin(user.lastLogin)}</span>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-4 w-[180px] justify-end">
                <button
                  onClick={() => setModal({ type: "edit", user })}
                  className="text-[#ABADAF] hover:text-[#DFE1E3] transition duration-200"
                  title="Edit"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.43741 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <button
                  onClick={() => setConfirm({ type: user.status === "banned" ? "unban" : "ban", user })}
                  className="text-[#D1BE4E] hover:text-[#DFAF32] transition duration-200"
                  title={user.status === "banned" ? "Unban" : "Ban"}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M4.93 4.93L19.07 19.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                </button>

                <button
                  onClick={() => setConfirm({ type: "email", user })}
                  className="text-[#ABADAF] hover:text-[#DFE1E3] transition duration-200"
                  title="Resend welcome email"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M22 6L12 13L2 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>

                <button
                  onClick={() => setConfirm({ type: "delete", user })}
                  className="text-[#C0696B] hover:text-[#e07375] transition duration-200"
                  title="Delete"
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M3 6H5H21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6L18.1324 19.1313C18.0579 20.1928 17.1719 21 16.1076 21H7.89238C6.82811 21 5.94208 20.1928 5.86756 19.1313L5 6H19Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}

        <Pagination page={page} totalPages={pagination?.pages || 1} onPage={setPage} />
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <UserModal
          mode={modal.type}
          user={modal.user}
          onClose={() => setModal(null)}
          isSaving={isCreating || isUpdating}
          onSave={(payload) => {
            if (modal.type === "add") doCreate(payload);
            else doUpdate({ userId: modal.user._id, data: payload });
          }}
        />
      )}

      {/* Confirm Dialog */}
      {confirm && confirmConfig && (
        <ConfirmDialog
          {...confirmConfig}
          isLoading={confirmLoading}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
