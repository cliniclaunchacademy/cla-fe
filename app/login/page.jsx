"use client";

import Image from "next/image";
import logoImg from "@assets/images/logo.png";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { login } from "apis/auth.api";
import FormFieldInput from "@common/FormFieldComponent/FormFieldInput/FormFieldInput";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useToast } from "@components/Common/Toast/ToastProvider";
import Loader from "@common/Loader";

export default function Login() {
  const [isLoading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const router = useRouter();
  const toast = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { mutateAsync: mutateLogin } = useMutation({
    mutationFn: login,
    onError: () => {},
    onSuccess: () => {},
  });

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) { setIsChecking(false); return; }
    const role = localStorage.getItem("role");
    if (role === "admin" || role === "superAdmin") {
      router.replace("/admin");
    } else {
      router.replace("/");
    }
  }, []);

  if (isChecking) {
    return (
      <div className="w-full min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-[#37352B] border-t-[#B88934] animate-spin" />
      </div>
    );
  }

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await mutateLogin(data);
      localStorage.setItem("accessToken", res.data.token);
      const role = res.data.user.role;
      localStorage.setItem("role", role);
      localStorage.setItem("email", res.data.user.email);
      localStorage.setItem("username", res.data.user.username);
      if (res.data.user.profilePhoto) {
        localStorage.setItem("profilePhoto", res.data.user.profilePhoto);
      } else {
        localStorage.removeItem("profilePhoto");
      }
      toast({
        type: "success",
        title: "Welcome back!",
        message: `Logged in as ${res.data.user.username}`,
      });
      if (role === "admin" || role === "superAdmin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (error) {
      toast({
        type: "error",
        title: "Login failed",
        message: error?.response?.data?.error || "Something went wrong.",
      });
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
        <h3 className="text-center text-[#DFE1E3] textDisplay36 mb-3 ">Welcome Back</h3>
        <p className="text-center text-[#AFABA3] textLabel16 !text-[18px]  mb-[31px] ">Sign in to continue your learning journey</p>
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
            />

            <div className="relative ">
              <Link href="/forgot-password" className="absolute top-0 right-0 text-[#AE9060] hover:text-[#B88934] textLabel16 transition duration-200">Forgot password?</Link>
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
              />
            </div>

            <button className="bg-[#B88934] hover:bg-[#DFAF32] active:bg-[#B88934] text-[#2C2313] px-4 py-[13px] rounded-[8px] textHeading16 transition duration-300 ">
              Sign In
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
