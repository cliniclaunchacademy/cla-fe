"use client";

import Image from "next/image";
import contactBgVector from "@assets/images/contactBgVector.png";
import NextIcon from "@assets/icons/nextIcon";
import { useForm } from "react-hook-form";
import { FormFieldFloatingInput } from "./FormFieldComponent/FormFieldFloatingInput/FormFieldFloatingInput";
import { contactAuthority } from "@api/ApiContact";
import Swal from "sweetalert2";
import { useMutation } from "@tanstack/react-query";
import Loader from "./Loader";
import { useState } from "react";

const ContactForm = () => {
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      designation: "",
      email: "",
      query: "",
    },
  });

  const { mutateAsync: sendEmailMutation } = useMutation({
    mutationFn: contactAuthority,
    onError: (error) => {
      console.error("Email sent failed:", error);
    },
    onSuccess: () => {
      console.log("Email send successfully");
    },
  });

  const submitHandler = async (data) => {
    try {
      console.log(data);
      setLoading(true);
      const response = await sendEmailMutation(data);
      reset();
      Swal.fire({
        title: "Success",
        text: "Email send successfully!",
        icon: "success",
      });
      return response;
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong.",
        icon: "error",
      });
      console.error("Error sending Email:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[427px] relative bg-[#45A08B] p-5 md:pr-[50px] w-full flex flex-col md:flex-row justify-end items-center gap-4">
      <Image
        className="absolute -left-28 top-0 z-10"
        src={contactBgVector}
        alt="Bg vector"
      />
      <div className="md:w-4/12 z-20">
        <h3 className="text-[#1E453C] textDisplay40 mb-4">Enquire Us</h3>
        <p className="text-[#BAF9EA] textHeading20">
          If you have any query about ISCB membership, contact us
        </p>
      </div>

      <div className="w-full md:w-6/12 -mb-34 p-12 bg-white rounded-[10px] z-20 shadow-[4px_4px_4px_0px_#00000026]">
        <Loader isLoading={loading}>
          <form
            onSubmit={handleSubmit(submitHandler)}
            className="space-y-10"
          >
            <div className="space-y-7">
              <div className="flex flex-col md:flex-row gap-7 md:gap-12">
                <FormFieldFloatingInput
                  name="firstName"
                  label="First name"
                  control={control}
                  rules={{ required: "First name is required" }}
                  errors={errors.firstName}
                />
                <FormFieldFloatingInput
                  name="lastName"
                  label="Last name"
                  control={control}
                  rules={{ required: "Last name is required" }}
                  errors={errors.lastName}
                />
              </div>

              <FormFieldFloatingInput
                name="designation"
                label="Designation"
                control={control}
                rules={{ required: "Designation is required" }}
                errors={errors.designation}
              />

              <FormFieldFloatingInput
                name="email"
                label="Email"
                type="email"
                control={control}
                rules={{
                  required: "Email is required",
                  pattern: { value: /\S+@\S+\.\S+/, message: "Invalid email" },
                }}
                errors={errors.email}
              />

              <FormFieldFloatingInput
                name="query"
                label="Write your query"
                control={control}
                rules={{ required: "Query is required" }}
                errors={errors.query}
              />
            </div>

            <button
              type="submit"
              className="float-right bg-[#45A08B] hover:bg-[#45A08B]/90 text-white px-8 py-3 rounded-[15px] font-semibold flex items-center justify-center gap-2.5 transition duration-300"
            >
              <span className="text-[#001910] textBody16">Send message</span>
              <NextIcon />
            </button>
          </form>
        </Loader>
      </div>


    </div >
  );
};

export default ContactForm;
