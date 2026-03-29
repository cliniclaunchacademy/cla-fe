"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useFieldArray } from "react-hook-form";

// ***************use case example**********************
//  <DynamicInputForm
//         name="members"
//         control={control}
//         register={register}
//         errors={errors}
//         rules={{
//           validate: (arr) =>
//             arr.length > 0 || "At least one member is required",
//         }}
//         label="Members"
//         fieldsConfig={[
//           {
//             name: "member",
//             placeholder: "Member Name",
//             rules: { required: "Member name is required" },
//           },
//           {
//             name: "location",
//             placeholder: "Location",
//             rules: { required: "Location is required" },
//           },
//         ]}
//       />


// utility to split array into chunks
// utility to split array into chunks
const chunkArray = (arr, chunkSize) => {
  const chunks = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    chunks.push(arr.slice(i, i + chunkSize));
  }
  return chunks;
};

export default function DynamicInputForm({
  name,
  control,
  register,
  errors,
  rules,
  fieldsConfig = [
    {
      name: "first",
      placeholder: "First Name",
      rules: { required: "First name is required" },
    },
    {
      name: "last",
      placeholder: "Last Name",
      rules: { required: "Last name is required" },
    },
  ],
  label = "Dynamic Fields",
  maxInputsPerRow = 2, // default 2 inputs per row
}) {
  const { fields, append, remove } = useFieldArray({
    control,
    name,
    rules,
  });

  return (
    <div className="flex flex-col gap-2">
      <label className="textBody16">{label}</label>

      {fields.map((field, rowIndex) => {
        const fieldRows = chunkArray(fieldsConfig, maxInputsPerRow);

        return (
          <div
            key={field.id}
            className="w-full flex flex-col md:flex-row items-start gap-2"
          >
            <div className="w-full space-y-2">
              {fieldRows.map((row, rIdx) => (
                <div
                  key={`${field.id}-row-${rIdx}`}
                  className="flex flex-col md:flex-row gap-2 w-full"
                >
                  {row.map((f) => (
                    <div
                      key={`${field.id}-${f.name}`}
                      className="flex-1 flex flex-col w-full"
                    >
                      <Input
                        placeholder={f.placeholder}
                        className="w-full"
                        {...register(`${name}.${rowIndex}.${f.name}`, f.rules)}
                      />
                      {errors?.[name]?.[rowIndex]?.[f.name] && (
                        <p className="text-sm text-red-500">
                          {errors[name][rowIndex][f.name].message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => remove(rowIndex)}
              className="border border-red-300 hover:bg-red-100 transition duration-200"
            >
              X
            </Button>
          </div>
        );
      })}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() =>
          append(
            fieldsConfig.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {})
          )
        }
      >
        + Add field
      </Button>

      {errors[name]?.root && (
        <p className="text-sm text-red-500 mt-1">
          {errors[name].root.message}
        </p>
      )}
    </div>
  );
}

// previous version
// // ***************use case example**********************
// //  <DynamicInputForm
// //         name="members"
// //         control={control}
// //         register={register}
// //         errors={errors}
// //         rules={{
// //           validate: (arr) =>
// //             arr.length > 0 || "At least one member is required",
// //         }}
// //         label="Members"
// //         fieldsConfig={[
// //           {
// //             name: "member",
// //             placeholder: "Member Name",
// //             rules: { required: "Member name is required" },
// //           },
// //           {
// //             name: "location",
// //             placeholder: "Location",
// //             rules: { required: "Location is required" },
// //           },
// //         ]}
// //       />

// export default function DynamicInputForm({
//   name,
//   control,
//   register,
//   errors,
//   rules,
//   fieldsConfig = [
//     {
//       name: "first",
//       placeholder: "First Name",
//       rules: { required: "First name is required" },
//     },
//     {
//       name: "last",
//       placeholder: "Last Name",
//       rules: { required: "Last name is required" },
//     },
//   ], // array of input field configs
//   label = "Dynamic Fields",
// }) {
//   const { fields, append, remove } = useFieldArray({
//     control,
//     name,
//     rules,
//   });

//   return (
//     <div className="space-y-4">
//       <label className="textBody16">{label}</label>

//       {fields.map((field, rowIndex) => (
//         <div key={field.id} className="flex items-start gap-2">
//           {fieldsConfig.map((f) => (
//             <div key={f.name} className="flex flex-col w-full">
//               <Input
//                 placeholder={f.placeholder}
//                 {...register(`${name}.${rowIndex}.${f.name}`, f.rules)}
//               />
//               {errors?.[name]?.[rowIndex]?.[f.name] && (
//                 <p className="text-sm text-red-500">
//                   {errors[name][rowIndex][f.name].message}
//                 </p>
//               )}
//             </div>
//           ))}

//           <Button
//             type="button"
//             variant="ghost"
//             size="icon"
//             onClick={() => remove(rowIndex)}
//           >
//             X
//           </Button>
//         </div>
//       ))}

//       <Button
//         type="button"
//         variant="outline"
//         className="w-full"
//         onClick={() =>
//           append(
//             fieldsConfig.reduce((acc, f) => ({ ...acc, [f.name]: "" }), {})
//           )
//         }
//       >
//         + Add field
//       </Button>

//       {errors[name]?.root && (
//         <p className="text-sm text-red-500 mt-1">{errors[name].root.message}</p>
//       )}
//     </div>
//   );
// }
