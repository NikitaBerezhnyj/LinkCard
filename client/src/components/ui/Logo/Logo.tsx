import Link from "next/link";
import styles from "./Logo.module.scss";

interface LogoProps {
  accentColor?: string;
}

interface LogoStyle extends React.CSSProperties {
  "--logo-accent-color"?: string;
}

export function Logo({ accentColor }: LogoProps) {
  const style: LogoStyle | undefined = accentColor
    ? { "--logo-accent-color": accentColor }
    : undefined;

  return (
    <Link href="/" className={styles.logo} style={style}>
      Link<span className={styles.accent}>Card</span>
    </Link>
  );
}
