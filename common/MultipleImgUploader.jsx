"use client";

import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";

const MultipleImgUploader = ({ images = [], onChange }) => {
  const inputRef = useRef();
  const [previews, setPreviews] = useState([]);
  const maxImage = 100;

  // Normalize incoming images (string[] or File[])
  useEffect(() => {
    const normalized = images.map(
      (item) =>
        typeof item === "string"
          ? { url: item } // already uploaded image
          : { file: item, url: URL.createObjectURL(item) } // local file
    );
    setPreviews(normalized);
  }, [images]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = maxImage - previews.length;

    if (remainingSlots <= 0) {
      alert(`You can only upload up to ${maxImage} images.`);
      return;
    }

    const existingUrls = previews.map((p) => p.file?.name || p.url);
    const uniqueFiles = files.filter(
      (file) => !existingUrls.includes(file.name)
    );

    if (uniqueFiles.length === 0) {
      alert("These images have already been selected.");
      e.target.value = null;
      return;
    }

    const allowedFiles = uniqueFiles.slice(0, remainingSlots);
    const newPreviews = allowedFiles.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));

    const updatedPreviews = [...previews, ...newPreviews];
    setPreviews(updatedPreviews);

    // 🔑 Send back only the raw files + existing string URLs
    onChange(updatedPreviews.map((p) => p.file || p.url));

    e.target.value = null;
  };

  const handleRemove = (index) => {
    const updatedPreviews = [...previews];
    updatedPreviews.splice(index, 1);
    setPreviews(updatedPreviews);

    onChange(updatedPreviews.map((p) => p.file || p.url));
  };

  return (
    <div className="flex gap-4 flex-wrap my-5">
      {previews.map((preview, index) => (
        <div
          key={index}
          className="relative w-[96px] h-[137px] rounded-tl-[4px] rounded-tr-[4px]  p-2 border-[1.5px] border-[#E5E5E5]"
        >
          <Image
            src={preview.url}
            width={96}
            height={137}
            alt="preview"
            className="w-full h-full object-cover rounded"
          />
          <button
            onClick={() => handleRemove(index)}
            className="absolute top-[-8px] right-[-8px]"
            type="button"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect
                x="0.5"
                y="0.5"
                width="23"
                height="23"
                rx="11.5"
                fill="white"
              />
              <rect
                x="0.5"
                y="0.5"
                width="23"
                height="23"
                rx="11.5"
                stroke="#929292"
              />
              <g clipPath="url(#clip0_452_7773)">
                <path
                  d="M12.3136 13.4142L8.07092 17.6569L6.6567 16.2426L10.8993 12L6.6567 7.75736L8.07092 6.34315L12.3136 10.5858L16.5562 6.34315L17.9704 7.75736L13.7278 12L17.9704 16.2426L16.5562 17.6569L12.3136 13.4142Z"
                  fill="#929292"
                />
              </g>
              <defs>
                <clipPath id="clip0_452_7773">
                  <rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(1 12) rotate(-45)"
                  />
                </clipPath>
              </defs>
            </svg>
          </button>
        </div>
      ))}
      <label className="w-[96px] h-[137px] flex flex-col items-center justify-center rounded-tl-[4px] rounded-tr-[4px]  p-2 border-[1.5px] border-[#E5E5E5]">
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
          Add more
          <br />
          <span className="textBody12 text-[#929292]">png/jpg/jpeg</span>
        </span>
        <input
          type="file"
          multiple
          ref={inputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      </label>
    </div>
  );
};

export default MultipleImgUploader;
