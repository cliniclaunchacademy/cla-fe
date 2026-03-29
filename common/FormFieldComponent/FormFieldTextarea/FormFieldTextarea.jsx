"use client";

export default function FormFieldTextarea({
  id,
  label,
  rows = 6,
  placeholder,
  registration,
  error,
  width,
  labelWidth = 174,
  labelClassName = "",
  minLength = 0,
  maxLength,
}) {
  return (
    <div className="w-full flex flex-col md:flex-row lg:items-center gap-y-2">
      {
        label &&
        <label
          htmlFor={id}
          className={`textBody16 ${labelClassName}`}
          style={{ width: `${labelWidth}px`, minWidth: `${labelWidth}px` }}
        >
          {label}
        </label>
      }


      <div
        className="w-full"
        style={{
          maxWidth: typeof width === "number" ? `${width}px` : width,
        }}
      >
        <textarea
          id={id}
          rows={rows}
          placeholder={placeholder}
          minLength={minLength}
          maxLength={maxLength}
          {...registration}
          className="w-full text-[#484848] border-[1.5px] border-[#C4C4C4] rounded-[10px] px-4 py-2 outline-0"
        />

        <p className="float-right text-[#9C9C9C] textBody12 ">{minLength}/{maxLength}</p>

        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </div>
    </div>
  );
}
