"use client";

import FormButton from "@common/FormFieldComponent/FormButton/FormButton";
import FormFieldDatePicker from "@common/FormFieldComponent/FormFieldDatePicker/FormFieldDatePicker";
import FormFieldPdfUpload from "@common/FormFieldComponent/FormFieldFileUpload/FormFieldPdfUpload";
import FormFieldInput from "@common/FormFieldComponent/FormFieldInput/FormFieldInput";
import FormFieldMultipleCropImgUploader from "@common/FormFieldComponent/FormFieldMultipleCropImgUploader/FormFieldMultipleCropImgUploader";
import FormFieldMultipleImgUploader from "@common/FormFieldComponent/FormFieldMultipleImgUploader/FormFieldMultipleImgUploader";
import FormFieldSelect from "@common/FormFieldComponent/FormFieldSelect/FormFieldSelect";
import FormFieldTextarea from "@common/FormFieldComponent/FormFieldTextarea/FormFieldTextarea";
import FormFieldTimePicker from "@common/FormFieldComponent/FormFieldTimePicker/FormFieldTimePicker";
import {
  formatDate,
  isValidEndDate,
  isValidEndTime,
  joinDateTime,
} from "@utils/date";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function SectionForm({ data = null, onSubmit, isEdit = false }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (isEdit && data) {
      setValue("title", data.title || "");
    }
  }, [isEdit, data, setValue]);

  const submitHandler = (formData) => {
    if (onSubmit) {
      const payloadData = {
        title: formData.title,
      };

      onSubmit({ sectionId: data._id, data: payloadData, isEdit, reset });
    }
  };

  // Add onError handler to scroll to first invalid field
  const onErrorHandler = (errors) => {
    const firstErrorField = Object.keys(errors)[0];
    const el = document.querySelector(`[name="${firstErrorField}"]`);
    if (el && el.scrollIntoView) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      el.focus({ preventScroll: true });
    }
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler, onErrorHandler)}
      className="flex flex-col gap-y-6"
    >
      <FormFieldInput
        id="title"
        label="Section name"
        placeholder="Enter title"
        registration={register("title", {
          required: "Title is required",
        })}
        error={errors.title}
        width={512}
      />

      <FormButton label="Section" isEdit={isEdit} />
    </form>
  );
}
