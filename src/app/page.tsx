"use client";

import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-[rgb(13,_11,_26)] text-white flex items-center justify-center px-4 py-8">
      <main className="w-full max-w-[320px]">        
        <div className="relative bg-[rgb(13,_11,_26)] pt-0 px-[20px] pb-[20px] flex flex-col items-center">
          {/* Icon */}
          <div className="relative w-[120px] h-[120px] rounded-[28px] mt-[8px] mx-[auto] mb-[20px] bg-[rgb(124,_58,_237)] flex items-center justify-center [box-shadow:rgba(124,_58,_237,_0.45)_0px_8px_40px,_rgba(124,_58,_237,_0.15)_0px_0px_80px] overflow-hidden">
            <Image
              src="/logo.svg"
              alt="Haunted House Scavenger Hunt logo"
              width={120}
              height={120}
              priority
            />
          </div>

          {/* Title and description */}
          <section className="text-center space-y-2">
            <h1 className="font-sans text-[24px] font-extrabold text-[rgb(241,_245,_249)] mt-0 mx-0 mb-[4px] tracking-[-0.5px] leading-[1.15]">
              Haunted House
              <br />
              Scavenger Hunt
            </h1>
            <p className="text-[10px] text-[rgb(167,_139,_250)] uppercase tracking-[2px] mt-0 mx-0 mb-[16px]">
              Powered by Kiro
            </p>
            <p className="text-[13px] text-[rgb(148,_163,_184)] mt-0 mx-0 mb-[24px] leading-[1.55] px-[4px] py-0">
              Navigate the maze. Spot the latest NVIDIA
              <br />
              hardware. Identify them all to win Kiro swag.
            </p>
          </section>

          {/* How it works */}
          <section className="w-full">
            <div className="bg-[rgb(30,_26,_56)] rounded-[14px] border-[1px] border-[solid] border-[rgb(42,37,71)] px-[16px] pt-[18px] pb-[6px] mb-[20px]">
              <p className="text-[10px] text-[rgb(167,_139,_250)] text-center uppercase tracking-[2px] mb-[14px]">
                How it works
              </p>
              <ol>
                {[
                  "Scan QR codes at each station",
                  "Identify the NVIDIA hardware",
                  "Get all 3 correct to win",
                ].map((text, index) => (
                  <li key={index} className="flex items-center gap-[10px] mb-[12px] text-left">
                    <span className="w-[24px] h-[24px] rounded-[50%] flex-shrink-0 bg-[rgba(124,_58,_237,_0.18)] border-[1px] border-[solid] border-[rgba(124,58,237,0.3)] flex items-center justify-center text-[11px] font-bold text-[rgb(167,_139,_250)]">
                      {index + 1}
                    </span>
                    <span className="font-sans text-[13px] text-[rgb(203,_213,_225)]">{text}</span>
                  </li>
                ))}
              </ol>
            </div>
          </section>

          {/* CTA button */}
          <section className="w-full">
            <Link
              href="/qr-code"
              className="block w-full text-center px-0 py-[14px] rounded-[10px] border-[none] bg-[linear-gradient(135deg,_rgb(124,_58,_237),_rgb(159,_103,_255))] text-[rgb(255,_255,_255)] text-[14px] font-bold cursor-pointer [box-shadow:rgba(124,_58,_237,_0.35)_0px_4px_20px] disabled:opacity-60 disabled:cursor-not-allowed"
            >
              Scan QR Code to Start
            </Link>
          </section>

          {/* Footer */}
          <footer className="text-[10px] text-[rgb(100,_116,_139)] mt-[12px]">
            3 stations · ~10 min
          </footer>
        </div>
      </main>
    </div>
  );
}
