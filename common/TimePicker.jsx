"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { formatDate, getHour, getMinutes } from "@utils/date";

export function TimePicker({ onChange, currentValue = null }) {
  // currentValue format: "HH:mm:ss"
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState(null);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // Update value if currentValue changes
  useEffect(() => {
    if (currentValue) {
      const dateValue =
        typeof currentValue === "string"
          ? new Date(`1970-01-01T${currentValue}`) // parse "HH:mm:ss"
          : currentValue;
      setValue(dateValue);
    }
  }, [currentValue]);

  const handleTimeChange = (type, val) => {
    const newDate = value ? new Date(value) : new Date();
    if (!value) {
      newDate.setHours(1, 0, 0, 0); // default 1:00 AM
    }

    if (type === "hour") {
      const isPM = getHour(newDate) >= 12;
      newDate.setHours((parseInt(val) % 12) + (isPM ? 12 : 0));
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(val));
    } else if (type === "ampm") {
      const currentHours = getHour(newDate);
      if (val === "PM" && currentHours < 12)
        newDate.setHours(currentHours + 12);
      if (val === "AM" && currentHours >= 12)
        newDate.setHours(currentHours - 12);
    }

    setValue(newDate);
    onChange(formatDate(newDate, "HH:mm:ss"));
  };

  const getVariant = (type, val) => {
    if (!value) return "ghost";

    if (type === "hour")
      return getHour(value) % 12 === val % 12 ? "default" : "ghost";
    if (type === "minute")
      return getMinutes(value) === val ? "default" : "ghost";
    if (type === "ampm")
      return (val === "AM" && getHour(value) < 12) ||
        (val === "PM" && getHour(value) >= 12)
        ? "default"
        : "ghost";
    return "ghost";
  };

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
            <path
              stroke="currentColor"
              strokeWidth={1.5}
              fill="none"
              d="M12 7v5l3 3"
            />
            <circle
              cx={12}
              cy={12}
              r={9}
              stroke="currentColor"
              strokeWidth={1.5}
              fill="none"
            />
          </svg>
          {value ? formatDate(value, "hh:mm A") : <span>Select time</span>}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-0">
        <div className="flex sm:h-[300px] divide-x">
          {/* Hours */}
          <ScrollArea className="w-20">
            <div className="flex sm:flex-col p-2">
              {hours.map((hour) => (
                <Button
                  key={hour}
                  size="icon"
                  variant={getVariant("hour", hour)}
                  onClick={() => handleTimeChange("hour", hour.toString())}
                  className="sm:w-full shrink-0 aspect-square"
                >
                  {hour}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="sm:hidden" />
          </ScrollArea>

          {/* Minutes */}
          <ScrollArea className="w-20">
            <div className="flex sm:flex-col p-2">
              {minutes.map((minute) => (
                <Button
                  key={minute}
                  size="icon"
                  variant={getVariant("minute", minute)}
                  onClick={() => handleTimeChange("minute", minute.toString())}
                  className="sm:w-full shrink-0 aspect-square"
                >
                  {minute}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" className="sm:hidden" />
          </ScrollArea>

          {/* AM/PM */}
          <ScrollArea className="w-20">
            <div className="flex sm:flex-col p-2">
              {["AM", "PM"].map((ampm) => (
                <Button
                  key={ampm}
                  size="icon"
                  variant={getVariant("ampm", ampm)}
                  onClick={() => handleTimeChange("ampm", ampm)}
                  className="sm:w-full shrink-0 aspect-square"
                >
                  {ampm}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </PopoverContent>
    </Popover>
  );
}
