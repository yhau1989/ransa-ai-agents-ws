export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-white border-t border-gray-100 shadow-[0_-8px_30px_rgba(15,23,42,0.06)]">
      <div className="mx-auto flex min-h-14 max-w-3xl items-center justify-center px-4 py-4 text-center text-xs sm:text-sm">
        <p className="text-gray-400 text-xs">
          © {year} Ransa Colombia S.A.S ·{" "}
          <a
            href="mailto:protecciondedatos@ransa.net"
            className="text-ransa-700!"
          >
            protecciondedatos@ransa.net
          </a>
        </p>
      </div>
    </footer>
  );
}
