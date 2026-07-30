export default function HeroBackground() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden">
      {/* Top Left Glow */}
      <div className="absolute left-[-180px] top-[-120px] h-[420px] w-[420px] rounded-full bg-blue-500/20 blur-[120px]" />

      {/* Top Right Glow */}
      <div className="absolute right-[-180px] top-10 h-[360px] w-[360px] rounded-full bg-violet-500/20 blur-[120px]" />

      {/* Bottom Center Glow */}
      <div className="absolute bottom-[-180px] left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-cyan-500/10 blur-[140px]" />

      {/* Grid Pattern */}
      <div
        className="
          absolute inset-0
          bg-[linear-gradient(to_right,rgba(120,120,120,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(120,120,120,0.08)_1px,transparent_1px)]
          bg-[size:40px_40px]
          dark:opacity-100
          opacity-40
        "
      />

      {/* Radial Fade */}
      <div className="absolute inset-0 bg-radial from-transparent via-background/20 to-background" />
    </div>
  );
}
