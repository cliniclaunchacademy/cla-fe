"use client";

import { useState, useEffect, useCallback } from "react";
import api from "api/ApiAxiosInstance";

const NOTIFICATION_TYPES = [
  { value: "new_course",   label: "New Course" },
  { value: "new_lesson",   label: "New Lesson" },
  { value: "system_alert", label: "System Alert" },
  { value: "reminder",     label: "Reminder" },
  { value: "achievement",  label: "Achievement" },
  { value: "welcome",      label: "Welcome" },
  { value: "custom",       label: "Custom" },
];

const TYPE_COLORS = {
  new_course:   { bg: "#1A2C1A", text: "#4CAF70" },
  new_lesson:   { bg: "#1A2C1A", text: "#4CAF70" },
  system_alert: { bg: "#2C1A1A", text: "#EF5350" },
  reminder:     { bg: "#1A1F2C", text: "#5C9BF5" },
  achievement:  { bg: "#2C261A", text: "#B88934" },
  welcome:      { bg: "#1A252C", text: "#26C6DA" },
  custom:       { bg: "#26282A", text: "#ABADAF" },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function AdminNotificationsPage() {
  // Form
  const [title, setTitle]           = useState("");
  const [message, setMessage]       = useState("");
  const [type, setType]             = useState("custom");
  const [targetType, setTargetType] = useState("all");
  const [targetRole, setTargetRole] = useState("student");
  const [userSearch, setUserSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [userResults, setUserResults]     = useState([]);
  const [userSearchLoading, setUserSearchLoading] = useState(false);

  // Send
  const [sending, setSending]       = useState(false);
  const [sendResult, setSendResult] = useState(null);

  // History
  const [history, setHistory]           = useState([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [deletingId, setDeletingId]     = useState(null);

  // Load history
  const loadHistory = useCallback(async () => {
    try {
      setHistoryLoading(true);
      const res = await api.get("/admin/dashboard/notification-history?limit=50");
      setHistory(res.data?.notifications ?? []);
    } catch {
      // silent
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => { loadHistory(); }, [loadHistory]);

  // User search debounce
  useEffect(() => {
    if (targetType !== "user" || userSearch.trim().length < 2) {
      setUserResults([]);
      return;
    }
    const t = setTimeout(async () => {
      try {
        setUserSearchLoading(true);
        const res = await api.get(`/admin/users?search=${encodeURIComponent(userSearch)}&limit=20`);
        const users = res.data?.users ?? [];
        setUserResults(users.filter((u) => !selectedUsers.find((s) => s._id === u._id)));
      } catch {
        // silent
      } finally {
        setUserSearchLoading(false);
      }
    }, 350);
    return () => clearTimeout(t);
  }, [userSearch, targetType, selectedUsers]);

  const addUser = (user) => {
    setSelectedUsers((prev) => [...prev, user]);
    setUserSearch("");
    setUserResults([]);
  };

  const removeUser = (id) => setSelectedUsers((prev) => prev.filter((u) => u._id !== id));

  // Send
  const handleSend = async () => {
    if (!title.trim() || !message.trim()) return;
    if (targetType === "user" && selectedUsers.length === 0) return;

    setSending(true);
    setSendResult(null);
    try {
      const body = { title, message, type, targetType };
      if (targetType === "role") body.targetRole = targetRole;
      if (targetType === "user") body.targetUsers = selectedUsers.map((u) => u._id);

      const res = await api.post("/admin/notifications", body);
      setSendResult({ success: true, message: "Notification sent!", recipientCount: res.data?.recipientCount });
      setTitle(""); setMessage(""); setType("custom");
      setTargetType("all"); setTargetRole("student");
      setSelectedUsers([]); setUserSearch("");
      loadHistory();
    } catch (err) {
      setSendResult({ success: false, message: err?.response?.data?.error || "Failed to send." });
    } finally {
      setSending(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await api.delete(`/admin/notifications/${id}`);
      setHistory((prev) => prev.filter((n) => n._id !== id));
    } catch {
      // silent
    } finally {
      setDeletingId(null);
    }
  };

  const canSend = title.trim() && message.trim() && !(targetType === "user" && selectedUsers.length === 0);

  return (
    <section className="px-9 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="textDisplay40 text-[#EFEFEE]">Notifications</h1>
        <p className="textBody18 text-[#ABADAF] mt-1">Send and manage notifications to your users.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.1fr] gap-6">
        {/* ── Compose ── */}
        <div className="bg-[#1C1E20] rounded-[16px] border border-[#26282A] p-6 flex flex-col gap-5 h-fit">
          <h2 className="textHeading20 !font-bold text-[#EFEFEE]">Compose Notification</h2>

          {/* Title */}
          <div>
            <label className="block textLabel14 text-[#ABADAF] mb-1.5">Title</label>
            <input
              className="w-full bg-[#17191B] border border-[#26282A] text-[#EFEFEE] rounded-[8px] px-3 py-2.5 textBody14 placeholder-[#4A4C4E] focus:outline-none focus:border-[#B88934] transition duration-150"
              placeholder="e.g. New Course Available!"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Message */}
          <div>
            <label className="block textLabel14 text-[#ABADAF] mb-1.5">Message</label>
            <textarea
              rows={4}
              className="w-full bg-[#17191B] border border-[#26282A] text-[#EFEFEE] rounded-[8px] px-3 py-2.5 textBody14 placeholder-[#4A4C4E] focus:outline-none focus:border-[#B88934] transition duration-150 resize-none"
              placeholder="Write your notification message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Type */}
          <div>
            <label className="block textLabel14 text-[#ABADAF] mb-1.5">Notification Type</label>
            <div className="relative">
              <select
                className="w-full bg-[#17191B] border border-[#26282A] text-[#EFEFEE] rounded-[8px] px-3 py-2.5 textBody14 focus:outline-none focus:border-[#B88934] transition duration-150 appearance-none cursor-pointer"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {NOTIFICATION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M6 9L12 15L18 9" stroke="#ABADAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

          <div className="border-t border-[#26282A]" />

          {/* Target Type */}
          <div>
            <label className="block textLabel14 text-[#ABADAF] mb-1.5">Send To</label>
            <div className="flex gap-2">
              {["all", "role", "user"].map((t) => (
                <button
                  key={t}
                  onClick={() => setTargetType(t)}
                  className={`flex-1 py-2 rounded-[8px] textLabel14 border transition duration-150 ${
                    targetType === t
                      ? "bg-[#B88934] text-[#0A0A0A] border-[#B88934]"
                      : "bg-[#17191B] text-[#ABADAF] border-[#26282A] hover:border-[#B88934] hover:text-[#EFEFEE]"
                  }`}
                >
                  {t === "all" ? "All Users" : t === "role" ? "By Role" : "Specific Users"}
                </button>
              ))}
            </div>
          </div>

          {/* Role selector */}
          {targetType === "role" && (
            <div>
              <label className="block textLabel14 text-[#ABADAF] mb-1.5">Role</label>
              <div className="relative">
                <select
                  className="w-full bg-[#17191B] border border-[#26282A] text-[#EFEFEE] rounded-[8px] px-3 py-2.5 textBody14 focus:outline-none focus:border-[#B88934] transition duration-150 appearance-none cursor-pointer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                >
                  <option value="student">Students</option>
                  <option value="admin">Admins</option>
                </select>
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M6 9L12 15L18 9" stroke="#ABADAF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            </div>
          )}

          {/* User search */}
          {targetType === "user" && (
            <div>
              <label className="block textLabel14 text-[#ABADAF] mb-1.5">Search Users</label>
              <div className="relative">
                <input
                  className="w-full bg-[#17191B] border border-[#26282A] text-[#EFEFEE] rounded-[8px] px-3 py-2.5 textBody14 placeholder-[#4A4C4E] focus:outline-none focus:border-[#B88934] transition duration-150"
                  placeholder="Search by name or email..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                />
                {(userSearchLoading || userResults.length > 0) && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#1C1E20] border border-[#26282A] rounded-[8px] z-10 overflow-hidden shadow-lg">
                    {userSearchLoading ? (
                      <div className="px-4 py-3 text-[#ABADAF] textBody14">Searching...</div>
                    ) : (
                      userResults.map((user) => (
                        <button
                          key={user._id}
                          onClick={() => addUser(user)}
                          className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-[#26282A] transition duration-100 text-left"
                        >
                          <div className="w-7 h-7 rounded-full bg-[#37352B] flex items-center justify-center text-[#B88934] text-[11px] font-bold flex-shrink-0">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                          <div>
                            <p className="text-[#EFEFEE] textLabel14">{user.firstName} {user.lastName}</p>
                            <p className="text-[#ABADAF] textBody12">{user.email}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>

              {selectedUsers.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-1.5 bg-[#37352B] text-[#B88934] px-2.5 py-1 rounded-full textBody12 font-medium"
                    >
                      {user.firstName} {user.lastName}
                      <button onClick={() => removeUser(user._id)} className="hover:text-[#EFEFEE] transition duration-100 ml-0.5">
                        <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Feedback */}
          {sendResult && (
            <div className={`rounded-[8px] px-4 py-3 textBody14 font-medium border ${
              sendResult.success
                ? "bg-[#1A2C1A] border-[#2E6B3E] text-[#4CAF70]"
                : "bg-[#2C1A1A] border-[#6B2E2E] text-[#EF5350]"
            }`}>
              {sendResult.success
                ? `${sendResult.message} Sent to ${sendResult.recipientCount} recipient${sendResult.recipientCount !== 1 ? "s" : ""}.`
                : sendResult.message}
            </div>
          )}

          {/* Send button */}
          <button
            onClick={handleSend}
            disabled={sending || !canSend}
            className="w-full py-3 rounded-[10px] bg-[#B88934] text-[#0A0A0A] textLabel16 font-semibold hover:bg-[#A67A2E] active:bg-[#8F6A25] disabled:opacity-40 disabled:cursor-not-allowed transition duration-150"
          >
            {sending ? "Sending..." : "Send Notification"}
          </button>
        </div>

        {/* ── History ── */}
        <div className="bg-[#1C1E20] rounded-[16px] border border-[#26282A] p-6 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="textHeading20 !font-bold text-[#EFEFEE]">Sent History</h2>
            <span className="textBody12 text-[#ABADAF] bg-[#26282A] px-2.5 py-1 rounded-full">
              {history.length} total
            </span>
          </div>

          {historyLoading ? (
            <div className="flex items-center justify-center py-12 text-[#ABADAF] textBody14">
              Loading history...
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="opacity-20">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="#EFEFEE" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <p className="text-[#ABADAF] textBody14">No notifications sent yet.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 overflow-y-auto max-h-[65vh] pr-1">
              {history.map((notif) => {
                const colors = TYPE_COLORS[notif.type] ?? TYPE_COLORS.custom;
                return (
                  <div
                    key={notif._id}
                    className="bg-[#17191B] rounded-[10px] border border-[#26282A] p-4 flex flex-col gap-2"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span
                          className="textBody12 font-semibold px-2 py-0.5 rounded-full capitalize"
                          style={{ background: colors.bg, color: colors.text }}
                        >
                          {notif.type.replace(/_/g, " ")}
                        </span>
                        <span className="textBody12 font-medium px-2 py-0.5 rounded-full bg-[#26282A] text-[#ABADAF]">
                          {notif.targetType === "all"
                            ? "All Users"
                            : notif.targetType === "role"
                            ? `Role: ${notif.targetRole}`
                            : `${notif.targetUsers?.length ?? 0} user${(notif.targetUsers?.length ?? 0) !== 1 ? "s" : ""}`}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDelete(notif._id)}
                        disabled={deletingId === notif._id}
                        className="flex-shrink-0 text-[#4A4C4E] hover:text-[#EF5350] transition duration-150 disabled:opacity-40"
                        title="Delete"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M3 6H5H21M8 6V4a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </div>

                    <div>
                      <p className="text-[#EFEFEE] textLabel14 font-semibold leading-snug">{notif.title}</p>
                      <p className="text-[#ABADAF] textBody12 mt-1 leading-relaxed line-clamp-2">{notif.message}</p>
                    </div>

                    <p className="text-[#4A4C4E] textBody12">{formatDate(notif.sentAt || notif.createdAt)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
