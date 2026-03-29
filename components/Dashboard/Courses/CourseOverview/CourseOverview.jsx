import FormButton from '@common/FormFieldComponent/FormButton/FormButton';
import FormFieldInput from '@common/FormFieldComponent/FormFieldInput/FormFieldInput'
import FormFieldInputNumber from '@common/FormFieldComponent/FormFieldInputNumber/FormFieldInputNumber'
import FormFieldMultiSelect from '@common/FormFieldComponent/FormFieldMultiSelect/FormFieldMultiSelect';
import FormFieldSelect from '@common/FormFieldComponent/FormFieldSelect/FormFieldSelect';
import FormFieldTextarea from '@common/FormFieldComponent/FormFieldTextarea/FormFieldTextarea'
import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form';

export default function CourseOverview() {
  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors, isValid },
  } = useForm({
    defaultValues: {
      // username: "",
      // email: "",
      // password: "",
      // presentationType: ""
    },
  });
  const buttonDisabled = !isValid;
  const courseList = [
    { label: 'MRCOG Part 1', value: '6997e3b2063d626e7856d10a' },
    { label: 'MRCOG Part 2', value: '6997e3b2063d626e7856d10b' },
  ]

  // Populate values when editing
  // useEffect(() => {
  //   if (isEdit && user) {
  //     setValue("username", user.username || "");
  //     setValue("email", user.email || "");
  //     setValue("password", user.password || "");
  //     setValue(
  //       "courseIds",
  //       user.enrolledCourses?.map((enrollment) => enrollment.courseId) || []
  //     );
  //     setValue("presentationType", user.presentationType || "");

  //     console.log("example:", user.enrolledCourses?.map((enrollment) => {
  //       return { label: enrollment.title, value: enrollment._id };
  //     }));
  //   }
  // }, [isEdit, user, setValue]);

  const submitHandler = (data) => {
    // if (onSubmit) onSubmit({ data, reset });
    console.log(data);
  };


  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="flex flex-col gap-y-4 "
    >
      <FormFieldInput
        id="courseName"
        label="Course name"
        placeholder="enter course name"
        labelClassName="text-[#484848] "
        registration={register("courseName", {
          required: "Course name is required",
        })}
        error={errors.courseName}
        width={674}
      // disabled={isEdit}
      />

      <FormFieldTextarea
        id="description"
        label="Description"
        placeholder="enter description"
        registration={register("description", {
          required: "Description is required",
        })}
        error={errors.description}
        labelClassName="text-[#484848] "
        width={674}
        rows={2}
        maxLength={200}
      />

      <FormFieldInputNumber
        name="duration"
        label="Duration (weeks)"
        control={control}
        rules={{
          required: "Duration is required",
          validate: {
            integer: (value) =>
              Number.isInteger(value) || "Only integers allowed",
            // range: (value) =>
            //   (value >= 1900 && value <= new Date().getFullYear()) ||
            //   `Year must be between 1900 and ${new Date().getFullYear()}`,
          },
        }}
        labelClassName="text-[#484848] "
        error={errors.duration}
        width={674}
        placeholder="enter course duration"
      />

      <FormFieldMultiSelect
        name="language"
        label="Language"
        control={control}
        placeholder="select language"
        rules={{ required: "Please select at least one language" }}
        labelClassName="text-[#484848] "
        options={courseList}
        error={errors.language}
        width={674}
      />

      <button
        type="submit"
        className={`mt-2 w-fit px-2.5 py-[9px] rounded-[10px] flex justify-center items-center gap-2 transition duration-200 ${buttonDisabled ? "bg-[#D9D9D9] hover:bg-[#D9D9D9]/90 " : "bg-[#663F7E] hover:bg-[#663F7E]/90"}`}
        disabled = {buttonDisabled}
      >
        <span className={`textLabel16 ${buttonDisabled ? "text-[#B0B0B0] " : "text-[#FFFAFA] "}`}>
          Save & Next
        </span>
        <svg
          className={`${buttonDisabled ? "text-[#B0B0B0] " : "text-[#FFFAFA] "}`} width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path d="M11.5502 11L7.3335 6.78333L8.61683 5.5L14.1168 11L8.61683 16.5L7.3335 15.2167L11.5502 11Z" fill="currentColor" />
        </svg>
      </button>
    </form>
  )
}
