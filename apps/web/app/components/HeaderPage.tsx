"use client";

import Image from "next/image";

export default function HeaderPage() {
  return (
    <header className="bg-white border-b border-gray-300">
      <div className="flex items-center justify-between py-4 h-20 mx-auto max-w-3xl">
        {/* Logo RANSA */}
        <div className="flex-shrink-0">
          <Image
            src="/LOGO_RANSA.png"
            alt="RANSA Logo"
            width={120}
            height={50}
            priority
            className="h-auto w-auto max-w-xs"
          />
        </div>

        {/* Separador vertical y texto COLOMBIA */}
        <div className="flex items-center gap-6">
          <div className="hidden md:block border-l border-gray-300 h-4"></div>
          <span className="text-sm font-medium text-gray-700 hidden md:inline">
            COLOMBIA
          </span>
        </div>
      </div>
    </header>
  );
}
