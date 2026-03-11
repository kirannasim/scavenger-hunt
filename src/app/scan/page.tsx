"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";

function ScanInner() {
  const [error, setError] = useState<string | null>(null);
  const [scannedText, setScannedText] = useState<string | null>(null);
  const scannerRef = useRef<any | null>(null);
  const readerId = "html5qr-reader";

  useEffect(() => {
    let cancelled = false;

    async function setupScanner() {
      try {
        if (typeof window === "undefined") return;

        const { Html5QrcodeScanner, Html5QrcodeScanType } = await import("html5-qrcode");
        if (cancelled) return;

        const config = {
          fps: 10,
          qrbox: { width: 300, height: 300 },
          rememberLastUsedCamera: true,
          supportedScanTypes: [Html5QrcodeScanType.SCAN_TYPE_CAMERA],
        };

        const onScanSuccess = (decodedText: string) => {
          setScannedText(decodedText);
          if (/^https?:\/\//i.test(decodedText)) {
            window.location.href = decodedText;
          } else {
            setError("Scanned QR code is not a URL. Content: " + decodedText);
          }
        };

        const onScanError = (_errorMessage: string) => {
          // ignore continuous scan errors
        };

        const scanner = new Html5QrcodeScanner(readerId, config, false);
        scannerRef.current = scanner;
        scanner.render(onScanSuccess, onScanError);
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Could not start HTML5 QR scanner.");
      }
    }

    setupScanner();

    return () => {
      cancelled = true;
      if (scannerRef.current) {
        scannerRef.current.clear().catch(() => undefined);
        scannerRef.current = null;
      }
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

