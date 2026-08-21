import type { IconType } from "react-icons";
import { FaGithub, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";
import { SiBluesky } from "react-icons/si";

export interface SocialLink {
  name: string;
  url: string;
  Icon: IconType;
}

export const socialLinks: SocialLink[] = [
  {
    name: "GitHub",
    url: "https://github.com/danielsinensky",
    Icon: FaGithub,
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/danielsinensky/",
    Icon: FaLinkedin,
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/danielsinensky/",
    Icon: FaInstagram,
  },
  {
    name: "YouTube",
    url: "https://www.youtube.com/@DanielSinensky",
    Icon: FaYoutube,
  },
  {
    name: "Bluesky",
    url: "https://bsky.app/profile/danielsinensky.bsky.social",
    Icon: SiBluesky,
  },
];
