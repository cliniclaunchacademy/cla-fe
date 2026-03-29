"use client";
import MultipleCropImgUploader from "@common/MultipleCropImgUploader";
import { Controller } from "react-hook-form";

export default function FormFieldMultipleCropImgUploader({
  name,
  label,
  control,
  rules,
  error,
  width,
  labelWidth = 218,
}) {
  return (
    <div className="w-full flex flex-col md:flex-row lg:items-center gap-y-2">
      {
        label &&
        <label className=" textBody16"
          style={{ width: `${labelWidth}px`, minWidth: `${labelWidth}px` }}>
          {label}
        </label>
      }

      <div
        className="w-full"
        style={{
          maxWidth: typeof width === "number" ? `${width}px` : width,
        }}
      >
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => (
            <MultipleCropImgUploader
              images={field.value}
              onChange={(files) => {
                field.onChange(files);
              }}
            />
          )}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </div>
    </div>
  );
}
