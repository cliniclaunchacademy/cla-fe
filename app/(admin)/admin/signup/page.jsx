"use client";

import Image from "next/image";
import logoImg from "@assets/images/logo.png";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { login } from "api/ApiAuth";
import FormFieldInput from "@common/FormFieldComponent/FormFieldInput/FormFieldInput";
import { useRouter } from "next/navigation";
import { useToast } from "@components/Common/Toast/ToastProvider";
import Loader from "@common/Loader";

export default function Signup() {
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const toast = useToast();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutateAsync: mutateLogin } = useMutation({
    mutationFn: login,
    onError: (error) => { },
    onSuccess: () => { },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await mutateLogin(data);
      localStorage.setItem("accessToken", res.data.data.accessToken);
      localStorage.setItem("role", res.data.data.user.role);
      localStorage.setItem("email", res.data.data.user.email);
      localStorage.setItem("username", res.data.data.user.username);
      toast({ type: "success", title: "Welcome!", message: "Account created successfully." });
      router.push("/admin");
    } catch (error) {
      toast({ type: "error", title: "Sign up failed", message: error?.response?.data?.error || "Something went wrong." });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-[#181818] flex justify-center items-center overflow-hidden py-[117px] loginBgImg">
      <div className="relative w-10/12 lg:w-5/12 max-w-[458px] ">
        <Image
          src={logoImg}
          width={133}
          height={101}
          className="mx-auto mb-[31px] "
        />
        <h3 className="text-center text-[#DFE1E3] textDisplay36 mb-3 ">Create Your Account</h3>
        <p className="text-center text-[#AFABA3] textLabel16 !text-[18px]  mb-[31px] ">Join Clinic Launch Academy today</p>
        <div className="bg-[#37352B] border-2 border-[#484942] rounded-[16px] py-10 px-8 ">
          <form
            className="flex flex-col gap-[22px] "
            onSubmit={handleSubmit(onSubmit)}
          >
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
              vertical={true}
              labelClassName={"textHeading16 text-[#DFE1E3]"}
            // disabled={isEdit}
            />
            <div className="flex gap-4 ">
              <FormFieldInput
                id="firstName"
                label="First Name"
                placeholder="Enter first name"
                registration={register("firstName", {
                  required: "First name is required"
                })}
                error={errors.firstName}
                width={183}
                vertical={true}
                labelClassName={"textHeading16 text-[#DFE1E3]"}
              // disabled={isEdit}
              />
              <FormFieldInput
                id="lastName"
                label="Last Name"
                placeholder="Enter last name"
                registration={register("lastName", {
                  required: "Last name is required"
                })}
                error={errors.lastName}
                width={183}
                vertical={true}
                labelClassName={"textHeading16 text-[#DFE1E3]"}
              // disabled={isEdit}
              />
            </div>

            <FormFieldInput
              id="password"
              label="Password"
              type="password"
              placeholder="Enter password"
              registration={register("password", {
                required: "Password is required",
              })}
              error={errors.password}
              width={474}
              vertical={true}
              labelClassName={"textHeading16 text-[#DFE1E3]"}
            // disabled={isEdit}
            />

            <FormFieldInput
              id="confirmPassword"
              label="Confirm Password"
              type="password"
              placeholder="Enter confirm password"
              registration={register("confirmPassword", {
                required: "Confirm password is required",
              })}
              error={errors.confirmPassword}
              width={474}
              vertical={true}
              labelClassName={"textHeading16 text-[#DFE1E3]"}
            // disabled={isEdit}
            />

            <div className="text-[#D74A40] textLabel14 p-4 rounded-[12px] bg-[#49332DCC] border border-[#49332D] ">
              <p>Your email is not registered in our system.</p>
              <p>Please contact support to get access.</p>
            </div>

            <button className="bg-[#B88934] hover:bg-[#DFAF32] active:bg-[#B88934] text-[#2C2313] px-4 py-[13px] rounded-[8px] textHeading16 transition duration-300 ">
              Sign Up
            </button>
          </form>
          <div className="w-full border-0 border-t-2  border-[#484942] my-[28px] "></div>
          <div className="textLabel16 text-center">
            <span className="text-[#ABADAF] mr-1 ">Already have an account?</span>
            <Link
              href="/login"
              className="text-[#B88934] "
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
