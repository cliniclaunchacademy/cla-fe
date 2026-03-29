"use client";

import Image from "next/image";
// import logo from "@assets/images/logo.png";
import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import FormFieldInput from "@common/FormFieldComponent/FormFieldInput/FormFieldInput";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import Loader from "@common/Loader";
import { login } from "@api/ApiAuth";

export default function Login() {
  const [isLoading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { mutateAsync: mutateLogin } = useMutation({
    mutationFn: login,
    onError: (error) => {},
    onSuccess: () => {},
  });

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const res = await mutateLogin(data);
      localStorage.setItem("accessToken", res.data.data.accessToken);
      localStorage.setItem("role", res.data.data.user.role);
      localStorage.setItem("email", res.data.data.user.email);
      localStorage.setItem("username", res.data.data.user.username);
      Swal.fire({
        title: "Success",
        text: "User logged in successfully!",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        router.push("/");
      });
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error?.response?.data?.message || "Something went wrong.",
        icon: "error",
      });
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-[#F8F8F8] md:bg-transparent min-h-screen pb-20">
      <Loader isLoading={isLoading}>
        <div className="w-full md:max-w-[450px] 2xl:max-w-[560px] mx-auto p-10 md:p-14 2xl:p-20 md:rounded-[40px] bg-[#F8F8F8] mt-10">
          <h5 className="textHeading32 text-center text-[#3D3D3D] mb-14 2xl:mb-[62px]">
            User Log-in
          </h5>
          <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
            <div className="relative w-full rounded-tl-[8px] rounded-tr-[8px] overflow-hidden ">
              <label className="absolute top-1.5 left-4 textBody14 text-[#929292]">
                Email
              </label>
              <FormFieldInput
                id="email"
                type="email"
                placeholder=""
                registration={register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: "Enter a valid email address",
                  },
                })}
                error={errors.email}
                className={
                  "w-full h-full block outline-none pt-[29px] pb-1.5 px-4 bg-[#E5E5E5]"
                }
              />
            </div>

            <div className="h-[56px] relative mt-6 mb-3">
              <label className="w-fit absolute top-1.5 left-4 textBody14 text-[#929292]">
                Password
              </label>
              <FormFieldInput
                id="password"
                type={showPassword ? "text" : "password"}
                registration={register("password", {
                  required: "Password is required",
                })}
                error={errors.password}
                className={
                  "w-full h-full block outline-none pt-[29px] pb-1.5 px-4 pe-[60px] bg-[#E5E5E5] rounded-tl-[8px] rounded-tr-[8px]"
                }
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className={`absolute top-1 right-1 w-[48px] h-[48px] flex items-center justify-center py-2 rounded-full transition duration-200 hover:bg-[#45A08B]/20 ${showPassword ? "bg-[#45A08B]/30" : ""
                  }`}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23.1853 11.6962C23.1525 11.6222 22.3584 9.86062 20.5931 8.09531C18.2409 5.74312 15.27 4.5 12 4.5C8.72999 4.5 5.75905 5.74312 3.40687 8.09531C1.64155 9.86062 0.843741 11.625 0.814679 11.6962C0.772035 11.7922 0.75 11.896 0.75 12.0009C0.75 12.1059 0.772035 12.2097 0.814679 12.3056C0.847491 12.3797 1.64155 14.1403 3.40687 15.9056C5.75905 18.2569 8.72999 19.5 12 19.5C15.27 19.5 18.2409 18.2569 20.5931 15.9056C22.3584 14.1403 23.1525 12.3797 23.1853 12.3056C23.2279 12.2097 23.25 12.1059 23.25 12.0009C23.25 11.896 23.2279 11.7922 23.1853 11.6962ZM12 18C9.11437 18 6.59343 16.9509 4.50655 14.8828C3.65028 14.0313 2.92179 13.0603 2.34374 12C2.92164 10.9396 3.65014 9.9686 4.50655 9.11719C6.59343 7.04906 9.11437 6 12 6C14.8856 6 17.4066 7.04906 19.4934 9.11719C20.3514 9.9684 21.0815 10.9394 21.6609 12C20.985 13.2619 18.0403 18 12 18ZM12 7.5C11.11 7.5 10.2399 7.76392 9.49993 8.25839C8.7599 8.75285 8.18313 9.45566 7.84253 10.2779C7.50194 11.1002 7.41282 12.005 7.58646 12.8779C7.76009 13.7508 8.18867 14.5526 8.81801 15.182C9.44735 15.8113 10.2492 16.2399 11.1221 16.4135C11.995 16.5872 12.8998 16.4981 13.7221 16.1575C14.5443 15.8169 15.2471 15.2401 15.7416 14.5001C16.2361 13.76 16.5 12.89 16.5 12C16.4988 10.8069 16.0242 9.66303 15.1806 8.81939C14.337 7.97575 13.1931 7.50124 12 7.5ZM12 15C11.4066 15 10.8266 14.8241 10.3333 14.4944C9.83993 14.1648 9.45542 13.6962 9.22835 13.1481C9.00129 12.5999 8.94188 11.9967 9.05764 11.4147C9.17339 10.8328 9.45911 10.2982 9.87867 9.87868C10.2982 9.45912 10.8328 9.1734 11.4147 9.05764C11.9967 8.94189 12.5999 9.0013 13.148 9.22836C13.6962 9.45542 14.1648 9.83994 14.4944 10.3333C14.824 10.8266 15 11.4067 15 12C15 12.7956 14.6839 13.5587 14.1213 14.1213C13.5587 14.6839 12.7956 15 12 15Z"
                    fill="#242424"
                  />
                </svg>
              </button>
            </div>

            {/* <p className="text-[#45A08B] textLabel16 mt-3">Forgot password?</p> */}

            <button
              type="submit"
              className="w-full rounded-full mt-6 py-2.5 px-6 bg-[#45A08B] hover:bg-[#45A08B]/90 textHeading20 text-white transition-all duration-300 cursor-pointer"
            >
              Log-in
            </button>
          </form>
        </div>
      </Loader>
    </section>
  );
}
