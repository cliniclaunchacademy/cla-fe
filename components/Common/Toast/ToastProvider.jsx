"use client";

import { createContext, useContext, useState, useCallback, useEffect } from "react";

const ToastContext = createContext(null);

const CONFIG = {
  success: {
    bg: "#0D1A0D",
    border: "#1E3A1E",
    accent: "#6FCF6F",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="#6FCF6F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  error: {
    bg: "#1A0D0D",
    border: "#3A1A1A",
    accent: "#FF6B6B",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 8V12M12 16H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
          stroke="#FF6B6B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  warning: {
    bg: "#1C1508",
    border: "#50392A",
    accent: "#B88934",
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 9V13M12 17H12.01M5.07183 19H18.9282C20.4678 19 21.4301 17.3333 20.6603 16L13.7321 4C12.9623 2.66667 11.0378 2.66667 10.268 4L3.33978 16C2.56998 17.3333 3.53223 19 5.07183 19Z"
          stroke="#B88934" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
};

let _id = 0;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => {
    setToasts((prev) => prev.map((t) => t.id === id ? { ...t, leaving: true } : t));
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 350);
  }, []);

  const toast = useCallback(({ type = "success", title, message, duration = 4000 }) => {
    const id = ++_id;
    setToasts((prev) => [...prev, { id, type, title, message, leaving: false }]);
    setTimeout(() => dismiss(id), duration);
  }, [dismiss]);

  useEffect(() => {
    const handler = (e) => toast(e.detail);
    window.addEventListener("app:toast", handler);
    return () => window.removeEventListener("app:toast", handler);
  }, [toast]);

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((t) => {
          const cfg = CONFIG[t.type] || CONFIG.success;
          return (
            <div
              key={t.id}
              style={{
                backgroundColor: cfg.bg,
                borderColor: cfg.border,
                animation: t.leaving
                  ? "toastOut 0.35s ease forwards"
                  : "toastIn 0.35s ease forwards",
              }}
              className="pointer-events-auto relative w-[300px] border-2 rounded-[12px] px-4 py-3 shadow-xl"
            >
              {/* Content */}
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div
                  style={{ borderColor: cfg.border, backgroundColor: cfg.bg }}
                  className="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                >
                  {cfg.icon}
                </div>

                {/* Text */}
                <div>
                  {t.title && (
                    <p style={{ color: cfg.accent }} className="textLabel16 !font-bold leading-snug">
                      {t.title}
                    </p>
                  )}
                  {t.message && (
                    <p style={{ color: cfg.accent }} className="textBody14 leading-snug opacity-90">
                      {t.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
