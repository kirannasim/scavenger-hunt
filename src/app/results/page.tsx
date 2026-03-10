"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const CORRECT_ANSWERS = [
  "Vera Rubin NVL72 Compute Tray", // Station 1
  "RTX PRO 4500 BSE AC PCIe", // Station 2
  "Jetson Thor", // Station 3
];

const STATUS_COOKIE_NAME = "station_status";
const VALID_STATUSES = ["idle", "correct", "incorrect"] as const;
type StatusValue = (typeof VALID_STATUSES)[number];

function getCookieValue(prefix: string, stationId: number, valid: readonly string[]): string | null {
  if (typeof document === "undefined") return null;
  const name = `${prefix}_${stationId}=`;
  const decoded = decodeURIComponent(document.cookie);
  const parts = decoded.split(";");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(name)) {
      const value = trimmed.slice(name.length);
      if (valid.includes(value)) return value;
      return null;
    }
  }
  return null;
}

function getStatusCookie(stationId: number): StatusValue | null {
  const value = getCookieValue(STATUS_COOKIE_NAME, stationId, VALID_STATUSES);
  return value as StatusValue | null;
}

export default function ResultsPage() {
  const [foundCount, setFoundCount] = useState<number | null>(null);

  useEffect(() => {
    let count = 0;
    for (let i = 1; i <= 3; i++) {
      if (getStatusCookie(i) === "correct") {
        count++;
      }
    }
    setFoundCount(count);
  }, []);

  if (foundCount === null) {
    return (
      <div className="min-h-screen bg-[rgb(13,_11,_26)] text-white flex items-center justify-center px-4 py-8">
        <main className="w-full max-w-[320px]">
          <div className="relative bg-[rgb(13,_11,_26)] pt-0 px-[20px] pb-[20px] flex flex-col items-center">
            <p className="text-[13px] text-[rgb(193,_190,_198)]">Loading...</p>
          </div>
        </main>
      </div>
    );
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

          {foundCount === 3 ? (
            <>
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

              {/* Result code section - value from .env (NEXT_PUBLIC_COMPLETION_CODE) */}
              <div className="w-full font-aws-diatype-rounded text-[20px] font-bold text-[#FFFFFF] letter-spacing-[5px] bg-[rgba(71,_29,_134,_.1)] rounded-[8px] border-[1px] border-[dashed] border-[#C6A0FF] p-[14px] text-center">
                {process.env.NEXT_PUBLIC_COMPLETION_CODE ?? "KIRO-7X3M"}
              </div>
              <p className="text-[9px] text-[rgb(193,_190,_198)] mt-[8px]">Unique completion code · Valid today only</p>
            </>
          ) : (
            <>
              <section className="w-full bg-[transparent] rounded-[16px] border-[1px] border-[solid] border-[#C6A0FF] px-[20px] py-[28px] mb-[20px]">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6M9 9l6 6"></path></svg>
                <h1 className="font-aws-diatype-rounded text-[20px] font-bold text-[#F87171] mt-[12px] mx-0 mb-[8px] text-[rgb(248,_113,_113)]">You're Not There Yet!</h1>
                <p className="text-[13px] text-[rgb(193,_190,_198)] m-0 leading-normal">Keep looking for the hardware at the stations.</p>                
              </section>
            </>
          )}
        </div>
      </main>
    </div>
  );
}