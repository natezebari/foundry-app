export function LogoMark({ size = 26 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-45 16 16)">
        <rect x="12" y="3" width="8" height="9" rx="1.5" fill="#FFB338" />
        <rect x="14.4" y="12" width="3.2" height="16" rx="1.4" fill="#FFB338" />
      </g>
      <polyline
        points="4,26 11,19 16,22 27,9"
        fill="none"
        stroke="#52E3B0"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polygon points="27,9 21.5,9.8 26.2,13.5" fill="#52E3B0" />
    </svg>
  );
}

export function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <LogoMark />
      <span className="font-display font-bold text-lg tracking-tight text-text">FOUNDRY</span>
    </div>
  );
}
