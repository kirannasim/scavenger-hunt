"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

// Mobile-friendly camera constraints (back camera on phones)
const CAMERA_CONSTRAINTS: MediaStreamConstraints = {
  video: {
    facingMode: "environment",
    width: { ideal: 1280 },
    height: { ideal: 720 },
  },
  audio: false,
};

function ScanInner() {
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const [userGestureRequired, setUserGestureRequired] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = useCallback(() => {
    setError(null);
    setUserGestureRequired(false);
    setPermission("requesting");
    navigator.mediaDevices
      .getUserMedia(CAMERA_CONSTRAINTS)
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
        // Some mobile browsers (e.g. iOS Safari) require a user gesture
        if (/iPhone|iPad|iPod|Safari/i.test(navigator.userAgent)) {
          setUserGestureRequired(true);
        }
      });
  }, []);

  useEffect(() => {
    if (typeof navigator === "undefined" || !navigator.mediaDevices?.getUserMedia) return;
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    };
  }, [startCamera]);

  // Attach stream to video when it mounts (e.g. after permission granted)
  useEffect(() => {
    if (permission === "granted" && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
    }
  }, [permission]);  

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
            <>
              <p className="text-[rgb(193,_190,_198)] text-[13px] text-center mb-4">
                {userGestureRequired
                  ? "Tap the button below to open the camera."
                  : "Allow camera access in your browser settings, then refresh."}
              </p>
              {userGestureRequired && (
                <button
                  type="button"
                  onClick={startCamera}
                  className="px-4 py-2 bg-[#C6A0FF] text-[rgb(13,_11,_26)] rounded-lg font-medium text-sm mb-4"
                >
                  Open camera
                </button>
              )}
            </>
          )}

          {permission === "requesting" && (
            <p className="text-[#C6A0FF] text-[13px] mb-4">Opening camera …</p>
          )}

          {permission === "granted" && (
            <div className="w-full max-w-[320px]">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full aspect-square max-h-[300px] object-cover rounded-lg"
              />
            </div>
          )}
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

