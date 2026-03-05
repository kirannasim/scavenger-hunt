"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";

const CORRECT_ANSWERS = [
  "Vera Rubin NVL72 Compute Tray", // Station 1
  "RTX PRO 4500 BSE AC PCIe", // Station 2
  "Jetson Thor", // Station 3
];

type GeoCodes = {
  countryCode: string;
  stateCode: string;
  ip: string;
};

function decodeGeoCodes(encoded: string): GeoCodes | null {
  try {
    const base64 = encoded.replace(/-/g, "+").replace(/_/g, "/");
    const paddingNeeded = (4 - (base64.length % 4)) % 4;
    const padded = base64 + "=".repeat(paddingNeeded);
    const decoded = atob(padded);
    const [countryCode, stateCode, ip] = decoded.split(":");
    if (!countryCode || !stateCode || !ip) return null;
    return { countryCode, stateCode, ip };
  } catch {
    return null;
  }
}

export default function ResultsPage() {
  const { encoded } = useParams<{ encoded: string }>();
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function verifyAccess() {
      try {
        const decoded = decodeGeoCodes(encoded);
        if (!decoded) {
          router.replace("/");
          return;
        }

        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) {
          router.replace("/");
          return;
        }

        const data = await res.json();
        const currentCountry = data.country_code || "";
        const currentRegion = data.region_code || "";
        const currentIp = data.ip || "";

        const matches =
          decoded.countryCode === currentCountry &&
          decoded.stateCode === currentRegion &&
          decoded.ip === currentIp;

        if (!matches) {
          router.replace("/");
          return;
        }

        if (!cancelled) {
          setIsVerified(true);
        }
      } catch {
        router.replace("/");
      }
    }

    verifyAccess();

    return () => {
      cancelled = true;
    };
  }, [encoded, router]);

  if (!isVerified) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[rgb(13,_11,_26)] text-white flex items-center justify-center px-4 py-8">
      <main className="w-full max-w-[320px]">
        <div className="relative bg-[rgb(13,_11,_26)] pt-0 px-[20px] pb-[20px] flex flex-col items-center">
          {/* Header */}
          <div className="w-full flex justify-center items-center mb-[20px]">
            <div className="flex items-center gap-[7px]">
              <Image
                src="/logo.svg"
                alt="Haunted House Scavenger Hunt logo"
                width={20}
                height={24}
                priority
              />
              <Image
                src="/Kiro_Logo_Wordmark_White.png"
                alt="Kiro Logo"
                width={57}
                height={18}
                priority
              />
            </div>
          </div>

          {/* Result section */}
          <section className="w-full bg-[transparent] rounded-[16px] border-[1px] border-[solid] border-[#C6A0FF] px-[20px] py-[28px] mb-[20px]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#8E48FF" strokeWidth="1.5" strokeLinecap="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
            <h1 className="font-aws-diatype-rounded text-[22px] font-bold text-[#8E48FF] mt-[14px] mx-0 mb-[8px]">You Found Them All!</h1>
            <p className="text-[13px] text-[rgb(193,_190,_198)] mt-0 mx-0 mb-[18px] leading-[1.6]">Congratulations, detective. You've identified all the NVIDIA hardware in the maze.</p>
            <div className="bg-[rgba(71,_29,_134,_.1)] rounded-[10px] border-[1px] border-[solid] border-[#C6A0FF] p-[14px] text-left">              
            {CORRECT_ANSWERS.map((answer) => {
              return (
                <div
                  key={answer}
                  className="flex items-center gap-[8px] mb-[8px]"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                  <span className="text-[11px] text-[#FFFFFF]">{answer}</span>
                </div>
              );
            })}
            </div>
          </section>

          {/* Claim Swag section */}
          <section className="w-full bg-[#8E48FF] rounded-[12px] border-[1px] border-[solid] border-[#C6A0FF] p-[18px] mb-[16px] text-center">
            <h2 className="font-aws-diatype-rounded text-[15px] font-bold text-[#FFFFFF] mb-[6px]">Claim Your Swag</h2>
            <p className="text-[12px] text-[#C6A0FF] m-0 leading-[1.5]">Show this screen to any Kiro team member to collect your prize.</p>
          </section>

          {/* Result code section */}
          <div className="w-full font-aws-diatype-rounded text-[20px] font-bold text-[#FFFFFF] letter-spacing-[5px] bg-[rgba(71,_29,_134,_.1)] rounded-[8px] border-[1px] border-[dashed] border-[#C6A0FF] p-[14px] text-center">KIRO-7X3M</div>
          <p className="text-[9px] text-[rgb(193,_190,_198)] mt-[8px]">Unique completion code · Valid today only</p>
        </div>
      </main>
    </div>
  );
}