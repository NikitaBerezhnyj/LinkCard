import { IUser } from "@/types/IUser";

export const lightTheme: IUser["styles"] = {
  background: {
    type: "gradient",
    value: {
      gradient: { start: "#fef3c7", end: "#fef9c3", angle: "135deg" },
      color: "#fef9c3",
      image: "",
      position: "center",
      size: "cover",
      repeat: "no-repeat"
    }
  },
  font: "Roboto",
  fontSize: "16px",
  fontWeight: "400",
  textAlign: "center",
  text: "#111827",
  linkText: "#2563eb",
  buttonText: "#ffffff",
  buttonBackground: "#3b82f6",
  buttonHoverText: "#ffffff",
  buttonHoverBackground: "#2563eb",
  border: "#d1d5db",
  borderRadius: "8px",
  contentBackground: "#ffffff",
  contentPadding: "20px",
  contentGap: "12px"
};

export const darkTheme: IUser["styles"] = {
  background: {
    type: "color",
    value: {
      color: "#121212",
      gradient: { start: "#1e1e1e", end: "#181818", angle: "135deg" },
      image: "",
      position: "center",
      size: "cover",
      repeat: "no-repeat"
    }
  },
  font: "Roboto",
  fontSize: "16px",
  fontWeight: "400",
  textAlign: "center",
  text: "#f3f4f6",
  linkText: "#60a5fa",
  buttonText: "#f3f4f6",
  buttonBackground: "#181818",
  buttonHoverText: "#f3f4f6",
  buttonHoverBackground: "#60a5fa",
  border: "#2c2c2c",
  borderRadius: "10px",
  contentBackground: "#1e1e1e",
  contentPadding: "24px",
  contentGap: "16px"
};

export const blueSky: IUser["styles"] = {
  background: {
    type: "gradient",
    value: {
      gradient: { start: "#dbeafe", end: "#93c5fd", angle: "145deg" },
      color: "#f0f9ff",
      image: "",
      position: "center",
      size: "cover",
      repeat: "no-repeat"
    }
  },
  font: "Inter",
  fontSize: "17px",
  fontWeight: "500",
  textAlign: "center",
  text: "#1e293b",
  linkText: "#1d4ed8",
  buttonText: "#ffffff",
  buttonBackground: "#3b82f6",
  buttonHoverText: "#ffffff",
  buttonHoverBackground: "#1e40af",
  border: "#93c5fd",
  borderRadius: "12px",
  contentBackground: "#e0f2fe",
  contentPadding: "22px",
  contentGap: "14px"
};

export const pinkMarshmallow: IUser["styles"] = {
  background: {
    type: "gradient",
    value: {
      gradient: { start: "#fbcfe8", end: "#f9a8d4", angle: "120deg" },
      color: "#fce7f3",
      image: "",
      position: "center",
      size: "cover",
      repeat: "no-repeat"
    }
  },
  font: "Shadows Into Light",
  fontSize: "18px",
  fontWeight: "400",
  textAlign: "center",
  text: "#3b185f",
  linkText: "#db2777",
  buttonText: "#ffffff",
  buttonBackground: "#ec4899",
  buttonHoverText: "#ffffff",
  buttonHoverBackground: "#be185d",
  border: "#db2777",
  borderRadius: "16px",
  contentBackground: "#fce7f3",
  contentPadding: "24px",
  contentGap: "16px"
};

export const warmGradient: IUser["styles"] = {
  background: {
    type: "gradient",
    value: {
      gradient: { start: "#fed7aa", end: "#fca5a5", angle: "140deg" },
      color: "#fff7ed",
      image: "",
      position: "center",
      size: "cover",
      repeat: "no-repeat"
    }
  },
  font: "Raleway",
  fontSize: "16px",
  fontWeight: "500",
  textAlign: "center",
  text: "#78350f",
  linkText: "#b45309",
  buttonText: "#ffffff",
  buttonBackground: "#f97316",
  buttonHoverText: "#ffffff",
  buttonHoverBackground: "#c2410c",
  border: "#d97706",
  borderRadius: "10px",
  contentBackground: "#ffedd5",
  contentPadding: "20px",
  contentGap: "14px"
};

export const mintFresh: IUser["styles"] = {
  background: {
    type: "gradient",
    value: {
      gradient: { start: "#bbf7d0", end: "#86efac", angle: "150deg" },
      color: "#d1fae5",
      image: "",
      position: "center",
      size: "cover",
      repeat: "no-repeat"
    }
  },
  font: "Open Sans",
  fontSize: "16px",
  fontWeight: "600",
  textAlign: "center",
  text: "#064e3b",
  linkText: "#059669",
  buttonText: "#ffffff",
  buttonBackground: "#10b981",
  buttonHoverText: "#ffffff",
  buttonHoverBackground: "#047857",
  border: "#065f46",
  borderRadius: "12px",
  contentBackground: "#d1fae5",
  contentPadding: "22px",
  contentGap: "14px"
};

export const dracula: IUser["styles"] = {
  background: {
    type: "gradient",
    value: {
      gradient: { start: "#282a36", end: "#44475a", angle: "135deg" },
      color: "#282a36",
      image: "",
      position: "center",
      size: "cover",
      repeat: "no-repeat"
    }
  },
  font: "Fira Code",
  fontSize: "15px",
  fontWeight: "400",
  textAlign: "center",
  text: "#f8f8f2",
  linkText: "#8be9fd",
  buttonText: "#f8f8f2",
  buttonBackground: "#6272a4",
  buttonHoverText: "#f8f8f2",
  buttonHoverBackground: "#50fa7b",
  border: "#44475a",
  borderRadius: "8px",
  contentBackground: "#1e1e2f",
  contentPadding: "20px",
  contentGap: "12px"
};

export const solarizedLight: IUser["styles"] = {
  background: {
    type: "gradient",
    value: {
      gradient: { start: "#fdf6e3", end: "#eee8d5", angle: "145deg" },
      color: "#fdf6e3",
      image: "",
      position: "center",
      size: "cover",
      repeat: "no-repeat"
    }
  },
  font: "Montserrat",
  fontSize: "16px",
  fontWeight: "500",
  textAlign: "center",
  text: "#586e75",
  linkText: "#268bd2",
  buttonText: "#ffffff",
  buttonBackground: "#2aa198",
  buttonHoverText: "#ffffff",
  buttonHoverBackground: "#238b8b",
  border: "#586e75",
  borderRadius: "10px",
  contentBackground: "#fdf6e3",
  contentPadding: "20px",
  contentGap: "14px"
};

export const sunsetGlow: IUser["styles"] = {
  background: {
    type: "gradient",
    value: {
      gradient: { start: "#ffedd5", end: "#fecaca", angle: "130deg" },
      color: "#fff1f0",
      image: "",
      position: "center",
      size: "cover",
      repeat: "no-repeat"
    }
  },
  font: "Audiowide",
  fontSize: "17px",
  fontWeight: "400",
  textAlign: "center",
  text: "#7f1d1d",
  linkText: "#b91c1c",
  buttonText: "#ffffff",
  buttonBackground: "#ef4444",
  buttonHoverText: "#ffffff",
  buttonHoverBackground: "#b91c1c",
  border: "#991b1b",
  borderRadius: "12px",
  contentBackground: "#fff1f0",
  contentPadding: "22px",
  contentGap: "14px"
};

export const oceanBreeze: IUser["styles"] = {
  background: {
    type: "gradient",
    value: {
      gradient: { start: "#bae6fd", end: "#7dd3fc", angle: "135deg" },
      color: "#e0f2fe",
      image: "",
      position: "center",
      size: "cover",
      repeat: "no-repeat"
    }
  },
  font: "Delius",
  fontSize: "16px",
  fontWeight: "400",
  textAlign: "center",
  text: "#1e3a8a",
  linkText: "#3b82f6",
  buttonText: "#ffffff",
  buttonBackground: "#2563eb",
  buttonHoverText: "#ffffff",
  buttonHoverBackground: "#1e40af",
  border: "#1e40af",
  borderRadius: "10px",
  contentBackground: "#e0f2fe",
  contentPadding: "20px",
  contentGap: "14px"
};
