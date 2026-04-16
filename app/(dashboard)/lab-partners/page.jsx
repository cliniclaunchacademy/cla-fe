"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getStudentLabs } from "apis/student-labs.api";
import Loader from "@common/Loader";

// ─── Application status badge ─────────────────────────────────────────────────

function ApplicationStatusBadge({ applicationStatus, rejectionReason }) {
  if (applicationStatus === "approved") return null;

  if (applicationStatus === "pending") {
    return (
      <div
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[10px] text-[13px] font-medium"
        style={{ background: "#1E1608", border: "1px solid #3D2E0F", color: "#D97706" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 7V12L15 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Application Pending
      </div>
    );
  }

  if (applicationStatus === "in-review") {
    return (
      <div
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[10px] text-[13px] font-medium"
        style={{ background: "#0A1525", border: "1px solid #1A3050", color: "#60A5FA" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="1.8" />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        Under Review
      </div>
    );
  }

  if (applicationStatus === "rejected") {
    return (
      <div className="flex flex-col gap-2">
        <div
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[10px] text-[13px] font-medium"
          style={{ background: "#1A0A0A", border: "1px solid #3B1414", color: "#F87171" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
            <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          Application Rejected
        </div>
        {rejectionReason && (
          <p className="text-[12px] text-[#868889] text-center leading-relaxed">{rejectionReason}</p>
        )}
      </div>
    );
  }

  return null;
}

// ─── Apply Now CTA ────────────────────────────────────────────────────────────

function VisitPortalBadge({ application_url }) {
  return (
    <a
      href={application_url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[10px] text-[14px] font-semibold transition-opacity duration-200 hover:opacity-85"
      style={{ background: "linear-gradient(90deg, #B88934, #DFAF32)", color: "#1C1408" }}
    >
      Apply Now
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path d="M5 12h14M13 6l6 6-6 6" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </a>
  );
}

function ComingSoonBadge({ releaseDate }) {
  const label = releaseDate
    ? new Date(releaseDate).toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : null;
  return (
    <div
      className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[10px] text-[13px] font-medium text-[#B88934]"
      style={{ background: "#1C1608", border: "1px solid #3D2E10" }}
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 7V12L15 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      Coming Soon{label ? ` · ${label}` : ""}
    </div>
  );
}

function MaintenanceBadge({ maintenanceMsg }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[10px] text-[13px] font-medium text-[#F59E0B]"
        style={{ background: "#1C1407", border: "1px solid #3D2D05" }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Under Maintenance
      </div>
      {maintenanceMsg && (
        <p className="text-[12px] text-[#868889] text-center leading-relaxed">{maintenanceMsg}</p>
      )}
    </div>
  );
}

// ─── Lab Card ─────────────────────────────────────────────────────────────────

function LabCard({ lab }) {
  const { status, applicationStatus, rejectionReason, portalUrl, releaseDate, maintenanceMsg, applicationEmbed: application_url } = lab;

  const hasApplied = applicationStatus !== null && applicationStatus !== undefined;
  const isApproved = applicationStatus === "approved";
  const isLive = status === "live";
  const isComingSoon = status === "coming_soon";
  const isMaintenance = status === "maintenance";

  const handleClick = () => {
    if (isLive && !hasApplied && application_url) {
      window.open(application_url, "_blank", "noopener,noreferrer");
    }
  };

  const clickable = isLive && !hasApplied && !!application_url;

  return (
    <div
      onClick={clickable ? handleClick : undefined}
      className={`group flex flex-col rounded-[16px] overflow-hidden border-[1.5px] transition-all duration-200 ${
        clickable
          ? "cursor-pointer border-[#2A2C2E] hover:border-[#B88934]"
          : "border-[#26282A]"
      }`}
      style={{ background: "#1C1E20" }}
    >
      {/* Gold accent top strip — live only */}
      {isLive && (
        <div
          className="h-[2px] w-full flex-shrink-0"
          style={{ background: "linear-gradient(90deg, transparent 0%, #B88934 30%, #DFAF32 70%, transparent 100%)" }}
        />
      )}

      {/* Logo zone */}
      <div className="relative flex items-center justify-center py-8" style={{ background: "#141618" }}>
        {/* Status pill — top-right corner */}
        <div className="absolute top-3 right-3">
          {isLive && (
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-full"
              style={{ background: "#0D1F0F", border: "1px solid #1A3D1E" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#4ADE80] animate-pulse" />
              <span className="text-[11px] font-medium text-[#4ADE80]">Live</span>
            </div>
          )}
          {isComingSoon && (
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-full"
              style={{ background: "#1C1608", border: "1px solid #3D2E10" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#B88934]" />
              <span className="text-[11px] font-medium text-[#B88934]">Soon</span>
            </div>
          )}
          {isMaintenance && (
            <div
              className="flex items-center gap-1.5 px-2 py-1 rounded-full"
              style={{ background: "#1C1407", border: "1px solid #3D2D05" }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
              <span className="text-[11px] font-medium text-[#F59E0B]">Maint.</span>
            </div>
          )}
        </div>

        {/* Logo container */}
        <div
          className={`flex items-center justify-center rounded-[14px] overflow-hidden transition-transform duration-200 ${
            clickable ? "group-hover:scale-105" : ""
          } ${!isLive ? "opacity-40" : ""}`}
          style={{ width: 88, height: 88, background: "#232527", border: "1px solid #2E3032" }}
        >
          {lab.logo ? (
            <Image src={lab.logo} alt={lab.name} width={72} height={72} className="object-contain" unoptimized />
          ) : (
            <span
              className="font-bold select-none"
              style={{ fontFamily: "Poppins, sans-serif", fontSize: 38, color: "#B88934", lineHeight: 1 }}
            >
              {lab.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toLowerCase()}
            </span>
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "#26282A" }} />

      {/* Content */}
      <div className="flex flex-col gap-4 p-5 flex-1">
        <div className="flex flex-col gap-1">
          <h2 className="text-[17px] font-semibold text-[#DFE1E3] leading-snug">{lab.name}</h2>
          {lab.subheading && (
            <p className="text-[13px] text-[#868889] leading-relaxed">{lab.subheading}</p>
          )}
        </div>

        {/* CTA / Status */}
        <div className="mt-auto">
          {isComingSoon && <ComingSoonBadge releaseDate={releaseDate} />}
          {isMaintenance && <MaintenanceBadge maintenanceMsg={maintenanceMsg} />}
          {isLive && (
            isApproved && portalUrl
              ? (
                <a
                  href={portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-[10px] text-[14px] font-medium transition-opacity duration-200 hover:opacity-85"
                  style={{ background: "#1E1A10", border: "1px solid #514920", color: "#B88934" }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M15 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Login to Portal
                </a>
              )
              : hasApplied
                ? <ApplicationStatusBadge applicationStatus={applicationStatus} rejectionReason={rejectionReason} />
                : <VisitPortalBadge application_url={application_url} />
          )}
        </div>
      </div>
    </div>
  );
}

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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {labs.map((lab) => (
            <LabCard key={lab._id} lab={lab} />
          ))}
        </div>
      )}
    </section>
  );
}
