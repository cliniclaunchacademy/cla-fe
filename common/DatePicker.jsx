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
import { formatDate } from "@utils/date";

export function DatePicker({ onChange, currentValue }) {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState();
  const [month, setMonth] = useState();

  // Handle calendar date selection
  const handleSelect = (date) => {
    if (!date) return;
    setValue(date);
    setMonth(date); // sync month with selected date
    if (onChange) onChange(formatDate(date, "YYYY-MM-DD"));
    setIsOpen(false); // close popover after selection
  };

  // Sync with external value (e.g., when editing an existing record)
  useEffect(() => {
    if (currentValue) {
      const dateObj = new Date(currentValue);
      if (!isNaN(dateObj.getTime())) {
        setValue(dateObj);
        setMonth(dateObj);
      }
    }
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
          {/* Calendar icon */}
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
              ></path>
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth={1.5}
                d="M7 4V2.5M17 4V2.5M2.5 9h19"
              ></path>
            </g>
          </svg>

          {/* Display selected date */}
          {value ? formatDate(value, "DD/MM/YYYY") : <span>DD/MM/YYYY</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          captionLayout="dropdown"
          month={month}              // ensures correct month shown
          onMonthChange={setMonth}   // updates month when user navigates
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
