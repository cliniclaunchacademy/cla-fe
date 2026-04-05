"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { createPortal } from "react-dom";
import {
  getStudentNotifications,
  markAllNotificationsRead,
  markNotificationRead,
} from "apis/student-notifications.api";

// ── Type icon config ────────────────────────────────────────────────────────
const TYPE_CONFIG = {
  new_course: {
    bg: "#1A2C1A", border: "#2E6B3E",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 19.5C4 18.837 4.26339 18.2011 4.73223 17.7322C5.20107 17.2634 5.83696 17 6.5 17H20M4 19.5C4 20.163 4.26339 20.7989 4.73223 21.2678C5.20107 21.7366 5.83696 22 6.5 22H20V2H6.5C5.83696 2 5.20107 2.26339 4.73223 2.73223C4.26339 3.20107 4 3.83696 4 4.5V19.5Z" stroke="#4CAF70" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  new_lesson: {
    bg: "#1A2C1A", border: "#2E6B3E",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#4CAF70" strokeWidth="1.5"/><path d="M10 8L16 12L10 16V8Z" fill="#4CAF70"/></svg>,
  },
  system_alert: {
    bg: "#1F192A", border: "#45305E",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#AE8AD9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  reminder: {
    bg: "#252115", border: "#514920",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#B59E1E" strokeWidth="1.5"/><path d="M12 7V12L15 15" stroke="#B59E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  achievement: {
    bg: "#2C261A", border: "#514920",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" stroke="#B88934" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
  welcome: {
    bg: "#1F192A", border: "#45305E",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3C12 3 4 7 4 13C4 16.3137 7.68629 19 12 19C16.3137 19 20 16.3137 20 13C20 7 12 3 12 3Z" stroke="#D98DDA" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 19V22M9 22H15" stroke="#D98DDA" strokeWidth="1.5" strokeLinecap="round"/></svg>,
  },
  custom: {
    bg: "#1F192A", border: "#45305E",
    icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="#AE8AD9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  },
};


function formatTime(iso) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

function isToday(iso) {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate();
}

function NotifItem({ item, onRead }) {
  const notif = item.notification;
  const cfg = TYPE_CONFIG[notif?.type] ?? TYPE_CONFIG.custom;
  const rowRef = useRef(null);

  useEffect(() => {
    if (item.read || !rowRef.current) return;
    let timer = null;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          timer = setTimeout(() => onRead(item._id), 2000);
        } else {
          clearTimeout(timer);
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(rowRef.current);
    return () => { observer.disconnect(); clearTimeout(timer); };
  }, [item._id, item.read, onRead]);

  return (
    <div ref={rowRef} className="border-b border-[#26282A] last:border-b-0">
      <div className="flex items-start gap-3 px-5 py-4">
        <div
          className="flex-shrink-0 w-10 h-10 rounded-[8px] flex items-center justify-center border"
          style={{ background: cfg.bg, borderColor: cfg.border }}
        >
          {cfg.icon}
        </div>

        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-[#EFEFEE] text-[16px] font-medium leading-snug">{notif?.title}</p>
            {!item.read && <span className="w-2 h-2 rounded-full bg-[#B88934] flex-shrink-0" />}
          </div>
          <p className="text-[#ABADAF] text-[14px] leading-relaxed">{notif?.message}</p>

          <span className="text-[#868889] text-[12px]">{formatTime(notif?.sentAt || item.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}

export default function NotificationPanel({ isOpen, onClose }) {
  const [mounted, setMounted] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const panelRef = useRef(null);

  // Only enable portal after client mount
  useEffect(() => { setMounted(true); }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getStudentNotifications();
      setNotifications(res.data?.notifications ?? []);
    } catch {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    load().then(() => markAllNotificationsRead().catch(() => {})).catch(() => {});
  }, [isOpen, load]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen, onClose]);

  const handleMarkRead = useCallback(async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => n._id === id ? { ...n, read: true } : n));
    } catch { }
  }, []);

  if (!mounted || !isOpen) return null;

  const todayItems = notifications.filter((n) => isToday(n.notification?.sentAt || n.createdAt));
  const olderItems = notifications.filter((n) => !isToday(n.notification?.sentAt || n.createdAt));

  return createPortal(
    <div
      ref={panelRef}
      style={{
        position: "fixed",
        top: "16px",
        left: "268px",
        width: "430px",
        maxHeight: "calc(100vh - 32px)",
        background: "#1C1E20",
        border: "2px solid #313335",
        borderRadius: "16px",
        zIndex: 99999,
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 24px", borderBottom: "1px solid #26282A", flexShrink: 0 }}>
        <p style={{ color: "#EFEFEE", fontSize: 18, fontWeight: 600 }}>Notifications</p>
        <button onClick={onClose} style={{ color: "#ABADAF", background: "none", border: "none", cursor: "pointer", padding: 4 }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
        </button>
      </div>

      {/* Body */}
      <div style={{ overflowY: "auto", flex: 1 }}>
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", padding: "48px 0", color: "#ABADAF", fontSize: 14 }}>Loading...</div>
        ) : notifications.length === 0 ? (
          <div style={{ padding: "16px 20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: "#17191B", border: "1px solid #26282A", borderRadius: 12 }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: "#1F192A", border: "1px solid #45305E", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="#AE8AD9" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div>
                <p style={{ color: "#EFEFEE", fontSize: 14, fontWeight: 500 }}>No notifications</p>
                <p style={{ color: "#ABADAF", fontSize: 12, marginTop: 2 }}>You're all caught up!</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {todayItems.length > 0 && (
              <div>
                <p style={{ padding: "16px 28px 8px", color: "#868889", fontSize: 15, fontWeight: 600 }}>Today</p>
                {todayItems.map((item) => <NotifItem key={item._id} item={item} onRead={handleMarkRead} />)}
              </div>
            )}
            {olderItems.length > 0 && (
              <div>
                <p style={{ padding: "16px 28px 8px", color: "#868889", fontSize: 15, fontWeight: 600 }}>Older</p>
                {olderItems.map((item) => <NotifItem key={item._id} item={item} onRead={handleMarkRead} />)}
              </div>
            )}
          </>
        )}
      </div>
    </div>,
    document.body
  );
}
