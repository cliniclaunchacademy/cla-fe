import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { forwardRef, useState } from "react";

// **************Use case example***********************
// const [tags, setTags] = useState([]);
// <div className="p-4">
//   <h2 className="mb-2">Enter Tags:</h2>
//   <InputTags
//     value={tags}
//     onChange={setTags}
//     placeholder="Type something and press Enter"
//   />
// </div>;

export const InputTags = forwardRef(({ value, onChange, ...props }, ref) => {
  const [pendingDataPoint, setPendingDataPoint] = useState("");

  const addPendingDataPoint = () => {
    if (pendingDataPoint) {
      const newDataPoints = new Set([...value, pendingDataPoint]);
      onChange(Array.from(newDataPoints));
      setPendingDataPoint("");
    }
  };

  return (
    <>
      <div className="flex">
        <Input
          value={pendingDataPoint}
          onChange={(e) => setPendingDataPoint(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === "," || e.key === " ") {
              e.preventDefault();
              addPendingDataPoint();
            }
          }}
          className="rounded-r-none"
          {...props}
          ref={ref}
        />
        <Button
          type="button"
          variant="secondary"
          className="rounded-l-none border border-l-0"
          onClick={addPendingDataPoint}
        >
          Add
        </Button>
      </div>
      <div className="border rounded-md min-h-[2.5rem] overflow-y-auto p-2 flex gap-2 flex-wrap items-center">
        {value.map((item, idx) => (
          <Badge key={idx} variant="secondary">
            {item}
            <button
              type="button"
              className="w-3 ml-2"
              onClick={() => {
                onChange(value.filter((i) => i !== item));
              }}
            >
              X{/* <XIcon className="w-3" /> */}
            </button>
          </Badge>
        ))}
      </div>
    </>
  );
});
