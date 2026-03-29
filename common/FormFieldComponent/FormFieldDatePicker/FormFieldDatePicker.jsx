import { DatePicker } from "@common/DatePicker";
import { useState } from "react";
import { Controller } from "react-hook-form";

// ***********Use case example*******************
{
  /* <FormFieldDatePicker
  label="Start Year"
  name="startDate"
  control={control}
  rules={{ required: "Start date is required" }}
  width={236}
  labelWidth={170}
/>; */
}

export default function FormFieldDatePicker({
  name,
  control,
  label,
  rules,
  defaultValue,
  width, // input width
  labelWidth = 218,
}) {
  return (
    <div className="w-full flex flex-col md:flex-row lg:items-center gap-y-2">
      {label && (
        <label
          htmlFor={name}
          className="textBody16"
          style={{ width: `${labelWidth}px`, minWidth: `${labelWidth}px` }}
        >
          {label}
        </label>
      )}

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
          render={({ field, fieldState: { error } }) => (
            <div>
              <DatePicker
                currentValue={field.value || defaultValue}
                onChange={field.onChange}
              />
              {error && (
                <p className="text-red-500 text-sm mt-1">{error.message}</p>
              )}
            </div>
          )}
        />
      </div>
    </div>
  );
}
