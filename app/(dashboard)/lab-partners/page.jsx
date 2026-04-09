"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getStudentLabs } from "apis/student-labs.api";
import Loader from "@common/Loader";

// ─── Application status badge (shown when student has already applied) ────────

function ApplicationStatusBadge({ applicationStatus, rejectionReason }) {
  if (applicationStatus === "approved") {
    return null; // rendered separately as a login button in LabCard
  }

  if (applicationStatus === "pending") {
    return (
      <div
        className="flex items-center gap-2 px-3 py-[7px] rounded-full border"
        style={{ background: "#27200D", borderColor: "#3D2E0F" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#D97706" strokeWidth="1.5" />
          <path d="M12 7V12L15 14" stroke="#D97706" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[14px] font-medium" style={{ color: "#D97706" }}>Application Pending</span>
      </div>
    );
  }

  if (applicationStatus === "in-review") {
    return (
      <div
        className="flex items-center gap-2 px-3 py-[7px] rounded-full border"
        style={{ background: "#0D1A2D", borderColor: "#1A3050" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="#3B82F6" strokeWidth="1.5" />
          <path d="M8 12H12M12 12H16M12 12V8M12 12V16" stroke="#3B82F6" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span className="text-[14px] font-medium" style={{ color: "#3B82F6" }}>Under Review</span>
      </div>
    );
  }

  if (applicationStatus === "rejected") {
    return (
      <div className="flex flex-col items-center gap-1.5">
        <div
          className="flex items-center gap-2 px-3 py-[7px] rounded-full border"
          style={{ background: "#1F0D0D", borderColor: "#3B1414" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="#EF4444" strokeWidth="1.5" />
            <path d="M9 9L15 15M15 9L9 15" stroke="#EF4444" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <span className="text-[14px] font-medium" style={{ color: "#EF4444" }}>Application Rejected</span>
        </div>
        {rejectionReason && (
          <p className="text-[12px] text-[#868889] text-center max-w-[220px] leading-relaxed">
            {rejectionReason}
          </p>
        )}
      </div>
    );
  }

  return null;
}

// ─── Visit Portal badge (shown only when no application has been submitted) ───

function VisitPortalBadge() {
  return (
    <div
      className="flex items-center gap-2 px-3 py-[7px] rounded-full border"
      style={{ background: "#252115", borderColor: "#514920" }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18 13V19C18 19.5304 17.7893 20.0391 17.4142 20.4142C17.0391 20.7893 16.5304 21 16 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V8C3 7.46957 3.21071 6.96086 3.58579 6.58579C3.96086 6.21071 4.46957 6 5 6H11" stroke="#B59E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M15 3H21V9" stroke="#B59E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M10 14L21 3" stroke="#B59E1E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="text-[14px] font-medium" style={{ color: "#B59E1E" }}>Visit Portal</span>
    </div>
  );
}

function ComingSoonBadge({ releaseDate }) {
  const label = releaseDate
    ? new Date(releaseDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : null;
  return (
    <div
      className="flex items-center gap-2 px-3 py-[7px] rounded-full border"
      style={{ background: "#2C2313", borderColor: "#484942" }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="#B88934" strokeWidth="1.5"/>
        <path d="M12 7V12L15 15" stroke="#B88934" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="text-[14px] font-medium text-[#B88934]">
        Coming Soon{label ? ` · ${label}` : ""}
      </span>
    </div>
  );
}

function MaintenanceBadge() {
  return (
    <div
      className="flex items-center gap-2 px-3 py-[7px] rounded-full border"
      style={{ background: "#2C2313", borderColor: "#484942" }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="#B88934" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="text-[14px] font-medium text-[#B88934]">Under Maintenance</span>
    </div>
  );
}

// ─── Lab Card ─────────────────────────────────────────────────────────────────

function LabCard({ lab }) {
  const { status, applicationStatus, rejectionReason, portalUrl, releaseDate, maintenanceMsg } = lab;

  const hasApplied = applicationStatus !== null && applicationStatus !== undefined;
  const isApproved = applicationStatus === "approved";
  const isLive = status === "live";
  const isComingSoon = status === "coming_soon";
  const isMaintenance = status === "maintenance";

  const handleClick = () => {
    if (isLive && !hasApplied && portalUrl) {
      window.open(portalUrl, "_blank", "noopener,noreferrer");
    }
  };

  const clickable = isLive && !hasApplied && !!portalUrl;

  return (
    <div
      onClick={clickable ? handleClick : undefined}
      className={`flex flex-col items-center text-center px-10 py-6 rounded-[16px] border transition duration-200 w-[320px] ${
        clickable ? "cursor-pointer hover:border-[#B88934]" : ""
      }`}
      style={{
        background: isLive ? "#313335" : "#232420",
        borderColor: "#484942",
        borderWidth: "1.5px",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center justify-center rounded-[16px] mb-[14px] overflow-hidden flex-shrink-0"
        style={{
          width: 110,
          height: 100,
          background: isLive ? "#484942" : "#37352B",
        }}
      >
        {lab.logo ? (
          <Image src={lab.logo} alt={lab.name} width={90} height={80} className="object-contain" unoptimized />
        ) : (
          <span
            className="font-bold select-none"
            style={{ fontFamily: "Poppins, sans-serif", fontSize: 44, color: "#B88934", lineHeight: 1 }}
          >
            {lab.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toLowerCase()}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-3 w-full">
        <h2 className="font-bold" style={{ fontSize: 22, lineHeight: "130%", color: "#DFE1E3" }}>
          {lab.name}
        </h2>
        {lab.subheading && (
          <p className="text-[16px] text-[#ABADAF] w-full" style={{ lineHeight: "140%" }}>
            {lab.subheading}
          </p>
        )}

        {/* Status / CTA */}
        {isComingSoon && <ComingSoonBadge releaseDate={releaseDate} />}
        {isMaintenance && (
          <div className="flex flex-col items-center gap-1.5">
            <MaintenanceBadge />
            {maintenanceMsg && (
              <p className="text-[12px] text-[#868889] text-center max-w-[220px]">{maintenanceMsg}</p>
            )}
          </div>
        )}
        {isLive && (
          isApproved && portalUrl
            ? (
              <a
                href={portalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-2 px-4 py-2 rounded-full border transition hover:opacity-90"
                style={{ background: "#252115", borderColor: "#514920" }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="#B59E1E" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span className="text-[14px] font-medium" style={{ color: "#B59E1E" }}>Login to Portal</span>
              </a>
            )
            : hasApplied
              ? <ApplicationStatusBadge applicationStatus={applicationStatus} rejectionReason={rejectionReason} />
              : <VisitPortalBadge />
        )}
      </div>
    </div>
  );
}

// ─── Embedded Form Modal ──────────────────────────────────────────────────────
// Not used here — applications arrive via GHL webhook automatically.
// The embed is shown inline below each approved card if portalUrl is not set.

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function LabPartnersPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["studentLabs"],
    queryFn: getStudentLabs,
  });

  const labs = data?.data?.labs ?? data?.labs ?? [];

  return (
    <section className="w-full px-9 py-10 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h1 className="textDisplay40 text-[#EFEFEE]">Lab Partners</h1>
        <p className="textBody18 text-[#ABADAF]">
          Access exclusive wholesale pricing from our trusted laboratory partners
        </p>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader isLoading={true} />
        </div>
      ) : labs.length === 0 ? (
        <p className="text-[#ABADAF] text-[16px]">No labs available yet.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {labs.map((lab) => (
            <LabCard key={lab._id} lab={lab} />
          ))}
        </div>
      )}
    </section>
  );
}
