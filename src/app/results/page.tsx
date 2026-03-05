"use client";

import Link from "next/link";

export default function ResultsPage() {
  // TODO: Read real progress from localStorage to determine completion.
  const allStationsCompleted = false;

  return (
    <div className="min-h-screen bg-[rgb(13,_11,_26)] text-white flex items-center justify-center px-4 py-8">
      <main className="w-full max-w-[320px]">
        <div className="relative bg-[rgb(13,_11,_26)] pt-0 px-[20px] pb-[20px] flex flex-col items-center">
          {/* Badge / header */}
          <div className="relative w-[120px] h-[120px] rounded-[28px] mt-[8px] mx-[auto] mb-[20px] bg-[rgb(22,_163,_74)] flex items-center justify-center [box-shadow:rgba(34,_197,_94,_0.45)_0px_8px_40px,_rgba(34,_197,_94,_0.15)_0px_0px_80px]">
            <span className="text-[40px]">🎉</span>
          </div>

          <section className="text-center space-y-2 mb-[20px]">
            <h1 className="font-aws-diatype-rounded text-[24px] font-bold text-[rgb(241,_245,_249)] mt-0 mx-0 tracking-[-0.5px] leading-[1.15]">
              You found them all!
            </h1>
            <p className="text-[11px] text-[rgb(148,_163,_184)] mt-[6px]">
              Show this screen to Kiro staff to claim your haunted house swag.
            </p>
          </section>

          <section className="w-full">
            <div className="bg-[rgb(30,_64,_175)]/40 rounded-[14px] border-[1px] border-[solid] border-[rgba(129,_140,_248,_0.6)] px-[16px] pt-[16px] pb-[12px] mb-[18px] text-[12px]">
              <p className="text-[rgb(199,_210,_254)] font-semibold mb-[6px]">
                Completion status
              </p>
              <p className="text-[rgb(191,_219,_254)]">
                {allStationsCompleted
                  ? "All 3 NVIDIA hardware stations are verified as correct on this device."
                  : "This is a preview. Hook this page up to your station progress to confirm completion."}
              </p>
            </div>
          </section>

          <section className="w-full flex flex-col gap-[10px]">
            <Link
              href="/"
              className="block w-full text-center px-0 py-[12px] rounded-[10px] border-[none] bg-[linear-gradient(135deg,_rgb(124,_58,_237),_rgb(159,_103,_255))] text-[rgb(255,_255,_255)] text-[14px] font-bold cursor-pointer [box-shadow:rgba(124,_58,_237,_0.35)_0px_4px_20px]"
            >
              Back to Start
            </Link>
          </section>

          <p className="text-[10px] text-center text-[rgb(100,_116,_139)] mt-[12px]">
            Staff: visually check this animated screen and the device before
            handing out swag.
          </p>
        </div>
      </main>
    </div>
  );
}


