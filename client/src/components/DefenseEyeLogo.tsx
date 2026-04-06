/*
 * DefenseEyeLogo — Shared brand identity component
 * Matches the official DefenseEye logo: dark navy badge + eye icon + wordmark
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
    size === "sm" ? "w-7 h-7" : size === "lg" ? "w-11 h-11" : "w-9 h-9";
  return (
    <svg
      className={cls}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Badge — dark navy rounded square, no border stroke */}
      <rect x="0" y="0" width="40" height="40" rx="9" fill="#0D1B33" />

      {/* Eye almond — white outline */}
      <path
        d="M8 20 C12 13.5 28 13.5 32 20 C28 26.5 12 26.5 8 20Z"
        fill="#0D1B33"
        stroke="white"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Iris — blue fill */}
      <circle cx="20" cy="20" r="5" fill="#1A6FDB" />

      {/* Pupil — dark center */}
      <circle cx="20" cy="20" r="2.6" fill="#0D1B33" />

      {/* Teal highlight dot */}
      <circle cx="20" cy="20" r="1.3" fill="#27D9F5" />

      {/* Glint */}
      <circle cx="22" cy="18.2" r="0.9" fill="white" opacity="0.9" />
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
          <span className="text-foreground">Defense</span>
          <span className="text-[#1A6FDB]">Eye</span>
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
