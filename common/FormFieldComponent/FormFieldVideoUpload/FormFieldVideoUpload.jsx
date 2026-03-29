import VideoUploader from "@common/VideoUploader";
import { Controller } from "react-hook-form";

export default function FormFieldVideoUpload({
    name,
    control,
    label,
    rules,
    defaultValue = null,
    labelWidth = 218,
}) {
    return (
        <div className="w-fit flex flex-col md:flex-row lg:items-center gap-y-2">
            {
                label &&
                <label
                    htmlFor={name}
                    className="textBody16"
                    style={{ width: `${labelWidth}px` }}
                >
                    {label}
                </label>
            }

            <div className="w-full max-w-[474px]">
                <Controller
                    name={name}
                    control={control}
                    rules={rules}
                    render={({ field, fieldState: { error } }) => (
                        <div>
                            <VideoUploader
                                value={field.value || defaultValue}
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