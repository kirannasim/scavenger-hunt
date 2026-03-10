"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

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

export default function Home() {
  const router = useRouter();
  const [completedStations, setCompletedStations] = useState<[boolean, boolean, boolean]>([false, false, false]);
  
  useEffect(() => {
    setCompletedStations([
      getStatusCookie(1) === "correct",
      getStatusCookie(2) === "correct",
      getStatusCookie(3) === "correct",
    ]);
  }, []);

  const handleScanQRCode = () => {
    // Find the first station (1–3) that is not yet correct (idle or incorrect)
    const nextStation = [1, 2, 3].find((num) => !completedStations[num - 1]);
    if (nextStation == null) {
      router.push("/results");
      return;
    } else {
      router.push(`/scan?stationId=${nextStation}`);
    }
  };

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
          <section className="w-full">
            <button
              type="button"
              onClick={handleScanQRCode}
              className="w-full px-0 py-[14px] rounded-[10px] border-[none] bg-[#8E48FF] font-aws-diatype-rounded text-[#FFFFFF] text-[14px] font-bold cursor-pointer"
            >
                Scan QR Code to Start
            </button>
          </section>

          {/* Footer */}
          <footer className="text-[10px] text-[rgb(193,_190,_198)] mt-[12px]">
            3 stations · ~10 min
          </footer>
        </div>
      </main>
    </div>
  );
}
