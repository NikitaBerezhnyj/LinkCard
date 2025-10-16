import { IUser } from "@/types/IUser";
import styles from "@/styles/components/LinkItem.module.scss";
import { getLinkIcon, getNormalizedLink } from "@/utils/linkUtils";

interface LinkItemProps {
  link: IUser["links"][0];
  idx: number;
  linkStyle?: React.CSSProperties;
  linkHoverStyle?: React.CSSProperties;
}

export const LinkItem = ({ link, idx, linkStyle, linkHoverStyle }: LinkItemProps) => {
  const url = link.url.trim();
  const normalizedUrl = getNormalizedLink(url);
  return (
    <a
      key={idx}
      href={normalizedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.linkBlock}
      style={linkStyle}
      onMouseEnter={e => Object.assign(e.currentTarget.style, linkHoverStyle)}
      onMouseLeave={e => Object.assign(e.currentTarget.style, linkStyle)}
    >
      <span className={styles.linkTitle}>{link.title || link.url}</span>
      <span className={styles.linkIcon}>{getLinkIcon(url)}</span>
    </a>
  );
};
