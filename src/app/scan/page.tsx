"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

type PermissionState = "unknown" | "granted" | "denied" | "prompt";

function ScanInner() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [scannedText, setScannedText] = useState<string | null>(null);
  const [permissionState, setPermissionState] = useState<PermissionState>("unknown");
  const qrCodeRef = useRef<any | null>(null);
  const readerId = "html5qr-reader";
  const startAttemptedRef = useRef(false);
  const mountedRef = useRef(true);

  const startScanner = useCallback(async () => {
    if (startAttemptedRef.current) return;
    startAttemptedRef.current = true;
    setError(null);

    try {
      if (typeof window === "undefined") return;

      const { Html5Qrcode } = await import("html5-qrcode");
      if (!mountedRef.current) return;

      // const html5QrCode = new Html5Qrcode(readerId);
      // qrCodeRef.current = html5QrCode;

      if (!qrCodeRef.current) {
        qrCodeRef.current = new Html5Qrcode(readerId);
      }

      const html5QrCode = qrCodeRef.current;

      const config = {
        fps: 10,
        qrbox: { width: 300, height: 300 },
      };

      const onScanSuccess = (decodedText: string) => {
        setScannedText(decodedText);
        if (/^https?:\/\//i.test(decodedText)) {
          router.push(decodedText);
        } else {
          setError("Scanned QR code is not a URL. Content: " + decodedText);
        }
      };

      const onScanError = (_errorMessage: string) => {
        // ignore continuous scan errors
      };

      await html5QrCode.start(
        { facingMode: "environment" },
        config,
        onScanSuccess,
        onScanError
      );
      setPermissionState("granted");
    } catch (e: any) {
      console.error(e);
      startAttemptedRef.current = false;
      setPermissionState("denied");
      setError(e?.message || "Could not start camera.");
    }
  }, []);

  // Check permission on mount; start scanner only if already granted (no prompt)
  useEffect(() => {
    mountedRef.current = true;
    let cancelled = false;

    async function checkAndMaybeStart() {
      if (typeof window === "undefined") return;

      try {
        // Permissions API: check without triggering a prompt
        if ("permissions" in navigator && "query" in navigator.permissions) {
          const result = await navigator.permissions.query({ name: "camera" as PermissionName });
          if (cancelled) return;
          if (result.state === "granted") {
            setPermissionState("granted");
            startScanner();
            return;
          }
          if (result.state === "denied") {
            setPermissionState("denied");
            setError("Camera access was previously denied. Enable it in your browser settings.");
            return;
          }
          setPermissionState("prompt");          
          return;
        }
      } catch {
        // Safari and some browsers don't support camera in Permissions API
      }
      if (cancelled) return;
      setPermissionState("prompt");
    }

    checkAndMaybeStart();

    return () => {
      mountedRef.current = false;
      cancelled = true;
      // if (qrCodeRef.current) {
      //   qrCodeRef.current
      //     .stop()
      //     .then(() => qrCodeRef.current?.clear())
      //     .catch(() => undefined);
      //   qrCodeRef.current = null;
      // }
    };
  }, [startScanner]);

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

          {permissionState === "prompt" && (
            <button
              type="button"
              onClick={startScanner}
              className="w-full max-w-[320px] mt-2 px-4 py-4 rounded-xl bg-[#C6A0FF] text-[rgb(13,_11,_26)] font-semibold text-center"
            >
              Start camera
            </button>
          )}

          {permissionState === "denied" && (
            <button
              type="button"
              onClick={() => {
                startAttemptedRef.current = false;
                setPermissionState("prompt");
                setError(null);
              }}
              className="w-full max-w-[320px] mt-2 px-4 py-4 rounded-xl border border-[rgb(53,_47,_89)] bg-[rgb(22,_19,_45)] font-medium text-center"
            >
              Try again
            </button>
          )}

          <div
            id={readerId}
            className="w-full max-w-[320px] rounded-xl overflow-hidden bg-[#ffffff] text-[#000000]"
          />

          {scannedText && (
            <p className="text-[11px] text-[rgb(193,_190,_198)] mt-4 text-center break-words">
              Last scanned: {scannedText}
            </p>
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

