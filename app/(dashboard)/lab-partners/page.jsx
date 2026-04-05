"use client";

const LAB_PARTNERS = [
  {
    _id: "alphabiomedlabs",
    name: "AlphaBioMed Labs",
    subheading: "Access exclusive wholesale pricing from our trusted laboratory partner.",
    logo: null,
    portalUrl: "https://partners.alphabiomedlabs.com/",
    status: "live",
  },
];

function StatusBadge({ status }) {
  if (status === "live") {
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

  if (status === "coming_soon") {
    return (
      <div
        className="flex items-center gap-2 px-3 py-[7px] rounded-full border"
        style={{ background: "#2C2313", borderColor: "#484942" }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="9" stroke="#B88934" strokeWidth="1.5"/>
          <path d="M12 7V12L15 15" stroke="#B88934" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span className="text-[14px] font-medium text-[#B88934]">Coming Soon</span>
      </div>
    );
  }

  return (
    <div
      className="flex items-center gap-2 px-3 py-[7px] rounded-full border"
      style={{ background: "#2C2313", borderColor: "#484942" }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" stroke="#B88934" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      <span className="text-[14px] font-medium text-[#B88934]">Under Maintenance</span>
    </div>
  );
}

function LabCard({ lab }) {
  const isLive = lab.status === "live";

  const handleClick = () => {
    if (isLive && lab.portalUrl) {
      window.open(lab.portalUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      onClick={isLive ? handleClick : undefined}
      className={`flex flex-col items-center text-center px-10 py-6 rounded-[16px] border transition duration-200 w-[320px]  ${
        isLive ? "cursor-pointer hover:border-[#B88934]" : ""
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
          <img src={lab.logo} alt={lab.name} className="w-full h-full object-cover" />
        ) : (
          <span
            className="font-bold select-none"
            style={{ fontFamily: "Poppins, sans-serif", fontSize: 44, color: "#B88934", lineHeight: 1 }}
          >
            {lab.name
              .split(" ")
              .map((w) => w[0])
              .join("")
              .slice(0, 2)
              .toLowerCase()}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex flex-col items-center gap-2 w-full">
        <div className="flex flex-col items-center gap-2 w-full">
          <h2
            className="font-bold"
            style={{ fontSize: 22, lineHeight: "130%", color: "#DFE1E3" }}
          >
            {lab.name}
          </h2>
          {lab.subheading && (
            <p className="text-[16px] text-[#ABADAF] w-full" style={{ lineHeight: "140%" }}>
              {lab.subheading}
            </p>
          )}
        </div>
        <StatusBadge status={lab.status} />
      </div>
    </div>
  );
}

export default function LabPartnersPage() {
  return (
    <section className="w-full px-9 py-10 flex flex-col gap-10">
      {/* Header */}
      <div className="flex flex-col gap-3">
        <h1 className="textDisplay40 text-[#EFEFEE]">Lab Partners</h1>
        <p className="textBody18 text-[#ABADAF]">
          Access exclusive wholesale pricing from our trusted laboratory partners
        </p>
      </div>

      {/* Grid */}
      <div className="flex flex-wrap gap-6">
        {LAB_PARTNERS.map((lab) => (
          <LabCard key={lab._id} lab={lab} />
        ))}
      </div>
    </section>
  );
}
