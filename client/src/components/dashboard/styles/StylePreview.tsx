import { CardLinksList } from "@/components/card/CardLinksList/CardLinksList";
import { IUserStyles } from "@/types/styles";
import { IUser } from "@/types/user";
import { buildCardStyle } from "@/utils/buildCardStyle";
import styles from "./StylePreview.module.scss";

interface StylePreviewProps {
  user: IUser;
  draftStyles: IUserStyles;
}

export function StylePreview({ user, draftStyles }: StylePreviewProps) {
  const cardStyle = buildCardStyle(draftStyles);

  return (
    <div className={styles.wrapper}>
      <div className={styles.card} style={cardStyle}>
        {user.avatar && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.avatar} alt={user.username} className={styles.avatar} />
        )}
        <h3 className={styles.username}>{user.username}</h3>
        {user.bio && <p className={styles.bio}>{user.bio}</p>}
        <CardLinksList links={user.links} />
      </div>
    </div>
  );
}
