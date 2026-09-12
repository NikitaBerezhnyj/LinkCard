import { JSX } from "react";
import {
  FaFacebook,
  FaXTwitter,
  FaTelegram,
  FaGithub,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaTiktok,
  FaDiscord,
  FaReddit,
  FaPinterest,
  FaPhone
} from "react-icons/fa6";
import { FiMail, FiLink } from "react-icons/fi";
import { isPhone } from "./validations";

const ICON_BY_DOMAIN: [domains: string[], icon: JSX.Element][] = [
  [["facebook.com", "fb.com"], <FaFacebook key="fb" />],
  [["twitter.com", "x.com"], <FaXTwitter key="x" />],
  [["t.me", "telegram.org", "telegram.me"], <FaTelegram key="tg" />],
  [["github.com"], <FaGithub key="gh" />],
  [["linkedin.com"], <FaLinkedin key="li" />],
  [["instagram.com"], <FaInstagram key="ig" />],
  [["youtube.com", "youtu.be"], <FaYoutube key="yt" />],
  [["tiktok.com"], <FaTiktok key="tt" />],
  [["discord.com", "discord.gg"], <FaDiscord key="dc" />],
  [["reddit.com"], <FaReddit key="rd" />],
  [["pinterest.com"], <FaPinterest key="pt" />]
];

function matchesDomain(hostname: string, domains: string[]): boolean {
  return domains.some(domain => hostname === domain || hostname.endsWith(`.${domain}`));
}

export function getLinkIcon(url: string): JSX.Element {
  const lower = url.toLowerCase().trim();

  if (lower.includes("@") && !lower.startsWith("http")) return <FiMail />;
  if (isPhone(lower)) return <FaPhone />;

  try {
    const hostname = new URL(
      lower.startsWith("http") ? lower : `https://${lower}`
    ).hostname.replace("www.", "");

    const match = ICON_BY_DOMAIN.find(([domains]) => matchesDomain(hostname, domains));
    if (match) return match[1];
  } catch {
    return <FiLink />;
  }

  return <FiLink />;
}
