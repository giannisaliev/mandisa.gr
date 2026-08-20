import Link from "next/link";
import { InstagramIcon, FacebookIcon, YoutubeIcon } from "@/components/site/SocialIcons";

type Settings = {
  siteName: string;
  footerText: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  tiktokUrl: string | null;
  youtubeUrl: string | null;
};

export function Footer({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();
  const socials = [
    { url: settings.instagramUrl, label: "Instagram", Icon: InstagramIcon },
    { url: settings.facebookUrl, label: "Facebook", Icon: FacebookIcon },
    { url: settings.youtubeUrl, label: "YouTube", Icon: YoutubeIcon },
  ].filter((s) => s.url);

  return (
    <footer className="border-t border-white/10 bg-black">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-6 py-12 text-center">
        <Link href="/" className="font-display text-xl tracking-wide text-white">
          {settings.siteName}
        </Link>
        {settings.footerText && (
          <p className="max-w-md text-sm text-muted">{settings.footerText}</p>
        )}
        {socials.length > 0 && (
          <div className="flex flex-col items-center gap-3">
            <span className="text-xs tracking-[0.2em] text-muted uppercase">Follow Me</span>
            <div className="flex items-center gap-4">
              {socials.map(({ url, label, Icon }) => (
                <a
                  key={label}
                  href={url!}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-full border border-white/20 p-2.5 text-white transition hover:border-accent hover:text-accent"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>
        )}
        {settings.tiktokUrl && (
          <a
            href={settings.tiktokUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-muted underline-offset-4 hover:text-white hover:underline"
          >
            TikTok
          </a>
        )}
        <p className="pt-4 text-xs tracking-widest text-muted-2">
          Copyright {year}, All Rights Reserved.
        </p>
      </div>
    </footer>
  );
}
