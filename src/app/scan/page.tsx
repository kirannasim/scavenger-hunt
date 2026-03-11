"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
// ZXing is used for cross-browser QR scanning (including iOS Safari and Android).
// Make sure to install it in your project:
//   npm install @zxing/browser
// or
//   yarn add @zxing/browser
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { BrowserQRCodeReader } = require("@zxing/browser");

function ScanInner() {
  const [error, setError] = useState<string | null>(null);
  const [permission, setPermission] = useState<"idle" | "requesting" | "granted" | "denied">("idle");
  const [userGestureRequired, setUserGestureRequired] = useState(false);
  const [scannedText, setScannedText] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<any | null>(null);

  const startScan = useCallback(
    (fromUserGesture = false) => {
      if (typeof window === "undefined") return;
      if (!navigator.mediaDevices?.getUserMedia) {
        setError("Camera is not supported in this browser.");
        return;
      }

      const video = videoRef.current;
      if (!video) return;

      setError(null);
      setUserGestureRequired(false);
      setPermission("requesting");

      const codeReader = new BrowserQRCodeReader();

      codeReader
        .decodeFromConstraints(
          {
            video: {
              facingMode: { ideal: "environment" },
            },
          },
          video,
          (result: any, err: any, controls: any) => {
            if (controls && !controlsRef.current) {
              controlsRef.current = controls;
            }

            if (result) {
              const text = result.getText();
              setScannedText(text);

              // Stop scanning once we have a result
              if (controls) {
                controls.stop();
              }

              // If it's a URL, navigate to it; otherwise show the raw text
              if (/^https?:\/\//i.test(text)) {
                window.location.href = text;
              } else {
                setError("Scanned QR code is not a URL. Content: " + text);
              }
            }
          }
        )
        .then((controls: any) => {
          controlsRef.current = controls;
          setPermission("granted");
        })
        .catch((err: any) => {
          console.error(err);
          setPermission("denied");
          setError(err?.message || "Could not access camera");

          // Some mobile browsers (e.g. iOS Safari) may require a user gesture
          if (
            !fromUserGesture &&
            typeof navigator !== "undefined" &&
            /iPhone|iPad|iPod|Safari/i.test(navigator.userAgent)
          ) {
            setUserGestureRequired(true);
          }
        });
    },
    []
  );

  useEffect(() => {
    // Try to start scanning automatically
    startScan(false);

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
    };
  }, [startScan]);

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
                  onClick={() => startScan(true)}
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
              <p className="text-[11px] text-[rgb(193,_190,_198)] mt-2 text-center">
                Align the printed QR code inside the frame to scan.
              </p>
              {scannedText && (
                <p className="text-[11px] text-[rgb(193,_190,_198)] mt-1 text-center break-words">
                  Last scanned: {scannedText}
                </p>
              )}
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

