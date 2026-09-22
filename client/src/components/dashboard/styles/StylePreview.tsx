import { CardLinksList } from "@/components/card/CardLinksList/CardLinksList";
import { IUserStyles } from "@/types/styles";
import { IUser } from "@/types/user";
import { buildCardStyle } from "@/utils/buildCardStyle";
import styles from "./StylePreview.module.scss";

interface StylePreviewProps {
  user: IUser;
  draftStyles: IUserStyles;
  previewImageOverride?: string;
}

export function StylePreview({ user, draftStyles, previewImageOverride }: StylePreviewProps) {
  const effectiveStyles: IUserStyles = previewImageOverride
    ? { ...draftStyles, background: { ...draftStyles.background, image: previewImageOverride } }
    : draftStyles;

  const pageStyle = buildCardStyle(effectiveStyles);

  return (
    <div className={styles.wrapper} style={pageStyle}>
      <div className={styles.card}>
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
