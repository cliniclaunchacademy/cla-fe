"use client";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function FormFieldSelect({
  name,
  label,
  control,
  options,
  placeholder = "Select option",
  error,
  rules,
  width,
  currentValue,
  labelWidth = 174,
}) {
  return (
    <div className="w-full flex flex-col md:flex-row lg:items-center gap-y-2">
      <label className="textBody16 text-[#737272]"
        style={{ width: `${labelWidth}px`, minWidth: `${labelWidth}px` }}>
        {label}
      </label>
      <div
        className={`w-full`}
        style={{
          maxWidth: typeof width === "number" ? `${width}px` : width,
        }}
      >
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => (
            <Select
              onValueChange={field.onChange}
              value={field.value || currentValue}
            >
              <SelectTrigger className="w-full text-[#9C9C9C] focus:text-[#484848] border-[1.5px] border-[#C4C4C4] rounded-[10px] px-3 py-[19px] outline-none ">
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value} className="text-[#737272] focus:text-[#484848] ">
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </div>
    </div>
  );
}
