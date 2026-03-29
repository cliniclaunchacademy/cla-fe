import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import LoaderSecondary from "./LoaderSecondary";

const ImageUploader = ({ image = null, onChange, isLoading = false }) => {
  const inputRef = useRef();
  const [preview, setPreview] = useState(null); // { url: string, file?: File }

  // Normalize incoming `image` prop to preview state
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }

    // If image is a string URL
    if (typeof image === "string" && image.trim() !== "") {
      setPreview({ url: image });
      return;
    }

    // If image is an object with url property (e.g., uploadedImage)
    if (typeof image === "object" && image !== null) {
      // if it looks like server uploaded object { url, public_id, ... }
      if (typeof image.url === "string" && image.url.trim() !== "") {
        setPreview({ url: image.url });
        return;
      }

      // if it looks like { file: File } (maybe passed earlier)
      if (image.file instanceof File) {
        const objectUrl = URL.createObjectURL(image.file);
        setPreview({ url: objectUrl, file: image.file, _objectUrl: objectUrl });
        return;
      }
    }

    // default fallback
    setPreview(null);
    return () => { };
  }, [image]);

  // cleanup any created object URL when component unmounts or preview changes
  useEffect(() => {
    return () => {
      if (preview && preview._objectUrl) {
        URL.revokeObjectURL(preview._objectUrl);
      }
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview({ file, url: objectUrl, _objectUrl: objectUrl });

    // Inform parent so it can upload the file and eventually set real URL via field.onChange()
    if (typeof onChange === "function") {
      onChange(file);
    }

    e.target.value = null; // reset input
  };

  const handleReupload = () => {
    inputRef.current?.click();
  };

  return (
    <LoaderSecondary isLoading={isLoading} message="Loading image...">
      <div className="w-fit flex flex-col gap-4">
        {preview?.url ? (
          <div className="relative w-[100px] h-[120px] rounded border-[1.5px] border-[#E5E5E5] overflow-hidden">
            <Image
              src={preview.url}
              width={100}
              height={120}
              alt="preview"
              className="w-full h-full object-cover"
            />
          </div>
        ) : (
          <div
            onClick={handleReupload}
            className="w-[100px] h-[120px] flex flex-col items-center justify-center rounded border-[1.5px] border-[#E5E5E5] cursor-pointer"
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
              Upload Image
              <br />
              <span className="textBody12 text-[#929292]">png/jpg/jpeg</span>
            </span>
          </div>
        )}

        {preview?.url && (
          <button
            type="button"
            onClick={handleReupload}
            className=" flex gap-2.5 gap-x-3 gap-y-1.5 px-3 py-1.5 text-[#45A08B] textLabel14 border border-[#45A08B] rounded-[10px] hover:bg-[#45A08B]/10"
          >
            <span> Re-upload</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M17.5 11.2495V16.2495C17.5 16.4153 17.4342 16.5742 17.3169 16.6915C17.1997 16.8087 17.0408 16.8745 16.875 16.8745H3.125C2.95924 16.8745 2.80027 16.8087 2.68306 16.6915C2.56585 16.5742 2.5 16.4153 2.5 16.2495V11.2495C2.5 11.0838 2.56585 10.9248 2.68306 10.8076C2.80027 10.6904 2.95924 10.6245 3.125 10.6245C3.29076 10.6245 3.44973 10.6904 3.56694 10.8076C3.68415 10.9248 3.75 11.0838 3.75 11.2495V15.6245H16.25V11.2495C16.25 11.0838 16.3158 10.9248 16.4331 10.8076C16.5503 10.6904 16.7092 10.6245 16.875 10.6245C17.0408 10.6245 17.1997 10.6904 17.3169 10.8076C17.4342 10.9248 17.5 11.0838 17.5 11.2495ZM7.31719 6.0667L9.375 4.00811V11.2495C9.375 11.4153 9.44085 11.5742 9.55806 11.6915C9.67527 11.8087 9.83424 11.8745 10 11.8745C10.1658 11.8745 10.3247 11.8087 10.4419 11.6915C10.5592 11.5742 10.625 11.4153 10.625 11.2495V4.00811L12.6828 6.0667C12.8001 6.18398 12.9591 6.24986 13.125 6.24986C13.2909 6.24986 13.4499 6.18398 13.5672 6.0667C13.6845 5.94943 13.7503 5.79037 13.7503 5.62452C13.7503 5.45866 13.6845 5.2996 13.5672 5.18233L10.4422 2.05733C10.3841 1.99922 10.3152 1.95312 10.2393 1.92167C10.1635 1.89021 10.0821 1.87402 10 1.87402C9.91787 1.87402 9.83654 1.89021 9.76066 1.92167C9.68479 1.95312 9.61586 1.99922 9.55781 2.05733L6.43281 5.18233C6.31554 5.2996 6.24965 5.45866 6.24965 5.62452C6.24965 5.79037 6.31554 5.94943 6.43281 6.0667C6.55009 6.18398 6.70915 6.24986 6.875 6.24986C7.04085 6.24986 7.19991 6.18398 7.31719 6.0667Z"
                fill="#45A08B"
              />
            </svg>
          </button>
        )}

        <input
          type="file"
          accept="image/png, image/jpeg, image/jpg"
          ref={inputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      </div>
    </LoaderSecondary>
  );
};

export default ImageUploader;
