"use client";

export default function FormButton({ label, isEdit, disabled = false, className, type = "submit", onClick = (() => { }) }) {
  return (
    <button
      type={type}
      className={`w-full py-[11.5px] rounded-[12px] bg-[#663F7E] hover:bg-[#663F7E]/90 transition duration-200 flex justify-center items-center gap-2 ${className}`}
      disabled={disabled}
      onClick={onClick}
    >
      <span className="text-center align-middle font-medium text-[18px] leading-[24px] tracking-[0.02em] text-white ">
        {isEdit ? `Update ${label}` : `Add ${label}`}
      </span>
    </button>
  );
}
