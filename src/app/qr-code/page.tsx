"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import QRCode from "react-qr-code";

type GeoCodes = {
  countryCode: string;
  stateCode: string;
  ip: string;
};

export default function QRPage() {
  const [targetUrl, setTargetUrl] = useState<string>("");
  const [geoCodes, setGeoCodes] = useState<GeoCodes | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    (async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        if (!res.ok) return;

        const data = await res.json();

        // ipapi fields: https://ipapi.co/api/#complete-location
        const countryCode = data.country_code || "";
        const stateCode = data.region_code || "";
        const ip = data.ip || "";

        if (!countryCode || !stateCode || !ip) return;

        setGeoCodes({
          countryCode,
          stateCode,
          ip,
        });
        // Build encoded payload: countryCode:stateCode:ip → URL-safe base64
        const payload = `${countryCode}:${stateCode}:${ip}`;
        const base64 = btoa(payload);
        const encoded = base64
          .replace(/\+/g, "-")
          .replace(/\//g, "_")
          .replace(/=+$/, "");

        const origin = window.location.origin;
        const url = `${origin}/${encoded}/station`;
        console.log("url:", url);
        setTargetUrl(url);
      } catch {
        // Swallow errors; fall back to defaults below.
      }
    })();
  }, []);

  return (
    <div className="min-h-screen bg-[rgb(13,_11,_26)] text-white flex items-center justify-center px-4 py-8">
      <main className="w-full max-w-[320px]">
        <div className="relative bg-[rgb(13,_11,_26)] pt-0 px-[20px] pb-[20px] flex flex-col items-center">
          {/* Icon */}
          <div className="relative w-[120px] h-[120px] rounded-[28px] mt-[8px] mx-[auto] mb-[20px] bg-[rgb(124,_58,_237)] flex items-center justify-center [box-shadow:rgba(124,_58,_237,_0.45)_0px_8px_40px,_rgba(124,_58,_237,_0.15)_0px_0px_80px] overflow-hidden">
            <Image
              src="/logo.svg"
              alt="Haunted House Scavenger Hunt logo"
              width={120}
              height={120}
              priority
            />
          </div>

          {/* Title and description */}
          <section className="text-center space-y-2">
            <h1 className="font-sans text-[24px] font-extrabold text-[rgb(241,_245,_249)] mt-0 mx-0 mb-[4px] tracking-[-0.5px] leading-[1.15]">
              Haunted House
              <br />
              Scavenger Hunt
            </h1>
            <p className="text-[10px] text-[rgb(167,_139,_250)] uppercase tracking-[2px] mt-0 mx-0 mb-[16px]">
              Powered by Kiro
            </p>
            <p className="text-[13px] text-[rgb(148,_163,_184)] mt-0 mx-0 mb-[24px] leading-[1.55] px-[4px] py-0">
              Scan this code in the maze to open the correct question page.
            </p>
          </section>

          <div className="bg-white p-4 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.7)]">
            {targetUrl ? (
              <QRCode
                value={targetUrl}
                size={220}
                bgColor="#ffffff"
                fgColor="#020617"
              />
            ) : (
              <div className="h-[220px] w-[220px] flex items-center justify-center text-xs text-slate-400">
                Generating QR...
              </div>
            )}
          </div>

          <p className="text-[10px] text-center text-[rgb(100,_116,_139)] mt-[12px]">
            Tip: Open this page on your phone, then capture the QR to place it at
            the physical station.
          </p>
        </div>
      </main>
    </div>
  );
}
