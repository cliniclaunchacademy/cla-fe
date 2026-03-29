import { TimePicker } from "@common/TimePicker";
import { Controller } from "react-hook-form";

export default function FormFieldTimePicker({
  name,
  control,
  label,
  rules,
  defaultValue,
  width,
  labelWidth = 218,
}) {
  return (
    <div className="w-full flex flex-col md:flex-row lg:items-center gap-y-2">
      {label && (
        <label
          htmlFor={name}
          className=" textBody16"
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
              <TimePicker
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
