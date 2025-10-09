import {
  FaFacebook,
  FaTwitter,
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
} from "react-icons/fa";
import { FiMail, FiLink } from "react-icons/fi";
import { JSX } from "react";
import { isPhone } from "./validations";

export const getNormalizedLink = (url: string): string => {
  const trimmed = url.trim();
  const lower = trimmed.toLowerCase();

  if (lower.includes("@") && !lower.startsWith("http")) {
    return `mailto:${trimmed}`;
  }

  if (isPhone(lower)) {
    return lower.startsWith("tel:") ? trimmed : `tel:${trimmed}`;
  }

  if (!lower.startsWith("http")) {
    return `https://${trimmed}`;
  }

  return trimmed;
};

export const getLinkIcon = (url: string): JSX.Element => {
  const lower = url.toLowerCase().trim();

  if (lower.includes("@") && !lower.startsWith("http")) return <FiMail />;
  if (isPhone(lower)) return <FaPhone />;

  try {
    const hostname = new URL(
      lower.startsWith("http") ? lower : `https://${lower}`
    ).hostname.replace("www.", "");

    const iconMap: Record<string, JSX.Element> = {
      facebook: <FaFacebook />,
      twitter: <FaTwitter />,
      telegram: <FaTelegram />,
      github: <FaGithub />,
      linkedin: <FaLinkedin />,
      instagram: <FaInstagram />,
      youtube: <FaYoutube />,
      tiktok: <FaTiktok />,
      discord: <FaDiscord />,
      reddit: <FaReddit />,
      pinterest: <FaPinterest />
    };

    for (const [key, icon] of Object.entries(iconMap)) {
      if (hostname.includes(key)) return icon;
    }
  } catch (error) {
    console.warn("Invalid link passed to getLinkIcon:", url, ";\nError:", error);
  }

  return <FiLink />;
};
