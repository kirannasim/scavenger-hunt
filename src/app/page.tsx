"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center px-4 py-8">
      <main className="w-full max-w-[320px]">        
        <div className="relative pt-0 px-[20px] pb-[20px] flex flex-col items-center">
          {/* Icon */}
          <div className="relative w-[120px] h-[120px] rounded-[28px] mt-[8px] mx-[auto] mb-[20px] bg-[#8E48FF] flex items-center justify-center [box-shadow:rgba(124,_58,_237,_0.45)_0px_8px_40px,_rgba(124,_58,_237,_0.15)_0px_0px_80px] overflow-hidden">
            <Image
              src="/logo.svg"
              alt="Haunted House Scavenger Hunt logo"
              width={60}
              height={60}
              priority
            />
          </div>

          {/* Title and description */}
          <section className="text-center space-y-2">
            <h1 className="font-aws-diatype-rounded text-[24px] font-bold text-[#FFFFFF] mt-0 mx-0 mb-[4px] tracking-[-0.5px] leading-[1.15]">
              Haunted House
              <br />
              Scavenger Hunt
            </h1>
            <p className="text-[10px] text-[#C6A0FF] uppercase tracking-[2px] mt-0 mx-0 mb-[16px]">
              Powered by Kiro
            </p>
            <p className="text-[13px] text-[rgb(193,_190,_198)] mt-0 mx-0 mb-[24px] leading-[1.55] px-[4px] py-0">
              Navigate the maze. Spot the NVIDIA hardware available now or soon to be available on AWS.  Identify them all to win Kiro swag.
            </p>
          </section>

          {/* How it works */}
          <section className="w-full">
            <div className="rounded-[14px] bg-[#8E48FF] border-[1px] border-[solid] border-[#C6A0FF] px-[16px] pt-[18px] pb-[6px] mb-[20px]">
              <h2 className="font-aws-diatype-rounded text-[10px] text-[#FFFFFF] text-center uppercase tracking-[2px] mb-[14px]">
                How it works
              </h2>
              <ol>
                {[
                  "Scan QR codes at each station",
                  "Identify the NVIDIA hardware",
                  "Get all 3 correct to win",
                ].map((text, index) => (
                  <li key={index} className="flex items-center gap-[10px] mb-[12px] text-left">
                    <span className="w-[24px] h-[24px] rounded-[50%] flex-shrink-0 border-[1px] border-[solid] border-[#C6A0FF] flex items-center justify-center text-[11px] font-bold text-[#C6A0FF]">
                      {index + 1}
                    </span>
                    <span className="text-[13px] text-[#FFFFFF]">{text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* CTA button */}
          {/* <section className="w-full">
            <Link
              href="#"
              className="block w-full font-aws-diatype-rounded text-center px-0 py-[14px] rounded-[10px] border-[none] bg-[#8E48FF] text-[#FFFFFF] text-[14px] font-bold cursor-pointer [box-shadow:rgba(124,_58,_237,_0.35)_0px_4px_20px] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Scan QR Code to Start
            </Link>
          </section> */}

          {/* Footer */}
          <footer className="text-[10px] text-[rgb(193,_190,_198)] mt-[12px]">
            3 stations · ~10 min
          </footer>
        </div>
      </main>
    </div>
  );
}
