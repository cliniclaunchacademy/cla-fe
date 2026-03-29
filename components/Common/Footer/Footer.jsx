import Image from "next/image";
import React from "react";
import logo from "@assets/images/logo.png";
import PhoneIcon from "@assets/icons/phoneIcon";
import MailsIcon from "@assets/icons/mailsIcon";
import AddressIcon from "@assets/icons/addressIcon";
import Link from "next/link";

const Footer = () => {
  return (
    <div className="containerPadding py-[57px] bg-[#131313] text-[#E5E5E5] flex flex-col lg:flex-row justify-between gap-y-8">
      <div className="w-full lg:w-4/12">
        <div className="flex gap-2.5 items-center mb-4">
          <Image src={logo} alt="Logo" />
          <p className="font-medium text-[16px] leading-[24px] tracking-[0.14em] uppercase text-[#F8F8F8]">
            Indian society of cell <br /> biology
          </p>
        </div>
        <p className="textBody14 mb-[54px]">
          The society promotes confluence of diverse areas of life sciences like
          cell structure, genetics, chromosome biology, developmental biology,
          immunology, microbiology, biochemistry, physiology, evolutionary
          biology, etc.
        </p>
        <div className="">
          <div className="flex gap-3 items-center mb-2">
            <AddressIcon
              width={"18"}
              height={"18"}
              className={"text-[#F8F8F8]"}
            />
            <span>Banaras Hindu University, Varanasi, 221005</span>
          </div>
          <div className="flex gap-3 items-center mb-2">
            <PhoneIcon
              width={"18"}
              height={"18"}
              className={"text-[#F8F8F8]"}
            />
            <span>91-542-2368145</span>
          </div>
          <div className="flex gap-3 items-center mb-2">
            <MailsIcon
              width={"18"}
              height={"18"}
              className={"text-[#F8F8F8]"}
            />
            <span>aryaricha+ISCB@bhu.ac.in</span>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-5/12 flex flex-col md:flex-row gap-10 2xl:gap-[68px]">
        <div>
          <p className="mb-3 text-[#929292]">Main Menu</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4  font-medium text-[14px] leading-[16px] tracking-[0em] text-[#F8F8F8]">
            <Link href="/" className="min-w-[90px]">
              Home
            </Link>
            <Link href="/events/upcomingEvents" className="min-w-[90px]">
              Upcoming Events
            </Link>
            <Link href="/organization/about" className="min-w-[90px]">
              About Us
            </Link>
            <Link href="/events/pastEvents" className="min-w-[90px]">
              Past Events
            </Link>
            <Link href="/organization/executiveCommittee" className="min-w-[90px]">
              Executive Members
            </Link>
            <Link href="/awards/endowmentLectures" className="min-w-[90px]">
              Endowment lectures
            </Link>
            <Link href="/organization/history" className="min-w-[90px]">
              History
            </Link>
            <Link href="/awards/studentAwards" className="min-w-[90px]">
              Student Awards
            </Link>
            <Link href="/member/listMembers" className="min-w-[90px]">
              List of members
            </Link>

            <Link href="/member/applyMember" className="min-w-[90px]">
              Apply to be a member
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-[#929292]">Account</p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-4  font-medium text-[14px] leading-[16px] tracking-[0em] text-[#F8F8F8]">
            <Link href="/dashboard/login" className="min-w-[90px]">
              Admin Login
            </Link>
          </div>
        </div>
        <div>
          <p className="mb-3 text-[#929292]">Help center</p>
          <div className="grid grid-cols-1 gap-x-6 gap-y-4  font-medium text-[14px] leading-[16px] tracking-[0em] text-[#F8F8F8]">
            <Link href="/" className="min-w-[90px]">
              Guidelines
            </Link>
            <Link href="/" className="min-w-[90px]">
              Cancel & Return Policy
            </Link>
            <Link href="/" className="min-w-[90px]">
              Privacy Policy
            </Link>
            <Link href="/" className="min-w-[90px]">
              Terms & Condition
            </Link>
            <Link href="/" className="min-w-[90px]">
              Payments
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
