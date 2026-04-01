"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import logoImg from "@assets/images/logo.png";
import { resetPassword } from "apis/auth.api";
import { useToast } from "@components/Common/Toast/ToastProvider";

export default function ResetPasswordPage() {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [success, setSuccess] = useState(false);

  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const password = watch("password");

  useEffect(() => {
    if (!token) {
      toast({ type: "error", title: "Invalid link", message: "This reset link is missing a token." });
    }
  }, []);

  const { mutateAsync, isPending } = useMutation({
    mutationFn: resetPassword,
  });

  const onSubmit = async ({ password, confirmPassword }) => {
    if (!token) return;
    try {
      await mutateAsync({ token, password, confirmPassword });
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (err) {
      const msg = err?.response?.data?.message || "Something went wrong.";
      toast({ type: "error", title: "Reset failed", message: msg });
    }
  };

  // ── No token in URL ──
  if (!token) {
    return (
      <section className="relative w-full min-h-screen bg-[#181818] flex justify-center items-center overflow-hidden py-[117px] loginBgImg">
        <div className="relative w-10/12 lg:w-5/12 max-w-[458px] text-center">
          <Image src={logoImg} width={133} height={101} className="mx-auto mb-[31px]" alt="CLA" />
          <div className="bg-[#37352B] border-2 border-[#484942] rounded-[16px] py-10 px-8">
            <div className="w-16 h-16 rounded-full bg-[#2D1C1C] border border-[#56323A] flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M12 9V13M12 17H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#C0696B" strokeWidth="1.8" strokeLinecap="round"/>
              </svg>
            </div>
            <h3 className="textDisplay36 text-[#DFE1E3] mb-3">Invalid Link</h3>
            <p className="textBody16 text-[#ABADAF] mb-8">This reset link is invalid or has already been used.</p>
            <Link href="/forgot-password" className="block w-full bg-[#B88934] hover:bg-[#DFAF32] text-[#2C2313] px-4 py-[13px] rounded-[8px] textHeading16 transition duration-300 text-center">
              Request a New Link
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ── Success state ──
  if (success) {
    return (
      <section className="relative w-full min-h-screen bg-[#181818] flex justify-center items-center overflow-hidden py-[117px] loginBgImg">
        <div className="relative w-10/12 lg:w-5/12 max-w-[458px]">
          <Image src={logoImg} width={133} height={101} className="mx-auto mb-[31px]" alt="CLA" />
          <div className="bg-[#37352B] border-2 border-[#484942] rounded-[16px] py-10 px-8 text-center">
            <div className="w-16 h-16 rounded-full bg-[#AA7C3022] border border-[#37352B] flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M20 6L9 17L4 12" stroke="#B88934" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="textDisplay36 text-[#DFE1E3] mb-3">Password Updated</h3>
            <p className="textBody16 text-[#ABADAF] mb-8">
              Your password has been changed. Redirecting you to sign in…
            </p>
            <Link href="/login" className="block w-full bg-[#B88934] hover:bg-[#DFAF32] text-[#2C2313] px-4 py-[13px] rounded-[8px] textHeading16 transition duration-300 text-center">
              Sign In Now
            </Link>
          </div>
        </div>
      </section>
    );
  }

  // ── Form state ──
  return (
    <section className="relative w-full min-h-screen bg-[#181818] flex justify-center items-center overflow-hidden py-[117px] loginBgImg">
      <div className="relative w-10/12 lg:w-5/12 max-w-[458px]">
        <Image src={logoImg} width={133} height={101} className="mx-auto mb-[31px]" alt="CLA" />
        <h3 className="text-center text-[#DFE1E3] textDisplay36 mb-3">Set New Password</h3>
        <p className="text-center text-[#AFABA3] textLabel16 !text-[18px] mb-[31px]">
          Choose a strong password for your account
        </p>
        <div className="bg-[#37352B] border-2 border-[#484942] rounded-[16px] py-10 px-8">
          <form className="flex flex-col gap-[22px]" onSubmit={handleSubmit(onSubmit)}>

            {/* New password */}
            <div className="flex flex-col gap-2">
              <label className="textHeading16 text-[#DFE1E3]">New Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Password must be at least 8 characters" },
                  })}
                  className="bg-[#17191B] border border-[#484942] text-[#DFE1E3] textBody16 rounded-[8px] px-4 py-3 w-full focus:outline-none focus:border-[#B88934] transition placeholder:text-[#ABADAF] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ABADAF] hover:text-[#DFE1E3] transition"
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.39 1 12a10.07 10.07 0 0 1 2.06-3.94M9.9 4.24A9.12 9.12 0 0 1 12 4c5 0 9.27 3.61 11 8a10.12 10.12 0 0 1-1.12 2.47M3 3L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </button>
              </div>
              {errors.password && <p className="textBody14 text-red-400">{errors.password.message}</p>}
            </div>

            {/* Confirm password */}
            <div className="flex flex-col gap-2">
              <label className="textHeading16 text-[#DFE1E3]">Confirm Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Re-enter your password"
                  {...register("confirmPassword", {
                    required: "Please confirm your password",
                    validate: (v) => v === password || "Passwords do not match",
                  })}
                  className="bg-[#17191B] border border-[#484942] text-[#DFE1E3] textBody16 rounded-[8px] px-4 py-3 w-full focus:outline-none focus:border-[#B88934] transition placeholder:text-[#ABADAF] pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((p) => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#ABADAF] hover:text-[#DFE1E3] transition"
                >
                  {showConfirm ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20C7 20 2.73 16.39 1 12a10.07 10.07 0 0 1 2.06-3.94M9.9 4.24A9.12 9.12 0 0 1 12 4c5 0 9.27 3.61 11 8a10.12 10.12 0 0 1-1.12 2.47M3 3L21 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="textBody14 text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="bg-[#B88934] hover:bg-[#DFAF32] active:bg-[#B88934] text-[#2C2313] px-4 py-[13px] rounded-[8px] textHeading16 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? "Updating..." : "Update Password"}
            </button>

            <Link
              href="/login"
              className="flex items-center justify-center gap-2 textLabel16 text-[#ABADAF] hover:text-[#DFE1E3] transition duration-200"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Back to Sign In
            </Link>
          </form>
        </div>
      </div>
    </section>
  );
}
