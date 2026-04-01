"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import logoImg from "@assets/images/logo.png";
import { forgotPassword } from "apis/auth.api";
import { useToast } from "@components/Common/Toast/ToastProvider";

export default function ForgotPasswordPage() {
  const toast = useToast();
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm();

  const { mutateAsync, isPending } = useMutation({
    mutationFn: (email) => forgotPassword(email),
  });

  const onSubmit = async ({ email }) => {
    try {
      await mutateAsync(email);
      setSubmittedEmail(email);
      setSubmitted(true);
    } catch {
      // API always returns 200 — error only on network failure
      toast({ type: "error", title: "Request failed", message: "Could not connect. Please try again." });
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-[#181818] flex justify-center items-center overflow-hidden py-[117px] loginBgImg">
      <div className="relative w-10/12 lg:w-5/12 max-w-[458px]">
        <Image src={logoImg} width={133} height={101} className="mx-auto mb-[31px]" alt="CLA" />

        {submitted ? (
          /* ── Success state ── */
          <div className="bg-[#37352B] border-2 border-[#484942] rounded-[16px] py-10 px-8 text-center">
            {/* Check icon */}
            <div className="w-16 h-16 rounded-full bg-[#AA7C3022] border border-[#37352B] flex items-center justify-center mx-auto mb-6">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 6L9 17L4 12" stroke="#B88934" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <h3 className="textDisplay36 text-[#DFE1E3] mb-3">Check your email</h3>
            <p className="textLabel16 text-[#AFABA3] mb-2">
              If <span className="text-[#DFE1E3]">{submittedEmail}</span> is registered, we've sent a password reset link.
            </p>
            <p className="textBody14 text-[#ABADAF] mb-8">
              The link expires in 1 hour. Check your spam folder if you don't see it.
            </p>
            <Link
              href="/login"
              className="block w-full bg-[#B88934] hover:bg-[#DFAF32] active:bg-[#B88934] text-[#2C2313] px-4 py-[13px] rounded-[8px] textHeading16 transition duration-300 text-center"
            >
              Back to Sign In
            </Link>
          </div>
        ) : (
          /* ── Form state ── */
          <>
            <h3 className="text-center text-[#DFE1E3] textDisplay36 mb-3">Forgot Password?</h3>
            <p className="text-center text-[#AFABA3] textLabel16 !text-[18px] mb-[31px]">
              Enter your email and we'll send you a reset link
            </p>
            <div className="bg-[#37352B] border-2 border-[#484942] rounded-[16px] py-10 px-8">
              <form className="flex flex-col gap-[22px]" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2">
                  <label className="textHeading16 text-[#DFE1E3]">Email</label>
                  <input
                    type="email"
                    placeholder="Enter your email"
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                        message: "Enter a valid email address",
                      },
                    })}
                    className="bg-[#17191B] border border-[#484942] text-[#DFE1E3] textBody16 rounded-[8px] px-4 py-3 w-full focus:outline-none focus:border-[#B88934] transition placeholder:text-[#ABADAF]"
                  />
                  {errors.email && (
                    <p className="textBody14 text-red-400">{errors.email.message}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="bg-[#B88934] hover:bg-[#DFAF32] active:bg-[#B88934] text-[#2C2313] px-4 py-[13px] rounded-[8px] textHeading16 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Sending..." : "Send Reset Link"}
                </button>

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 textLabel16 text-[#ABADAF] hover:text-[#DFE1E3] transition duration-200"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Back to Sign In
                </Link>
              </form>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
