"use client";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandGroup, CommandItem, CommandInput } from "@/components/ui/command";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

export default function FormFieldMultiSelect({
  name,
  label,
  control,
  options = [],
  placeholder = "Select options",
  error,
  rules,
  width,
  labelWidth = 174,
  labelClassName="text-[#737272]"
}) {
  const [search, setSearch] = useState("");

  return (
    <div className="w-full flex flex-col md:flex-row lg:items-center gap-y-2">
      <label
        className={`textBody16  ${labelClassName}`}
        style={{ width: `${labelWidth}px`, minWidth: `${labelWidth}px` }}
      >
        {label}
      </label>
      <div className="w-full flex flex-col ">
        <Controller
          name={name}
          control={control}
          rules={rules}
          render={({ field }) => {
            const selectedValues = Array.isArray(field.value) ? field.value : [];

            const filteredOptions = options.filter((opt) =>
              opt.label.toLowerCase().includes(search.toLowerCase())
            );

            const toggleValue = (value) => {
              const newValues = selectedValues.includes(value)
                ? selectedValues.filter((v) => v !== value)
                : [...selectedValues, value];
              field.onChange(newValues);
            };

            return (
              <Popover>
                <PopoverTrigger asChild>
                  <div
                    className="w-full text-[#9C9C9C] focus:text-[#484848] border-[1.5px] border-[#C4C4C4] rounded-[10px] px-3 py-2 outline-none cursor-pointer min-h-[44px] flex items-center gap-2 flex-wrap"
                    style={{ maxWidth: typeof width === "number" ? `${width}px` : width }}
                  >
                    {selectedValues.length > 0 ? (
                      selectedValues.map((val) => {
                        const item = options.find((o) => o.value === val);
                        return (
                          <Badge
                            key={val}
                            variant="secondary"
                            className="px-2 py-0.5 flex items-center gap-2 border-[#B683D5] textBody14 text-[#484848] bg-transparent "
                          >
                            {item?.label}
                            <X
                              className="w-3 h-3 cursor-pointer"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleValue(val);
                              }}
                            />
                          </Badge>
                        );
                      })
                    ) : (
                      <span className="text-[#9C9C9C] textBody16 ">{placeholder}</span>
                    )}
                  </div>
                </PopoverTrigger>

                <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]">
                  <Command className="max-h-72 overflow-hidden">
                    {/* <div className="px-2 pt-2">
                    <CommandInput
                      placeholder="Search..."
                      value={search}
                      onValueChange={setSearch}
                      className="border border-gray-300 rounded"
                    />
                  </div>

                  <div className="flex justify-between px-3 py-2 text-sm border-b">
                    <button
                      type="button"
                      onClick={() => field.onChange(options.map((o) => o.value))}
                      className="text-blue-600 hover:underline"
                    >
                      Select All
                    </button>

                    <button
                      type="button"
                      onClick={() => field.onChange([])}
                      className="text-red-600 hover:underline"
                    >
                      Clear All
                    </button>
                  </div> */}

                    <CommandGroup
                      className="[&>div]:max-h-60 [&>div]:overflow-y-auto [&>div]:scrollbar-thin [&>div]:scrollbar-thumb-gray-400 [&>div]:scrollbar-track-gray-200"
                    >
                      {filteredOptions.length === 0 && (
                        <div className="px-4 py-3 text-sm text-gray-500">
                          No results found
                        </div>
                      )}

                      {filteredOptions.map((opt) => {
                        const isSelected = selectedValues.includes(opt.value);
                        return (
                          <CommandItem
                            key={opt.value}
                            onSelect={() => toggleValue(opt.value)}
                            className={`flex items-center gap-2 py-2 cursor-pointer !text-[#663F7E] textLabel14 }`}
                          >
                            <Checkbox checked={isSelected} className="" />
                            {opt.label}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            );
          }}
        />

        {error && <p className="text-red-500 text-sm mt-1">{error.message}</p>}
      </div>

    </div>
  );
}