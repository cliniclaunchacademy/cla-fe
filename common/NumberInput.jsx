"use client";

import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";

export default function NumberInput({
  min = 0,
  max,
  step = 1,
  prefix,
  onChange,
  currentValue = "",
  placeholder = "Enter value",
}) {
  const [value, setValue] = useState("");

  const handleChange = (val) => {
    if (val === "") {
      setValue("");
      onChange?.("");
      return;
    }

    let newValue = Number(val);

    if (isNaN(newValue)) newValue = min;
    if (newValue < min) newValue = min;
    if (max !== undefined && newValue > max) newValue = max;

    setValue(newValue);
    onChange?.(newValue);
  };

  const increment = () => {
    const newValue = value === "" ? min : Number(value) + step;
    handleChange(newValue);
  };

  const decrement = () => {
    const newValue = value === "" ? min : Number(value) - step;
    handleChange(newValue);
  };

  useEffect(() => {
    if (currentValue !== undefined && currentValue !== null) {
      setValue(currentValue);
    }
  }, [currentValue]);

  return (
    <div className="flex items-center">
      <div className="relative flex-1">
        {prefix && (
          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
            {prefix}
          </span>
        )}

        <input
          type="number"
          value={value}
          placeholder={placeholder}
          onChange={(e) => handleChange(e.target.value)}
          onWheel={(e) => e.target.blur()}
          className={`rounded-r-none ${
            prefix ? "pl-6" : ""
          } pr-6 rounded-[10px] px-4 py-2 outline-0 rounded-r-xl w-full text-[#484848] border-[1.5px] border-[#C4C4C4]`}
        />

        <span className="absolute right-0 top-1/2 -translate-y-1/2 text-sm text-muted-foreground bg-white z-20">
          <div className="flex flex-col">
            <Button
              type="button"
              aria-label="Increase value"
              className="px-2 h-5 rounded-l-none rounded-br-none border-input border-l-0 border-b-[0.5px]"
              variant="outline"
              onClick={increment}
              disabled={value === max}
            >
              <svg width="15" height="15" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="m12 10.828l-4.95 4.95l-1.414-1.414L12 8l6.364 6.364l-1.414 1.414z"
                />
              </svg>
            </Button>

            <Button
              type="button"
              aria-label="Decrease value"
              className="px-2 h-5 rounded-l-none rounded-tr-none border-input border-l-0 border-t-[0.5px]"
              variant="outline"
              onClick={decrement}
              disabled={value === min}
            >
              <svg
                width="15"
                height="15"
                viewBox="0 0 24 24"
                className="rotate-180"
              >
                <path
                  fill="currentColor"
                  d="m12 10.828l-4.95 4.95l-1.414-1.414L12 8l6.364 6.364l-1.414 1.414z"
                />
              </svg>
            </Button>
          </div>
        </span>
      </div>
    </div>
  );
}