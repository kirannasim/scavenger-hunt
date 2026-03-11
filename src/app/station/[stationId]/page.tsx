"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";

type NvidiaOption = {
  value: string;
  label: string;
};

const NVIDIA_OPTIONS: NvidiaOption[] = [
  { value: "", label: "Choose a product" },
  { value: "Vera Rubin NVL72 Compute Tray", label: "Vera Rubin NVL72 Compute Tray" },
  { value: "HGX Rubin NVL8", label: "HGX Rubin NVL8" },
  { value: "Vera HPM for HGX Rubin", label: "Vera HPM for HGX Rubin" },
  { value: "RTX PRO 4500 BSE AC PCIe", label: "RTX PRO 4500 BSE AC PCIe" },
  { value: "RTX PRO 6000 BSE", label: "RTX PRO 6000 BSE" },
  { value: "GB200 Superchip", label: "GB200 Superchip" },
  { value: "HGX H200 8way", label: "HGX H200 8way" },
  { value: "HGX B300 8way AC", label: "HGX B300 8way AC" },
  { value: "Jetson Thor", label: "Jetson Thor" },
];

const CORRECT_ANSWERS = [
  "Vera Rubin NVL72 Compute Tray", // Station 1
  "RTX PRO 4500 BSE AC PCIe", // Station 2
  "Jetson Thor", // Station 3
];

const STATUS_COOKIE_NAME = "station_status";
const VISITED_COOKIE_NAME = "station_visited";
const VALID_STATUSES = ["idle", "correct", "incorrect"] as const;
const VALID_VISITED = ["yes", "no"] as const;
type StatusValue = (typeof VALID_STATUSES)[number];
type VisitedValue = (typeof VALID_VISITED)[number];

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

function setStatusCookie(stationId: number, status: StatusValue): void {
  if (typeof document === "undefined") return;
  const name = `${STATUS_COOKIE_NAME}_${stationId}`;
  document.cookie = `${name}=${encodeURIComponent(status)}; path=/; max-age=2592000`; // 30 days
}

function getVisitedCookie(stationId: number): VisitedValue | null {
  const value = getCookieValue(VISITED_COOKIE_NAME, stationId, VALID_VISITED);
  return value as VisitedValue | null;
}

function setVisitedCookie(stationId: number, visited: VisitedValue): void {
  if (typeof document === "undefined") return;
  const name = `${VISITED_COOKIE_NAME}_${stationId}`;
  document.cookie = `${name}=${encodeURIComponent(visited)}; path=/; max-age=2592000`; // 30 days
}

export default function StationQuestionPage() {
  const router = useRouter();
  const params = useParams<{ stationId: string }>();
  const stationIdParam = params?.stationId ?? "1";
  const searchParams = useSearchParams();

  const [stationIndex, setStationIndex] = useState(1);
  const [status, setStatus] = useState<"loading" | "idle" | "correct" | "incorrect" | "already_cracked">(
    "loading",
  );
  // Dot indicators: which of the 3 stations are completed (correct). Set from cookies in effect so first load is correct.
  const [completedStations, setCompletedStations] = useState<[boolean, boolean, boolean]>([false, false, false]);

  // Single effect: parse param, redirect to 404 if invalid, then set stationIndex + status + completedStations from cookies
  useEffect(() => {
    const n = Number.parseInt(stationIdParam, 10);
    if (Number.isNaN(n) || n < 1 || n > 3) {
      router.replace("/404");
      return;
    }
    setStationIndex((prev) => (prev !== n ? n : prev));
    const savedStatus = getStatusCookie(n);
    const visited = getVisitedCookie(n);
    const displayStatus = savedStatus
      ? visited === "yes" && savedStatus === "correct"
        ? "already_cracked"
        : savedStatus
      : "idle";
    setStatus((prev) => (prev !== displayStatus ? displayStatus : prev));
    setCompletedStations([
      getStatusCookie(1) === "correct",
      getStatusCookie(2) === "correct",
      getStatusCookie(3) === "correct",
    ]);
  }, [stationIdParam]); // eslint-disable-line react-hooks/exhaustive-deps -- router is stable; only react to param change

  const stepFraction = `${stationIndex}/3`;
  const stepLabel = `Station ${stationIndex} of 3`;
  const correctAnswer =
    CORRECT_ANSWERS[stationIndex - 1] ?? "";

  const [selected, setSelected] = useState<string>(NVIDIA_OPTIONS[0].value);  

  const countFoundStations = () => {
    let count = 0;
    [...Array(3)].map((_, i) => {
      if (getStatusCookie(i + 1) === "correct") {
        count++;
      }
    });
    return count;
  };

  const isDisabled = selected === NVIDIA_OPTIONS[0].value;

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const isCorrect = selected === correctAnswer;
    setStatus(isCorrect ? "correct" : "incorrect");
    setStatusCookie(stationIndex, isCorrect ? "correct" : "incorrect");
    setVisitedCookie(stationIndex, "yes");
    if (isCorrect) {
      setCompletedStations((prev) => {
        const next = [...prev] as [boolean, boolean, boolean];
        next[stationIndex - 1] = true;
        return next;
      });
    }
  };

  const handleScanQRCode = () => {
    // Find the first station (1–3) that is not yet correct (idle or incorrect)
    const nextStation = [1, 2, 3].find((num) => !completedStations[num - 1]);
    if (nextStation == null) {
      router.push("/results");
      return;
    } else {
      // router.push(`/station/${nextStation}?status=qr_code`);
      // Open lens screen to start scanning QR code
      router.push("/scan");
      return;
    }    
  };

  // const handleNextStation = () => {
  //   // Find the first station (1–3) that is not yet correct (idle or incorrect)
  //   const nextStation = [1, 2, 3].find((num) => !completedStations[num - 1]);
  //   if (nextStation == null) {
  //     // All stations correct → go to results
  //     router.push("/results");
  //   } else {
  //     router.push(`/station/${nextStation}`);
  //   }
  // };  

  return (
    <div className="min-h-screen bg-[#000000] text-white flex items-center justify-center px-4 py-8">
      <main className="w-full max-w-[320px]">
        <div className="relative pt-0 px-[20px] pb-[20px] flex flex-col items-center">
          {/* Header */}
          <div className="w-full flex justify-between items-center mb-[20px]">
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
            <div className="flex gap-[8px] items-center">
              {[1, 2, 3].map((num) => {
                const isCorrect = completedStations[num - 1];
                return (
                  <div
                    key={num}                    
                    className={
                      isCorrect
                        ? "w-[10px] h-[10px] rounded-[50%] bg-[#C6A0FF] border-[1.5px] border-[solid] border-[#C6A0FF]"
                        : "w-[10px] h-[10px] rounded-[50%] bg-[transparent] border-[1.5px] border-[solid] border-[#C6A0FF]"
                    }
                  />
                );
              })}
              <span className="text-[11px] text-[rgb(193,_190,_198)] ml-[4px]">
                {stepFraction}
              </span>
            </div>
          </div>

          {status === "loading" && (
            <section className="w-full">
              <div className="w-full px-[16px] py-[14px] text-[#FFFFFF] text-center">
                Loading...
              </div>
            </section>
          )}

          {status === "idle" && (
            <section className="w-full">
              {/* Question Title */}
              <div className="w-full bg-[#8E48FF] rounded-[12px] border-[1px] border-[solid] border-[#C6A0FF] px-[16px] py-[14px] mb-[20px] flex items-center gap-[12px]">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#C6A0FF" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8"></circle><path d="m21 21-4.35-4.35"></path></svg>
                <div>
                  <p className="text-[10px] text-[#C6A0FF] uppercase tracking-[1.5px] mb-[2px]">
                    {stepLabel}
                  </p>
                  <h1 className="font-aws-diatype-rounded text-[20px] font-bold text-[#FFFFFF] tracking-[-0.4px] leading-[1.15]">What Did You Find?</h1>
                </div>
              </div>

              <p className="text-[13px] text-[rgb(193,_190,_198)] mt-0 mx-0 mb-[24px] leading-[1.6]">
                You've discovered a piece of NVIDIA hardware hidden in the maze. Can you identify it?
              </p>

              {/* Question card */}
              <form onSubmit={handleSubmit}>
                <label className="text-[10px] text-[rgb(193,_190,_198)] uppercase tracking-[1.5px] block mb-[8px]">
                  Select the hardware
                </label>

                <div className="relative w-full mb-[20px]">
                  <select
                    value={selected}
                    onChange={(e) => {
                      setSelected(e.target.value);
                      setStatus("idle");
                    }}
                    className="
                      w-full
                      bg-[#000000]
                      rounded-[8px]
                      border border-[#C6A0FF]
                      px-[14px] py-[12px]
                      pr-8
                      text-[13px] text-[#FFFFFF]
                      appearance-none                      
                      focus-visible:border-[#C6A0FF]
                      focus-visible:outline-none
                    "
                  >
                    {NVIDIA_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>

                  <svg
                    className="absolute right-[14px] top-1/2 -translate-y-1/2"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#C6A0FF"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                <button
                  type="submit"
                  disabled={isDisabled}
                  className={
                    isDisabled
                      ? "w-full px-0 py-[14px] rounded-[10px] border-none bg-[#646464] text-[#959595] font-aws-diatype-rounded text-[14px] font-bold cursor-default opacity-50 [box-shadow:none]"
                      : "w-full px-0 py-[14px] rounded-[10px] border-none bg-[#8E48FF] text-[#FFFFFF] font-aws-diatype-rounded text-[14px] font-bold cursor-pointer"
                  }
                >
                  Submit Answer
                </button>
              </form>
            </section>
          )}

          {/* Correct state */}
          {status === "correct" && (
            <section className="w-full">
              <div className="bg-[rgba(110,_231,_183,_0.12)] rounded-[16px] border-[1px] border-[solid] border-[rgba(110,231,183,0.25)] p-[28px] text-center mb-[20px]">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <h2 className="font-aws-diatype-rounded text-[20px] font-bold text-[rgb(110,_231,_183)] mt-[12px] mx-0 mb-[8px]">Nice detective work!</h2>
                <p className="text-[13px] text-[rgb(193,_190,_198)] m-0 leading-normal">
                  You correctly identified the
                    <br/>
                    <strong className="text-[#FFFFFF]">{correctAnswer}</strong>
                </p>
              </div>

              <div className="bg-[#000000] rounded-[12px] border-[1px] border-[solid] border-[#C6A0FF] p-[16px] mb-[20px]">
                <p className="text-[10px] text-[#FFFFFF] uppercase tracking-[1.5px] mb-[12px]">
                  Your progress
                </p>
                <div className="space-y-[6px] text-[12px]">
                  {[1, 2, 3].map((num) => {
                    const isDone = getStatusCookie(num) === "correct";
                    const productName = CORRECT_ANSWERS[num - 1];
                    const label =
                      isDone
                        ? `Station ${num} — ${productName}`
                        : `Station ${num} — Not found yet`;
                    return (
                      <div
                        key={num}
                        className="flex items-center gap-[10px] mb-[8px] opacity-100"
                      >
                        {isDone && (
                          <>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#6EE7B7" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                            <span className="text-[12px] text-[#FFFFFF]">{label}</span>
                          </>
                        )}
                        {!isDone && (
                          <>
                            <div className="w-[16px] h-[16px] rounded-[50%] border-[1.5px] border-[solid] border-[#646464]"></div>
                            <span className="text-[12px] text-[#646464]">{label}</span>
                          </>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {countFoundStations() === 3 ? (
                <button
                  type="button"
                  onClick={() => router.push("/results")}
                  className="w-full px-0 py-[14px] rounded-[10px] border-[none] bg-[#8E48FF] font-aws-diatype-rounded text-[#FFFFFF] text-[14px] font-bold cursor-pointer"
                >
                  View Results
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleScanQRCode}
                  className="w-full px-0 py-[14px] rounded-[10px] border-[none] bg-[#8E48FF] font-aws-diatype-rounded text-[#FFFFFF] text-[14px] font-bold cursor-pointer"
                >
                  Scan QR Code
                </button>
              )}
            </section>
          )}

          {/* Incorrect state */}
          {status === "incorrect" && (
            <section className="w-full">
              <div className="bg-[rgba(248,_113,_113,_0.1)] rounded-[16px] border-[1px] border-[solid] border-[rgba(248,113,113,0.25)] p-[28px] text-center mb-[20px]">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"></circle><path d="m15 9-6 6M9 9l6 6"></path></svg>
                <h2 className="font-aws-diatype-rounded text-[20px] font-bold text-[rgb(248,_113,_113)] mt-[12px] mx-0 mb-[8px]">That's not it</h2>
                <p className="text-[13px] text-[rgb(193,_190,_198)] m-0 leading-normal">
                  Take another look around the station
                  <br/>
                  and try again.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setSelected(NVIDIA_OPTIONS[0].value);
                  setStatus("idle");
                  setStatusCookie(stationIndex, "idle");
                  setVisitedCookie(stationIndex, "no");
                }}
                className="w-full px-0 py-[14px] rounded-[10px] bg-transparent border-[1px] border-[solid] border-[#FFFFFF] font-aws-diatype-rounded text-[#FFFFFF] text-[14px] font-bold cursor-pointer"
              >
                Try Again
              </button>
            </section>
          )}

          {/* Already cracked state */}
          {status === "already_cracked" && (
            <section className="w-full">
              <div className="bg-[#8E48FF] rounded-[16px] border-[1px] border-[solid] border-[#C6A0FF] p-[28px] text-center mb-[20px]">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                <h2 className="font-aws-diatype-rounded text-[20px] font-bold text-[#FFFFFF] mt-[12px] mx-0 mb-[8px]">Already cracked this one!</h2>
                <p className="text-[13px] text-[#FFFFFF] m-0 leading-normal">
                  You've already identified the hardware at station {stationIndex}. Keep moving through the maze.
                </p>
              </div>

              <div className="text-[10px] text-[rgb(193,_190,_198)] uppercase tracking-[1.5px] mb-[12px] text-center">{countFoundStations()} of 3 found</div>

              {countFoundStations() === 3 ? (
                <button
                  type="button"
                  onClick={() => router.push("/results")}
                  className="w-full px-0 py-[14px] rounded-[10px] border-[none] bg-[#8E48FF] font-aws-diatype-rounded text-[#FFFFFF] text-[14px] font-bold cursor-pointer"
                >                
                  View Results
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleScanQRCode}
                  className="w-full px-0 py-[14px] rounded-[10px] border-[none] bg-[#8E48FF] font-aws-diatype-rounded text-[#FFFFFF] text-[14px] font-bold cursor-pointer"
                >
                  Scan QR Code
                </button>
              )}
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
