import styles from "./AvatarPlaceholder.module.scss";

interface AvatarPlaceholderProps {
  username: string;
  size?: number;
  className?: string;
}

export function AvatarPlaceholder({ username, size = 84, className }: AvatarPlaceholderProps) {
  const initials = username.slice(0, 2).toUpperCase();

  return (
    <div
      className={`${styles.placeholder} ${className ?? ""}`}
      style={{ width: size, height: size, fontSize: size * 0.32 }}
    >
      {initials}
    </div>
  );
}
