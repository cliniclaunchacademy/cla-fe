import React, { useEffect, useRef, useState } from "react";

const VideoUploader = ({ value, onChange }) => {
  const inputRef = useRef();
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    if (!newFile) return;

    const videoPreview = {
      file: newFile,
      url: URL.createObjectURL(newFile),
    };

    setPreview(videoPreview);
    onChange(newFile);

    e.target.value = null; // reset input
  };

  const handleReupload = () => {
    inputRef.current.click();
  };

  // Sync preview state when the external `value` prop changes.
  // This handles modal remounts where local state resets but form value persists.
  useEffect(() => {
    if (!value) return;

    if (typeof value === "string") {
      // Edit mode: value is an existing remote URL, set it directly
      setPreview({ url: value });
    } else if (value instanceof File) {
      // After upload: value is a File object, create a local blob URL for preview
      const url = URL.createObjectURL(value);
      setPreview({ file: value, url });

      // Cleanup: revoke the blob URL when the component unmounts or value changes
      return () => URL.revokeObjectURL(url);
    }
  }, [value]);

  return (
    <div className="w-fit flex flex-col items-center gap-4 my-5">
      {preview ? (
        <div className="flex flex-col items-center gap-2">
          {preview?.file ? (
            // Newly uploaded file — show inline video player
            <video
              src={preview.url}
              controls
              className="w-[250px] h-[160px] rounded border-[1.5px] border-[#E5E5E5] bg-black object-contain"
            />
          ) : (
            // Edit mode — remote URL, also render as video player
            <video
              src={preview.url}
              controls
              className="w-[250px] h-[160px] rounded border-[1.5px] border-[#E5E5E5] bg-black object-contain"
            />
          )}
          {preview?.file?.name && (
            <span className="textLabel12 text-center text-[#3D3D3D] max-w-[250px] truncate">
              {preview.file.name}
            </span>
          )}
        </div>
      ) : (
        <div
          onClick={handleReupload}
          className="w-[250px] h-[160px] flex flex-col items-center justify-center rounded border-[1.5px] border-[#E5E5E5] cursor-pointer bg-gray-50"
        >
          {/* Video camera icon */}
          <svg
            width="56"
            height="56"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#929292"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>

          <span className="textLabel12 text-center text-[#3D3D3D] mt-2">
            Upload Video
            <br />
            <span className="textBody12 text-[#929292]">.mp4, .mov, .webm</span>
          </span>
        </div>
      )}

      {preview && (
        <button
          type="button"
          onClick={handleReupload}
          className="flex gap-2.5 px-3 py-1.5 text-[#45A08B] textLabel14 border border-[#45A08B] rounded-[10px] hover:bg-[#45A08B]/10"
        >
          <span>Re-upload</span>
        </button>
      )}

      <input
        type="file"
        accept="video/mp4,video/quicktime,video/webm"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default VideoUploader;