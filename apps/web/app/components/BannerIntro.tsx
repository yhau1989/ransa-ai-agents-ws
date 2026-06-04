"use client";

import Image from "next/image";

export default function BannerIntro() {
  return (
    <section className="bg-gradient-to-r from-ransa-900 via-ransa-800 to-ransa-500 py-8 relative overflow-hidden">
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-8 md:gap-12">
          {/* Left Content */}
          <div className="flex-1 flex flex-col justify-center md:pr-8">
            <h1 className="text-4xl font-extrabold mb-4 text-center font-stretch-50% text-white">
              Sistema <span className="text-ransa-light">PQRS</span>
            </h1>

            <p className="text-md mb-4 text-gray-100 font-light text-center opacity-80">
              Peticiones · Quejas · Reconocimientos · Sugerencias
            </p>

            {/* Button Group */}
            <div className="flex flex-row justify-center gap-4 text-slate-100">
              <a
                href="#"
                className="rounded-full text-white py-1 px-3 text-[11px] sm:text-xs shadow-lg transition-all duration-200  text-center border border-slate-50 opacity-70"
              >
                Atención al cliente
              </a>

              <a
                href="#"
                className="rounded-full text-white py-1 px-3 text-[11px] sm:text-xs shadow-lg transition-all duration-200  text-center border border-slate-50 opacity-70"
              >
                Ley de Protección de Datos
              </a>
            </div>
          </div>

          {/* Right Content - Mascot Image */}
          <div className="w-auto flex flex-col justify-center md:justify-end">
            <div className="relative h-40 w-40 rounded-full overflow-hidden shadow-lg border-4 border-ransa-light">
              <Image
                src="/mascot-ransa.jpg"
                alt="Mascota RANSA"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="text-white text-center mt-2 text-xs font-bold opacity-80">
              EN RUTA CON USTED
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
