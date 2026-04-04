/**
 * DefenseEyeLogo — Shared brand identity component
 *
 * Renders the DefenseEye logo icon (SVG) optionally combined with the
 * wordmark. Import this in every page/layout so the brand stays consistent.
 *
 * Props
 *   iconSize   — Tailwind size class for the icon square, default "h-9 w-9"
 *   showText   — Whether to render "DefenseEye" wordmark next to the icon
 *   className  — Wrapper class applied to the outer <a> / <div>
 *   href       — If provided, wraps everything in an <a> tag
 */

interface DefenseEyeLogoProps {
  iconSize?: string;
  showText?: boolean;
  className?: string;
  href?: string;
  "aria-label"?: string;
}

function Icon({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* ── Rounded-square background badge ─────────────────────── */}
      <rect
        x="1" y="1" width="38" height="38" rx="10"
        fill="#061828"
        stroke="#1674c8"
        strokeWidth="1.6"
      />

      {/* ── Eye almond — filled hull ─────────────────────────────── */}
      <path
        d="M7 20 C10 13.5 30 13.5 33 20 C30 26.5 10 26.5 7 20 Z"
        fill="#082040"
      />
      {/* ── Eye almond — crisp outline ───────────────────────────── */}
      <path
        d="M7 20 C10 13.5 30 13.5 33 20 C30 26.5 10 26.5 7 20 Z"
        fill="none"
        stroke="#1e8fef"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* ── Iris ring ────────────────────────────────────────────── */}
      <circle cx="20" cy="20" r="5.5" fill="none" stroke="#1e8fef" strokeWidth="1.3" />

      {/* ── Pupil — solid blue ────────────────────────────────────── */}
      <circle cx="20" cy="20" r="2.9" fill="#1e8fef" />

      {/* ── Glint ─────────────────────────────────────────────────── */}
      <circle cx="22.2" cy="18.4" r="1.1" fill="white" opacity="0.75" />

      {/* ── Subtle corner scan-lines (tech feel) ─────────────────── */}
      <line x1="2" y1="8"  x2="8"  y2="2"  stroke="#1674c8" strokeWidth="0.6" opacity="0.45" strokeLinecap="round" />
      <line x1="38" y1="8" x2="32" y2="2"  stroke="#1674c8" strokeWidth="0.6" opacity="0.45" strokeLinecap="round" />
      <line x1="2" y1="32" x2="8"  y2="38" stroke="#1674c8" strokeWidth="0.6" opacity="0.45" strokeLinecap="round" />
      <line x1="38" y1="32" x2="32" y2="38" stroke="#1674c8" strokeWidth="0.6" opacity="0.45" strokeLinecap="round" />
    </svg>
  );
}

export default function DefenseEyeLogo({
  iconSize = "h-9 w-9",
  showText = true,
  className = "",
  href,
  "aria-label": ariaLabel = "DefenseEye.ai — Home",
}: DefenseEyeLogoProps) {
  const inner = (
    <>
      <Icon className={iconSize} />
      {showText && (
        <span className="font-heading font-bold text-lg tracking-tight text-foreground leading-none select-none">
          Defense<span className="text-[#1e8fef]">Eye</span>
        </span>
      )}
    </>
  );

  const wrapperCls = `flex items-center gap-2.5 ${className}`;

  if (href) {
    return (
      <a href={href} className={wrapperCls} aria-label={ariaLabel}>
        {inner}
      </a>
    );
  }

  return <div className={wrapperCls}>{inner}</div>;
}

/** Icon-only export for tight spaces */
export { Icon as DefenseEyeIcon };
