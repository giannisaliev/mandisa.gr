// lucide-react dropped trademarked brand icons, so these are small
// hand-drawn monoline glyphs matching the rest of the site's icon set.
type IconProps = { size?: number; className?: string };

export function InstagramIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={className}
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function FacebookIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M14 8.5h2.5V5h-2.7C11.5 5 10 6.6 10 9.1V11H8v3.5h2V21h3.5v-6.5H16l.6-3.5h-3.1V9.4c0-.6.3-.9 1-.9Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function YoutubeIcon({ size = 16, className }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      className={className}
    >
      <rect x="2.5" y="6" width="19" height="12" rx="4" />
      <path d="M10.5 9.6v4.8l4.3-2.4-4.3-2.4Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TiktokIcon({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className}>
      <path
        d="M14 3.5c.4 2 1.9 3.4 4 3.6v2.7c-1.5 0-2.9-.5-4-1.3v6.4a5 5 0 1 1-4.3-4.9v2.8a2.3 2.3 0 1 0 1.7 2.2V3.5H14Z"
        fill="currentColor"
      />
    </svg>
  );
}
