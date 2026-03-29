"use client";

import FloatingInput from "@common/FloatingInput";
import { Controller } from "react-hook-form";

export const FormFieldFloatingInput = ({
  name,
  control,
  label,
  rules,
  errors,
  type = "text",
}) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field }) => (
        <FloatingInput
          label={label}
          type={type}
          {...field}
          error={errors?.message}
        />
      )}
    />
  );
};
