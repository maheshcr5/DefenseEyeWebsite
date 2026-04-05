/*
 * DefenseEyeLogo — Shared brand identity component
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
      <defs>
        <linearGradient id="de-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#00D4FF" />
          <stop offset="100%" stopColor="#27E39A" />
        </linearGradient>
      </defs>
      {/* Badge background */}
      <rect x="1" y="1" width="38" height="38" rx="10" fill="#050C19" stroke="url(#de-grad)" strokeWidth="1.8" />
      {/* Shield panel */}
      <path d="M20 6.5 L30.5 10.5 V18.8C30.5 25.5 26.2 31.4 20 33.7C13.8 31.4 9.5 25.5 9.5 18.8V10.5L20 6.5Z" fill="#081427" stroke="#00D4FF" strokeOpacity="0.45" strokeWidth="0.8" />
      {/* Eye outer almond */}
      <path
        d="M11 20 C13.8 16 26.2 16 29 20 C26.2 24 13.8 24 11 20Z"
        fill="none"
        stroke="url(#de-grad)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Iris ring */}
      <circle cx="20" cy="20" r="3.6" fill="none" stroke="#00D4FF" strokeWidth="1.1" />
      {/* Pupil */}
      <circle cx="20" cy="20" r="1.9" fill="#27E39A" />
      {/* Inner dark pupil */}
      <circle cx="20" cy="20" r="0.9" fill="#06101E" />
      {/* Glint — adds depth */}
      <circle cx="21.4" cy="18.9" r="0.7" fill="white" opacity="0.85" />
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
          <span className="text-[#27E39A]">Eye</span>
          <span className="text-muted-foreground/50 font-normal text-[0.6em] align-super ml-px hidden sm:inline">
            .ai
          </span>
        </span>
      )}
    </span>
  );

  if (href) {
    return (
      <a href={href} aria-label="DefenseEye.ai — Home" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded">
        {inner}
      </a>
    );
  }

  return inner;
}

/** Icon-only for tight spaces */
export { EyeIcon as DefenseEyeIcon };
