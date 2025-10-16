import { IUser } from "@/types/IUser";

export const getCardStyle = (s: IUser["styles"]) => ({
  ...(s.contentBackground && { backgroundColor: s.contentBackground }),
  ...(s.border && { border: `1px solid ${s.border}` }),
  ...(s.borderRadius && { borderRadius: s.borderRadius }),
  ...(s.text && { color: s.text }),
  ...(s.font && { fontFamily: s.font }),
  ...(s.fontSize && { fontSize: s.fontSize }),
  ...(s.fontWeight && { fontWeight: s.fontWeight }),
  ...(s.textAlign && { textAlign: s.textAlign as "center" | "right" | "left" }),
  ...(s.contentPadding && { padding: s.contentPadding }),
  ...(s.contentGap && { gap: s.contentGap })
});

export const getLinkStyle = (s: IUser["styles"]) => ({
  ...(s.buttonText && { color: s.buttonText }),
  ...(s.buttonBackground && { backgroundColor: s.buttonBackground }),
  ...(s.borderRadius && { borderRadius: s.borderRadius })
});

export const getLinkHoverStyle = (s: IUser["styles"]) => ({
  ...(s.buttonHoverBackground && { backgroundColor: s.buttonHoverBackground }),
  ...(s.buttonHoverText && { color: s.buttonHoverText })
});

export const getBackgroundStyle = (background: IUser["styles"]["background"]) => {
  if (!background) return {};
  switch (background.type) {
    case "color":
      return { backgroundColor: background.value.color };
    case "gradient": {
      const g = background.value.gradient;
      return { background: `linear-gradient(${g?.angle || "135deg"}, ${g?.start}, ${g?.end})` };
    }
    case "image": {
      const img = background.value.image;
      return {
        backgroundImage: `url(${img})`,
        backgroundPosition: background.value.position,
        backgroundSize: background.value.size,
        backgroundRepeat: background.value.repeat
      };
    }
    default:
      return {};
  }
};

export const getDynamicStyles = (s: IUser["styles"]) => ({
  textStyle: { ...(s.text && { color: s.text }) },
  qrButtonStyle: { color: s.text },
  qrButtonHoverStyle: { color: s.buttonHoverBackground },
  selectStyle: {
    ...(s.contentBackground && { backgroundColor: s.contentBackground }),
    ...(s.text && { color: s.text }),
    ...(s.borderRadius && { borderRadius: s.borderRadius }),
    ...(s.border && { border: `1px solid ${s.border}` }),
    ...(s.font && { fontFamily: s.font }),
    ...(s.fontSize && { fontSize: s.fontSize })
  }
});
