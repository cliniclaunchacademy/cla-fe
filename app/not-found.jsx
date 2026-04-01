import Link from "next/link";
import Image from "next/image";
import logoImg from "@assets/images/logo.png";

export default function NotFound() {
  return (
    <div className="w-full min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center px-6">
      <Image src={logoImg} width={72} height={72} alt="CLA" className="mb-10 opacity-80" />

      <p className="textLabel16 text-[#B88934] tracking-widest uppercase mb-4">404 — Page Not Found</p>

      <h1 className="textDisplay56 text-[#DFE1E3] text-center mb-4">
        Lost your way?
      </h1>

      <p className="textBody18 text-[#ABADAF] text-center max-w-[420px] mb-10">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <Link
        href="/"
        className="bg-[#B88934] hover:bg-[#DFAF32] active:bg-[#B88934] text-[#2C2313] px-8 py-3 rounded-[8px] textHeading16 transition duration-300"
      >
        Back to Dashboard
      </Link>
    </div>
  );
}
