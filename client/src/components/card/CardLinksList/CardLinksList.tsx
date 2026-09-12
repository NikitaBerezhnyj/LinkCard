import { IUserLink } from "@/types/user";
import { getLinkIcon } from "@/utils/getLinkIcon";
import styles from "./CardLinksList.module.scss";

export function CardLinksList({ links }: { links: IUserLink[] }) {
  if (!links.length) return null;

  const sorted = [...links].sort((a, b) => a.order - b.order);

  return (
    <ul className={styles.list}>
      {sorted.map(link => (
        <li key={link.id}>
          <a href={link.url} target="_blank" rel="noreferrer noopener" className={styles.link}>
            <span className={styles.icon}>{getLinkIcon(link.url)}</span>
            <span className={styles.title}>{link.title}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}
