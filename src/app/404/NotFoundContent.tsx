"use client";

import Image from "next/image";

export function NotFoundContent() {
  return (
    <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center px-4 py-8">
      <main className="w-full max-w-[320px]">
        <div className="relative pt-0 px-[20px] pb-[20px] flex flex-col items-center text-center">
          <div className="font-aws-diatype-rounded text-[80px] font-bold text-[#FFFFFF] mb-2 flex items-center justify-center gap-[5px] leading-none">
            <span className="text-[#FFFFFF">4</span>
            <Image
              src="/logo.svg"
              alt="Logo"
              width={48}
              height={48}
              className="-mt-[10px]"
            />
            <span className="text-[#FFFFFF">4</span>
          </div>
          <p className="text-[13px] text-[rgb(193,_190,_198)] mb-8">
            Boooo, the page you're looking for does not exist.
          </p>
        </div>
      </main>
    </div>
  );
}
