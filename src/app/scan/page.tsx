"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";

const STATION_QR_CODES = [
  "/Station_1_QR_Code.png",
  "/Station_2_QR_Code.png",
  "/Station_3_QR_Code.png",
];

function ScanInner() {
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const searchParams = useSearchParams();
  const stationIdParam = searchParams?.get("stationId") ?? "1";
  const stationIndex = Number.parseInt(stationIdParam, 10);

  useEffect(() => {
    setPermission("requesting");
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "environment" } })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setPermission("granted");
      })
      .catch((err: Error) => {
        setPermission("denied");
        setError(err.message || "Could not access camera");
      });

    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, []);  

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

          {error && (
            <p className="text-[#F87171] text-sm mb-4 text-center">{error}</p>
          )}
          
          {permission === "denied" && (
            <p className="text-[rgb(193,_190,_198)] text-[13px] text-center mb-4">
              Allow camera access in your browser settings, then refresh.
            </p>
          )}

          {permission === "requesting" && (
            <p className="text-[#C6A0FF] text-[13px] mb-4">Opening camera & loading QR code …</p>
          )}

          {permission === "granted" && (
            <div className="w-full max-w-[320px]">
              <Image
                src={STATION_QR_CODES[stationIndex - 1]}
                alt="QR Code"
                width={300}
                height={300}
                className="w-full h-auto"
              />
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover hidden"
              />
            </div>
          )}

          <p className="text-[11px] text-[rgb(193,_190,_198)] mt-4 text-center">
            Point your camera at the station&apos;s QR code.
          </p>
        </div>
      </main>
    </div>
  );
}

export default function ScanPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[rgb(13,_11,_26)] text-white flex items-center justify-center px-4 py-8">
          <main className="w-full max-w-[320px]">
            <div className="text-center text-[13px] text-[rgb(193,_190,_198)]">
              Loading scanner…
            </div>
          </main>
        </div>
      }
    >
      <ScanInner />
    </Suspense>
  );
}

