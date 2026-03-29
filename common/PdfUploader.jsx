import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const PdfUploader = ({ value, onChange }) => {
  const inputRef = useRef();
  const [preview, setPreview] = useState(null);

  const handleFileChange = (e) => {
    const newFile = e.target.files[0];
    if (!newFile) return;

    const pdfPreview = {
      file: newFile,
      url: URL.createObjectURL(newFile),
    };

    setPreview(pdfPreview);
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
      // Edit mode: value is an existing remote URL, just set it directly
      setPreview({ url: value });
    } else if (value instanceof File) {
      // After upload: value is a File object, create a local blob URL for preview
      const url = URL.createObjectURL(value);
      setPreview({ file: value, url });

      // Cleanup: revoke the blob URL when the component unmounts or value changes
      // to avoid memory leaks
      return () => URL.revokeObjectURL(url);
    }
  }, [value]); // Re-run whenever the parent form value updates

  return (
    <div className="w-fit flex flex-col items-center gap-4 my-5">
      {preview ? (
        <div className="flex flex-col items-center gap-2">
          {preview?.file?.name ? (
            <div className="w-[150px] h-[200px] flex flex-col items-center justify-center border-[1.5px] border-[#E5E5E5] rounded bg-gray-50">
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
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
              <span className="textLabel12 text-center text-[#3D3D3D] mt-2">
                {preview?.file?.name}
              </span>
            </div>
          ) : (
            <Image src={preview.url} width={150} height={200} alt="pdf" />
          )}
        </div>
      ) : (
        <div
          onClick={handleReupload}
          className="w-[150px] h-[200px] flex flex-col items-center justify-center rounded border-[1.5px] border-[#E5E5E5] cursor-pointer bg-gray-50"
        >
          <svg
            width="56"
            height="57"
            viewBox="0 0 56 57"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M26.334 30.1663H16.334V26.833H26.334V16.833H29.6673V26.833H39.6673V30.1663H29.6673V40.1663H26.334V30.1663Z"
              fill="#929292"
            />
          </svg>

          <span className="textLabel12 text-center text-[#3D3D3D]">
            Upload PDF
            <br />
            <span className="textBody12 text-[#929292]">only .pdf</span>
          </span>
        </div>
      )}

      {preview && (
        <button
          type="button"
          onClick={handleReupload}
          className="flex gap-2.5 px-3 py-1.5 text-[#45A08B] textLabel14 border border-[#45A08B] rounded-[10px] hover:bg-[#45A08B]/10"
        >
          <span> Re-upload</span>
        </button>
      )}

      <input
        type="file"
        accept="application/pdf"
        ref={inputRef}
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default PdfUploader;
