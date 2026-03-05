import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const AWSDiatypeFont = localFont({
  src: [
    {
      path: "../../public/fonts/AWSDiatype-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/AWSDiatype-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/AWSDiatype-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/AWSDiatype-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/AWSDiatype-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/AWSDiatype-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-aws-diatype",
  display: "swap",
});

const AWSDiatypeRoundedFont = localFont({
  src: [
    {
      path: "../../public/fonts/AWSDiatypeRounded-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/AWSDiatypeRounded-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/AWSDiatypeRounded-RegularItalic.otf",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/AWSDiatypeRounded-RegularItalic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../../public/fonts/AWSDiatypeRounded-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/AWSDiatypeRounded-Bold.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-aws-diatype-rounded",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Kiro Haunted House",
  description: "Kiro Haunted House",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${AWSDiatypeFont.variable} ${AWSDiatypeRoundedFont.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
