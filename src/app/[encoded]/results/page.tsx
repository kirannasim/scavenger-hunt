"use client";

import { useEffect, useState } from "react";
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
              <div className="w-[26px] h-[26px] rounded-[6px] bg-[linear-gradient(135deg,_rgb(124,_58,_237),_rgb(159,_103,_255))] flex items-center justify-center text-[13px] font-extrabold text-[rgb(255,_255,_255)] tracking-[-0.5px]">K</div>
              <span className="font-sans font-extrabold text-[16px] text-[rgb(241,_245,_249)] tracking-[-0.3px]">kiro</span>
            </div>
          </div>

          {/* Result section */}
          <section className="w-full bg-[rgba(251,_191,_36,_0.1)] rounded-[16px] border-[1px] border-[solid] border-[rgba(251,191,36,0.2)] px-[20px] py-[28px] mb-[20px]">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#FBBF24" strokeWidth="1.5" strokeLinecap="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22"></path><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22"></path><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"></path></svg>
            <h1 className="font-sans text-[22px] font-extrabold text-[rgb(251,_191,_36)] mt-[14px] mx-0 mb-[8px]">You Found Them All!</h1>
            <p className="font-sans text-[13px] text-[rgb(148,_163,_184)] mt-0 mx-0 mb-[18px] leading-[1.6]">Congratulations, detective. You've identified all the NVIDIA hardware in the maze.</p>
            <div className="bg-[rgb(21,_18,_43)] rounded-[10px] border-[1px] border-[solid] border-[rgb(42,37,71)] p-[14px] text-left">              
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
                  <span className="font-sans text-[11px] text-[rgb(241,_245,_249)]">{answer}</span>
                </div>
              );
            })}
            </div>
          </section>

          {/* Claim Swag section */}
          <section className="w-full bg-[rgba(124,58,237,0.18)] rounded-[12px] border-[1px] border-[solid] border-[rgba(124,58,237,0.3)] p-[18px] mb-[16px] text-center">
            <div className="font-sans text-[15px] font-bold text-[rgb(167,139,250)] mb-[6px]">Claim Your Swag</div>
            <p className="font-sans text-[12px] text-[rgb(148,163,184)] m-0 leading-[1.5]">Show this screen to any Kiro team member to collect your prize.</p>
          </section>

          {/* Result code section */}
          <div className="w-full text-[20px] font-bold text-[rgb(167,139,250)] letter-spacing-[5px] bg-[rgb(30,26,56)] rounded-[8px] border-[1px] border-[dashed] border-[rgba(124,58,237,0.3)] p-[14px] text-center">KIRO-7X3M</div>
          <p className="text-[9px] text-[rgb(100,116,139)] mt-[8px]">Unique completion code · Valid today only</p>
        </div>
      </main>
    </div>
  );
}