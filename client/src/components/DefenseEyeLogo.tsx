/*
 * DefenseEyeLogo — Shared brand identity component
 * Clean blue eye icon + "DefenseEye" wordmark
 *
 * Props:
 *   href?      — wraps in <a> when provided (for nav use)
 *   size?      — "sm" | "md" (default) | "lg"
 *   className? — extra classes on the wrapper
 *   showText?  — show wordmark next to icon (default: true)
 */

interface DefenseEyeLogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

function EyeIcon({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const cls =
    size === "sm" ? "w-8 h-5" : size === "lg" ? "w-11 h-7" : "w-10 h-6";
  return (
    <svg
      className={cls}
      viewBox="0 0 56 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Outer blue eye/almond shape */}
      <path
        d="M3 18 C13 4, 43 4, 53 18 C43 32, 13 32, 3 18Z"
        fill="#1565C0"
      />
      {/* White inner area creates open-eye look */}
      <ellipse cx="28" cy="18" rx="16" ry="10" fill="white" />
      {/* Orange/amber iris */}
      <circle cx="28" cy="18" r="6.5" fill="#E07800" />
      {/* Dark pupil */}
      <circle cx="28" cy="18" r="3.2" fill="#0D1B33" />
      {/* Glint */}
      <circle cx="30.5" cy="15.5" r="1.4" fill="white" opacity="0.9" />
    </svg>
  );
}

export default function DefenseEyeLogo({
  href,
  size = "md",
  className = "",
  showText = true,
}: DefenseEyeLogoProps) {
  const gap = size === "sm" ? "gap-2" : "gap-2.5";
  const textCls =
    size === "sm"
      ? "text-base"
      : size === "lg"
      ? "text-xl"
      : "text-[1.1rem]";

  const inner = (
    <span className={`flex items-center ${gap} ${className}`}>
      <EyeIcon size={size} />
      {showText && (
        <span
          className={`font-heading font-bold tracking-tight leading-none select-none ${textCls}`}
        >
          <span className="text-[#0D1B33]">Defense</span>
          <span className="text-[#1565C0]">Eye</span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <a href={href} aria-label="DefenseEye — Home" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded">
        {inner}
      </a>
    );
  }

  return inner;
}

/** Icon-only for tight spaces */
export { EyeIcon as DefenseEyeIcon };
