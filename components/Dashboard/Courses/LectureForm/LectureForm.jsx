"use client";

import FormButton from "@common/FormFieldComponent/FormButton/FormButton";
import FormFieldInput from "@common/FormFieldComponent/FormFieldInput/FormFieldInput";
import { Label } from "@radix-ui/react-label";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function LectureForm({ data = null, onSubmit, isEdit = false }) {
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
      video: "",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  useEffect(() => {
    if (isEdit && data) {
      setValue("title", data.title || "");
      setValue("video", data.video || "");
    }
  }, [isEdit, data, setValue]);

  const submitHandler = (formData) => {
    if (onSubmit) {
      const payloadData = {
        title: formData.title,
        video: formData.video[0],
      };

      onSubmit({ lectureId: data._id, data: payloadData, isEdit, reset });
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
        label="Lecture name"
        placeholder="Enter title"
        registration={register("title", {
          required: "Title is required",
        })}
        error={errors.title}
        width={512}
      />


      <FormFieldInput
        id="video"
        label="Video upload"
        type = "file"
        placeholder="Enter video"
        registration={register("video", {
          required: "Video is required",
        })}
        error={errors.video}
        width={512}
      />

      <FormButton label="Lecture" isEdit={isEdit} />
    </form>
  );
}
