"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import FormFieldInput from "@common/FormFieldComponent/FormFieldInput/FormFieldInput";
import FormButton from "@common/FormFieldComponent/FormButton/FormButton";
import FormFieldMultiSelect from "@common/FormFieldComponent/FormFieldMultiSelect/FormFieldMultiSelect";
import FormFieldSelect from "@common/FormFieldComponent/FormFieldSelect/FormFieldSelect";

export default function AdminForm({ user = null, onSubmit, isEdit = false, props = {} }) {
  const { courseList } = props;
  console.log(courseList);
  const [showPassword, setShowPassword] = useState(false);

  // const skillOptions = [
  //   { label: "React", value: "react" },
  //   { label: "Next.js", value: "next" },
  //   { label: "Node.js", value: "node" },
  //   { label: "MongoDB", value: "mongo" },
  //   { label: "React1", value: "react1" },
  //   { label: "Next.js1", value: "next1" },
  //   { label: "Node.js1", value: "node1" },
  //   { label: "MongoDB1", value: "mongo1" },
  //   { label: "React2", value: "react2" },
  //   { label: "Next.js2", value: "next2" },
  //   { label: "Node.js2", value: "node2" },
  //   { label: "MongoDB2", value: "mongo2" },
  // ];

  const {
    register,
    handleSubmit,
    setValue,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      presentationType: ""
    },
  });

  // Populate values when editing
  useEffect(() => {
    if (isEdit && user) {
      setValue("username", user.username || "");
      setValue("email", user.email || "");
      setValue("password", user.password || "");
      setValue(
        "courseIds",
        user.enrolledCourses?.map((enrollment) => enrollment.courseId) || []
      );
      setValue("presentationType", user.presentationType || "");

      console.log("example:", user.enrolledCourses?.map((enrollment) => {
        return { label: enrollment.title, value: enrollment._id };
      }));
    }
  }, [isEdit, user, setValue]);

  const submitHandler = (data) => {
    if (onSubmit) onSubmit({ data, reset });
  };

  return (
    <section>
      <h3 className="text-center text-[#484848] textHeading20 merriweather mb-[27px] ">Add user</h3>

      <form
        onSubmit={handleSubmit(submitHandler)}
        className="flex flex-col gap-y-6"
      >
        {/* <FormFieldInput
        id="username"
        label="Username"
        placeholder="Enter username"
        registration={register("username", {
          required: "Username is required",
        })}
        error={errors.username}
        width={474}
        disabled={isEdit}
      />

      <FormFieldInput
        id="email"
        label="Email"
        type="email"
        placeholder="Enter email"
        registration={register("email", {
          required: "Email is required",
          pattern: {
            value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
            message: "Enter a valid email address",
          },
        })}
        error={errors.email}
        width={474}
        disabled={isEdit}
      />

      <FormFieldInput
        id="password"
        label="Password"
        type="text"
        placeholder="Enter password"
        registration={register("password", {
          required: "Password is required",
        })}
        error={errors.password}
        width={474}
        disabled={isEdit}
      />

      <FormFieldMultiSelect
        name="courseIds"
        label="Courses"
        control={control}
        placeholder="Select courses"
        // rules={{ required: "Please select at least one course" }}
        options={courseList}
        error={errors.courseIds}
        width={474}
      /> */}

        <FormFieldInput
          id="username"
          label="Username"
          placeholder="enter name"
          // registration={register("username", {
          //   required: "Username is required",
          // })}
          // error={errors.username}
          width={448}
        // disabled={isEdit}
        />

        <FormFieldInput
          id="username"
          label="Username"
          placeholder="enter name"
          // registration={register("username", {
          //   required: "Username is required",
          // })}
          // error={errors.username}
          width={448}
        // disabled={isEdit}
        />

        <div className="relative">
          <FormFieldInput
            id="password"
            label="Password"
            placeholder="enter password"
            type={showPassword ? "text" : "password"}
            // registration={register("password", {
            //   required: "Password is required",
            // })}
            // error={errors.password}
            className={
              "w-full h-full block outline-none px-4 pe-[50px] "
            }
          />

          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className={`absolute top-2 right-3 w-[24px] h-[24px] flex items-center justify-center py-2 rounded-full transition duration-200`}
          >
            {
              showPassword ?
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M16.1 13.3L14.65 11.85C14.8 11.0667 14.575 10.3333 13.975 9.64999C13.375 8.96665 12.6 8.69999 11.65 8.84999L10.2 7.39999C10.4833 7.26665 10.7708 7.16666 11.0625 7.09999C11.3542 7.03332 11.6667 6.99999 12 6.99999C13.25 6.99999 14.3125 7.43749 15.1875 8.31249C16.0625 9.18749 16.5 10.25 16.5 11.5C16.5 11.8333 16.4667 12.1458 16.4 12.4375C16.3333 12.7292 16.2333 13.0167 16.1 13.3ZM19.3 16.45L17.85 15.05C18.4833 14.5667 19.0458 14.0375 19.5375 13.4625C20.0292 12.8875 20.45 12.2333 20.8 11.5C19.9667 9.81666 18.7708 8.47916 17.2125 7.48749C15.6542 6.49582 13.9167 5.99999 12 5.99999C11.5167 5.99999 11.0417 6.03332 10.575 6.09999C10.1083 6.16665 9.65 6.26665 9.2 6.39999L7.65 4.84999C8.33333 4.56665 9.03333 4.35415 9.75 4.21249C10.4667 4.07082 11.2167 3.99999 12 3.99999C14.5167 3.99999 16.7583 4.69582 18.725 6.08749C20.6917 7.47916 22.1167 9.28332 23 11.5C22.6167 12.4833 22.1125 13.3958 21.4875 14.2375C20.8625 15.0792 20.1333 15.8167 19.3 16.45ZM19.8 22.6L15.6 18.45C15.0167 18.6333 14.4292 18.7708 13.8375 18.8625C13.2458 18.9542 12.6333 19 12 19C9.48333 19 7.24167 18.3042 5.275 16.9125C3.30833 15.5208 1.88333 13.7167 1 11.5C1.35 10.6167 1.79167 9.79582 2.325 9.03749C2.85833 8.27915 3.46667 7.59999 4.15 6.99999L1.4 4.19999L2.8 2.79999L21.2 21.2L19.8 22.6ZM5.55 8.39999C5.06667 8.83332 4.625 9.30832 4.225 9.82499C3.825 10.3417 3.48333 10.9 3.2 11.5C4.03333 13.1833 5.22917 14.5208 6.7875 15.5125C8.34583 16.5042 10.0833 17 12 17C12.3333 17 12.6583 16.9792 12.975 16.9375C13.2917 16.8958 13.6167 16.85 13.95 16.8L13.05 15.85C12.8667 15.9 12.6917 15.9375 12.525 15.9625C12.3583 15.9875 12.1833 16 12 16C10.75 16 9.6875 15.5625 8.8125 14.6875C7.9375 13.8125 7.5 12.75 7.5 11.5C7.5 11.3167 7.5125 11.1417 7.5375 10.975C7.5625 10.8083 7.6 10.6333 7.65 10.45L5.55 8.39999Z" fill="#C4C4C4" />
                </svg>
                :
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M15.1875 14.6875C16.0625 13.8125 16.5 12.75 16.5 11.5C16.5 10.25 16.0625 9.1875 15.1875 8.3125C14.3125 7.4375 13.25 7 12 7C10.75 7 9.6875 7.4375 8.8125 8.3125C7.9375 9.1875 7.5 10.25 7.5 11.5C7.5 12.75 7.9375 13.8125 8.8125 14.6875C9.6875 15.5625 10.75 16 12 16C13.25 16 14.3125 15.5625 15.1875 14.6875ZM10.0875 13.4125C9.5625 12.8875 9.3 12.25 9.3 11.5C9.3 10.75 9.5625 10.1125 10.0875 9.5875C10.6125 9.0625 11.25 8.8 12 8.8C12.75 8.8 13.3875 9.0625 13.9125 9.5875C14.4375 10.1125 14.7 10.75 14.7 11.5C14.7 12.25 14.4375 12.8875 13.9125 13.4125C13.3875 13.9375 12.75 14.2 12 14.2C11.25 14.2 10.6125 13.9375 10.0875 13.4125ZM5.35 16.9625C3.35 15.6042 1.9 13.7833 1 11.5C1.9 9.21667 3.35 7.39583 5.35 6.0375C7.35 4.67917 9.56667 4 12 4C14.4333 4 16.65 4.67917 18.65 6.0375C20.65 7.39583 22.1 9.21667 23 11.5C22.1 13.7833 20.65 15.6042 18.65 16.9625C16.65 18.3208 14.4333 19 12 19C9.56667 19 7.35 18.3208 5.35 16.9625ZM17.1875 15.5125C18.7625 14.5208 19.9667 13.1833 20.8 11.5C19.9667 9.81667 18.7625 8.47917 17.1875 7.4875C15.6125 6.49583 13.8833 6 12 6C10.1167 6 8.3875 6.49583 6.8125 7.4875C5.2375 8.47917 4.03333 9.81667 3.2 11.5C4.03333 13.1833 5.2375 14.5208 6.8125 15.5125C8.3875 16.5042 10.1167 17 12 17C13.8833 17 15.6125 16.5042 17.1875 15.5125Z" fill="#C4C4C4" />
                </svg>
            }
          </button>
        </div>

        <FormFieldSelect
          name="role"
          label="Role"
          control={control}
          rules={{ required: "Select role" }}
          placeholder="select role"
          options={[
            { value: "admin", label: "Admin" },
            { value: "student", label: "Student" },
          ]}
          error={errors.presentationType}
          width={448}
          // currentValue={user?.presentationType}
        />

        <FormFieldMultiSelect
          name="courseIds"
          label="Courses"
          control={control}
          placeholder="select course"
          // rules={{ required: "Please select at least one course" }}
          options={courseList}
          error={errors.courseIds}
          width={448}
        />

        <FormButton className={"mt-[56px] "} label={isEdit ? "Update" : "Admin"} />
      </form>
    </section>
  );
}