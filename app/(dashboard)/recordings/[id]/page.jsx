"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getStudentRecording } from "apis/student-recordings.api";
import Loader from "@common/Loader";

function getVimeoEmbedUrl(url) {
  if (!url) return null;
  const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)(?:\/([a-zA-Z0-9]+))?/);
  if (!match) return null;
  const videoId = match[1];
  const hash = match[2];
  let embedUrl = `https://player.vimeo.com/video/${videoId}?badge=0&autopause=0&player_id=0&app_id=58479`;
  if (hash) embedUrl += `&h=${hash}`;
  return embedUrl;
}

function formatDate(dateStr) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function RecordingPlayerPage() {
  const { id } = useParams();
  const router = useRouter();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["studentRecording", id],
    queryFn: () => getStudentRecording(id),
    enabled: !!id,
  });

  const recording = data?.data?.recording;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader isLoading={true} />
      </div>
    );
  }

  if (isError || !recording) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-[#ABADAF] textBody16">Failed to load recording. Please try again.</p>
      </div>
    );
  }

  const embedUrl = getVimeoEmbedUrl(recording.videoEmbed);

  return (
    <section className="w-full px-9 py-10">
      {/* Back button */}
      <button
        onClick={() => router.push("/recordings")}
        className="w-fit py-2.5 px-[14px] flex gap-2 items-center textLabel16 text-[#DFE1E3] rounded-[8px] bg-transparent hover:bg-[#313335] active:bg-transparent transition duration-300 mb-7"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path
            d="M8.46967 3.21967C8.76256 2.92678 9.23732 2.92678 9.53022 3.21967C9.82311 3.51256 9.82311 3.98732 9.53022 4.28022L5.56049 8.24994H14.2499C14.6642 8.24994 14.9999 8.58573 14.9999 8.99994C14.9999 9.41416 14.6642 9.74994 14.2499 9.74994H5.56049L9.53022 13.7197C9.82311 14.0126 9.82311 14.4873 9.53022 14.7802C9.23732 15.0731 8.76256 15.0731 8.46967 14.7802L3.21967 9.53022C2.92678 9.23732 2.92678 8.76256 3.21967 8.46967L8.46967 3.21967Z"
            fill="currentColor"
          />
        </svg>
        <span>Back to Recordings</span>
      </button>

      <div className="max-w-[960px] mx-auto">
        {/* Video player */}
        {embedUrl ? (
          <div
            className="w-full rounded-[14px] overflow-hidden"
            style={{ padding: "56.25% 0 0 0", position: "relative" }}
          >
            <iframe
              src={embedUrl}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                border: 0,
              }}
              allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
              title={recording.title}
            />
          </div>
        ) : (
          <div
            className="w-full aspect-video rounded-[14px] flex items-center justify-center"
            style={{ background: "#1C1E20", border: "1px solid #313335" }}
          >
            <p className="text-[#ABADAF] textBody16">No video available</p>
          </div>
        )}

        {/* Meta */}
        <div className="mt-6 flex flex-col gap-3">
          <div className="flex items-center gap-3 flex-wrap">
            {recording.categoryName && (
              <span
                className="text-[13px] font-semibold text-[#B88934] px-3 py-1 rounded-full"
                style={{ background: "#37352B" }}
              >
                {recording.categoryName}
              </span>
            )}
            {recording.recordedDate && (
              <span className="text-[14px] text-[#868889]">{formatDate(recording.recordedDate)}</span>
            )}
          </div>

          <h1 className="textDisplay36 text-[#FFFFFF] leading-tight">{recording.title}</h1>

          {recording.subheading && (
            <p className="textBody18 text-[#ABADAF] leading-relaxed">{recording.subheading}</p>
          )}
        </div>
      </div>
    </section>
  );
}
