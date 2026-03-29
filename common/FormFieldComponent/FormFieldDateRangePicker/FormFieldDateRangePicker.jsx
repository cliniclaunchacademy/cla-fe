import { DatePickerWithRange } from "@common/DatePickerWithRange";
import { Controller } from "react-hook-form";

// ,,,,,,,,,,,,,,,,,use case,,,,,,,,,,,,,,,,,,,,,
{
  /* 
  <FormFieldDateRangePicker
  name="dateRange"
  control={control}
  defaultValue={{ from: null, to: null }} // optional, can omit
  rules={{
    validate: (value) =>
      value?.from && value?.to ? true : "Please select start and end date",
  }}
  width={236}
/>;
 */
}

export default function FormFieldDateRangePicker({
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
              <DatePickerWithRange
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
