import NumberInput from "@common/NumberInput";
import { Controller } from "react-hook-form";

export default function FormFieldInputNumber({
  name,
  control,
  label,
  rules,
  width,
  labelWidth = 174,
  labelClassName,
  placeholder
}) {
  return (
    <div className="w-full flex flex-col md:flex-row lg:items-center gap-y-2">
      {label && (
        <label
          htmlFor={name}
          className={`textBody16 ${labelClassName}`}
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
              <NumberInput
                onChange={field.onChange}
                currentValue={field.value}
                placeholder={placeholder}
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
