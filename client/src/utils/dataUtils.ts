import type { IUser } from "@/types/IUser";
import { formatUnitValue } from "./styleFormatter";

export const getChangedFields = (
  original: Record<string, unknown> | null | undefined,
  current: Record<string, unknown>
): Record<string, unknown> | undefined => {
  if (!original || typeof original !== "object" || Array.isArray(original)) return current;

  const changes: Record<string, unknown> = {};
  const isDifferent = (orig: unknown, curr: unknown): boolean => {
    if (Array.isArray(curr)) return JSON.stringify(orig) !== JSON.stringify(curr);
    if (typeof curr === "object" && curr !== null) {
      const nested = getChangedFields(
        orig as Record<string, unknown>,
        curr as Record<string, unknown>
      );
      return !!nested && Object.keys(nested).length > 0;
    }
    return orig !== curr;
  };

  for (const key in current) {
    if (!Object.prototype.hasOwnProperty.call(current, key)) continue;
    if (isDifferent(original[key], current[key])) {
      changes[key] =
        typeof current[key] === "object" && current[key] !== null && !Array.isArray(current[key])
          ? getChangedFields(
              original[key] as Record<string, unknown>,
              current[key] as Record<string, unknown>
            )
          : current[key];
    }
  }
  return Object.keys(changes).length > 0 ? changes : undefined;
};

export const prepareCurrentData = (
  userStyles: IUser["styles"],
  username: string,
  email: string,
  bio: string,
  links: { title: string; url: string }[],
  avatarUrl: string | null,
  backgroundUrl: string | null,
  originalUserData: IUser | null
): Partial<IUser> => {
  const formattedBackground = { ...userStyles.background.value };
  if (backgroundUrl !== userStyles.background.value.image) {
    formattedBackground.image = backgroundUrl ?? undefined;
  }

  const formattedStyles = {
    ...userStyles,
    fontSize: formatUnitValue(userStyles.fontSize, "px"),
    borderRadius: formatUnitValue(userStyles.borderRadius, "px"),
    contentPadding: formatUnitValue(userStyles.contentPadding, "px"),
    contentGap: formatUnitValue(userStyles.contentGap, "px")
  };

  const currentData: Partial<IUser> = { username, email, bio, links, styles: formattedStyles };
  if (avatarUrl && avatarUrl !== originalUserData?.avatar) {
    currentData.avatar = avatarUrl;
  }

  return currentData;
};
