"use client";

import React, { useState, useEffect, useRef } from "react";
import NextImage from "next/image";
import Cropper from "react-easy-crop";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

// ----------- Canvas Helpers -----------
async function createImage(url) {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.addEventListener("load", () => resolve(img));
    img.addEventListener("error", (err) => reject(err));
    img.setAttribute("crossOrigin", "anonymous");
    img.src = url;
  });
}

function getRadianAngle(degreeValue) {
  return (degreeValue * Math.PI) / 180;
}

function rotateSize(width, height, rotation) {
  const rot = getRadianAngle(rotation);
  return {
    width: Math.abs(Math.cos(rot) * width) + Math.abs(Math.sin(rot) * height),
    height: Math.abs(Math.sin(rot) * width) + Math.abs(Math.cos(rot) * height),
  };
}

async function getCroppedImg(imageSrc, pixelCrop, rotation = 0) {
  const image = await createImage(imageSrc);
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  const rotRad = getRadianAngle(rotation);
  const { width: bBoxWidth, height: bBoxHeight } = rotateSize(
    image.width,
    image.height,
    rotation
  );

  canvas.width = bBoxWidth;
  canvas.height = bBoxHeight;

  ctx.translate(bBoxWidth / 2, bBoxHeight / 2);
  ctx.rotate(rotRad);
  ctx.drawImage(image, -image.width / 2, -image.height / 2);

  const data = ctx.getImageData(
    Math.round(pixelCrop.x),
    Math.round(pixelCrop.y),
    Math.round(pixelCrop.width),
    Math.round(pixelCrop.height)
  );

  const outputCanvas = document.createElement("canvas");
  outputCanvas.width = Math.round(pixelCrop.width);
  outputCanvas.height = Math.round(pixelCrop.height);
  const outputCtx = outputCanvas.getContext("2d");
  outputCtx.putImageData(data, 0, 0);

  return outputCanvas.toDataURL("image/jpeg");
}

function readFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(reader.result), false);
    reader.readAsDataURL(file);
  });
}

function base64ToFile(base64, filename) {
  if (!base64.startsWith("data:")) {
    throw new Error("base64ToFile expects a data URL");
  }

  const arr = base64.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) u8arr[n] = bstr.charCodeAt(n);
  return new File([u8arr], filename, { type: mime });
}

// ----------- ImageCropper Component -----------
const ImageCropper = ({ file, cropWidth, cropHeight, onCropped }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

  useEffect(() => {
    let isCancelled = false;
    if (file) {
      readFile(file).then((dataUrl) => {
        if (!isCancelled) setImageSrc(dataUrl);
      });
    }
    return () => (isCancelled = true);
  }, [file]);

  const onCropComplete = (_, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  };

  const handleCrop = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    const croppedBase64 = await getCroppedImg(
      imageSrc,
      croppedAreaPixels,
      rotation
    );
    onCropped?.(croppedBase64, file);
  };

  if (!imageSrc) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative w-[300px] h-[200px] bg-gray-900">
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={cropWidth / cropHeight}
          onCropChange={setCrop}
          onCropComplete={onCropComplete}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
        />
      </div>

      <div className="w-[400px] flex flex-col gap-4">
        <div>
          <Label>Zoom</Label>
          <Slider
            value={[zoom]}
            min={1}
            max={3}
            step={0.1}
            onValueChange={(val) => setZoom(val[0])}
          />
        </div>
        <div>
          <Label>Rotation</Label>
          <Slider
            value={[rotation]}
            min={0}
            max={360}
            step={1}
            onValueChange={(val) => setRotation(val[0])}
          />
        </div>
        <Button onClick={handleCrop}>Crop & Use Image</Button>
      </div>
    </div>
  );
};

// ----------- MultipleCropImgUploader Component -----------
// ****************use case***********************
{/* <MultipleCropImgUploader
  images={field.value || []}
  onChange={(files) => field.onChange(files)}
  cropWidth={264}
  cropHeight={264}
  maxImages={1}
  previewWidth={100}
  previewHeight={120}
/> */}

const MultipleCropImgUploader = ({
  images = [],
  onChange,
  cropWidth = 337,
  cropHeight = 476,
  maxImages = 100,
  previewWidth = 96,
  previewHeight = 137,
}) => {
  const inputRef = useRef();
  const [previews, setPreviews] = useState([]);
  const [croppingFile, setCroppingFile] = useState(null);
  const [cropModalOpen, setCropModalOpen] = useState(false);

  useEffect(() => {
    const normalized = images.map((item) =>
      typeof item === "string"
        ? { url: item }
        : { file: item, url: URL.createObjectURL(item) }
    );
    setPreviews(normalized);
  }, [images]);

  const handleImageChange = (e) => {
    if (!e.target.files) return;

    const files = Array.from(e.target.files);
    const uniqueFiles = files.filter(
      (file) =>
        !previews.some((p) => p.file?.name === file.name || p.url === file.name)
    );

    if (uniqueFiles.length === 0) {
      alert("These images have already been selected.");
      e.target.value = null;
      return;
    }

    // Only pick the first file for cropping
    const file = uniqueFiles[0];
    setCroppingFile(file);
    setCropModalOpen(true);
    e.target.value = null;
  };

  const handleCropComplete = (croppedBase64, file) => {
    const newPreview = { file, url: croppedBase64, uid: Date.now() };

    const updatedPreviews = [...previews, newPreview];

    if (updatedPreviews.length > maxImages) {
      alert(`You can only upload up to ${maxImages} images.`);
      return;
    }

    setPreviews(updatedPreviews);
    setCropModalOpen(false);
    setCroppingFile(null);
    const onChangeData = updatedPreviews.map((p) => {
      if (p.url && p.url.startsWith("data:")) {
        return base64ToFile(p.url, `${Date.now()}.jpg`);
      }
      return p.file || p.url; // fallback to original File or URL
    });

    onChange(onChangeData);
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
          key={preview.uid || index}
          className={`relative w-[${previewWidth}px] h-[${previewHeight}px] rounded p-2 border-[1.5px] border-[#E5E5E5]`}
        >
          <NextImage
            src={preview.url}
            width={previewWidth}
            height={previewHeight}
            alt="preview"
            className="w-full h-full object-cover rounded"
          />
          <button
            onClick={() => handleRemove(index)}
            className="absolute top-[-8px] right-[-8px]"
            type="button"
          >
            {/* X icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
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
              <g clipPath="url(#clip0)">
                <path
                  d="M12.3136 13.4142L8.07092 17.6569L6.6567 16.2426L10.8993 12L6.6567 7.75736L8.07092 6.34315L12.3136 10.5858L16.5562 6.34315L17.9704 7.75736L13.7278 12L17.9704 16.2426L16.5562 17.6569L12.3136 13.4142Z"
                  fill="#929292"
                />
              </g>
              <defs>
                <clipPath id="clip0">
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

      <label
        className={`w-[${previewWidth}px] h-[${previewHeight}px] flex flex-col items-center justify-center rounded p-2 border-[1.5px] border-[#E5E5E5] cursor-pointer`}
      >
        <span className="textLabel12 text-center text-[#3D3D3D]">
          Add Image
        </span>
        <input
          type="file"
          ref={inputRef}
          onChange={handleImageChange}
          className="hidden"
        />
      </label>

      {/* Crop Dialog */}
      <Dialog open={cropModalOpen} onOpenChange={setCropModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Crop Image</DialogTitle>
          </DialogHeader>
          {croppingFile && (
            <ImageCropper
              file={croppingFile}
              cropWidth={cropWidth}
              cropHeight={cropHeight}
              onCropped={handleCropComplete}
            />
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setCropModalOpen(false)}>
              Cancels
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MultipleCropImgUploader;
