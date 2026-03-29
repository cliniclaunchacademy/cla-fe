"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import dayjs from "dayjs";
import { formatDate } from "@utils/date";

export function DatePickerWithRange({ onChange, currentValue }) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState();

  const handleSelect = (range) => {
    setValue(range);
    if (onChange && range?.from && range?.to) {
      onChange({
        from: formatDate(range.from, "YYYY-MM-DD"),
        to: formatDate(range.to, "YYYY-MM-DD"),
      });
    }
  };

  useEffect(() => {
    setValue(currentValue);
  }, [currentValue]);

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={20}
            height={20}
            viewBox="0 0 24 24"
            className="mr-2"
          >
            <g fill="none">
              <path
                stroke="currentColor"
                strokeWidth={1.5}
                d="M2 12c0-3.771 0-5.657 1.172-6.828S6.229 4 10 4h4c3.771 0 5.657 0 6.828 1.172S22 8.229 22 12v2c0 3.771 0 5.657-1.172 6.828S17.771 22 14 22h-4c-3.771 0-5.657 0-6.828-1.172S2 17.771 2 14z"
              />
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth={1.5}
                d="M7 4V2.5M17 4V2.5M2.5 9h19"
              />
            </g>
          </svg>
          {value?.from ? (
            value.to ? (
              <>
                {formatDate(value.from, "DD-MM-YYYY")} -{" "}
                {formatDate(value.to, "DD-MM-YYYY")}
              </>
            ) : (
              dayjs(value.from).format("MM/DD/YYYY")
            )
          ) : (
            <span>DD/MM/YYYY - DD/MM/YYYY</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value}
          onSelect={handleSelect}
          numberOfMonths={2}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
