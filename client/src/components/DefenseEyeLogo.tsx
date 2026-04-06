/*
 * DefenseEyeLogo — uses the official PNG logo from /public/defenseeye-logo.png
 *
 * Props:
 *   href?      — wraps in <a> when provided (for nav use)
 *   size?      — "sm" | "md" (default) | "lg"
 *   className? — extra classes on the wrapper
 *   showText?  — unused, kept for API compatibility
 */

interface DefenseEyeLogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
}

const SIZE_MAP = {
  sm: "h-7",
  md: "h-9",
  lg: "h-11",
};

export default function DefenseEyeLogo({
  href,
  size = "md",
  className = "",
}: DefenseEyeLogoProps) {
  const img = (
    <img
      src="/defenseeye-logo.png"
      alt="DefenseEye"
      className={`${SIZE_MAP[size]} w-auto object-contain ${className}`}
      draggable={false}
    />
  );

  if (href) {
    return (
      <a href={href} aria-label="DefenseEye — Home" className="focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 rounded">
        {img}
      </a>
    );
  }

  return img;
}

/** Kept for any direct icon imports — renders the same logo at icon size */
export function DefenseEyeIcon({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  return (
    <img
      src="/defenseeye-logo.png"
      alt="DefenseEye"
      className={`${SIZE_MAP[size]} w-auto object-contain`}
      draggable={false}
    />
  );
}
