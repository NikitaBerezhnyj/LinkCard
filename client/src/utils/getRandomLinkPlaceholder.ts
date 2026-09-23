interface ILinkPlaceholder {
  name: string;
  url: string;
}

const LINK_PLACEHOLDERS: ILinkPlaceholder[] = [
  {
    name: "Instagram",
    url: "https://instagram.com/yourname"
  },
  {
    name: "Facebook",
    url: "https://facebook.com/yourname"
  },
  {
    name: "Spotify",
    url: "https://open.spotify.com/user/yourname"
  },
  {
    name: "TikTok",
    url: "https://tiktok.com/@yourname"
  },
  {
    name: "YouTube",
    url: "https://youtube.com/@yourname"
  },
  {
    name: "Telegram",
    url: "https://t.me/yourname"
  },
  {
    name: "GitHub",
    url: "https://github.com/yourname"
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com/in/yourname"
  },
  {
    name: "X",
    url: "https://x.com/yourname"
  },
  {
    name: "Discord",
    url: "https://discord.com/users/yourname"
  },
  {
    name: "Twitch",
    url: "https://twitch.tv/yourname"
  },
  {
    name: "Website",
    url: "https://yourname.com"
  }
];

export function getRandomLinkPlaceholder(): ILinkPlaceholder {
  const index = Math.floor(Math.random() * LINK_PLACEHOLDERS.length);

  return LINK_PLACEHOLDERS[index];
}
