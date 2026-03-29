"use client";

export default function FormFieldInput({
  id,
  label,
  type = "text",
  placeholder,
  registration,
  error,
  width = 474, // desired max width
  labelClassName = "text-[#DFE1E3] ",
  className = "",
  disabled = false,
  labelWidth = 174,
  vertical = false,
  prefix = false,
  prefixIcon
}) {
  return (
    <div className={`w-full flex flex-col ${vertical ? "" : "md:flex-row lg:items-center"}  gap-y-[6px] `}>
      {label && (
        <label
          htmlFor={id}
          className={`${labelClassName}`}
          style={{
            width: `${labelWidth}px`,
            minWidth: `${labelWidth}px`,
          }}
        >
          {label}
        </label>
      )}

      <div
        className="relative w-full"
        style={{
          maxWidth: typeof width === "number" ? `${width}px` : width,
        }}
      >
        {
          prefix &&
          <div className="absolute left-2 top-2 w-[24px] h-[24px] ">
            {
              prefixIcon
            }
          </div>
        }
        <input
          id={id}
          type={type}
          placeholder={placeholder}
          {...registration}
          className={`w-full text-[#ABADAF] bg-[#232420] border-2 border-[#484942] rounded-[10px] px-3 py-[9px] ${prefix ? "ps-9" : ""} outline-none ${disabled ? "cursor-not-allowed bg-gray-200" : ""
            } ${className}`}
          disabled={disabled}
        />
        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </div>
    </div>
  );
}