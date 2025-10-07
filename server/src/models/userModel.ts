import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  links: { title: string; url: string }[];
  avatar: string;
  bio: string;
  createdAt: Date;
  styles: {
    font: string;
    fontSize: string;
    fontWeight: string;
    textAlign: "left" | "center" | "right";

    text: string;
    linkText: string;
    buttonText: string;
    buttonBackground: string;
    buttonHoverText: string;
    buttonHoverBackground: string;

    border: string;
    borderRadius: string;

    contentBackground: string;
    contentPadding: string;
    contentGap: string;

    background: {
      type: "color" | "gradient" | "image";
      value: {
        color?: string;
        gradient?: { start: string; end: string; angle?: string };
        image?: string;
        position?: string;
        size?: string;
        repeat?: string;
      };
    };
  };
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true },
  links: [{ title: String, url: String }],
  avatar: { type: String, default: "" },
  bio: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },

  styles: {
    font: { type: String, default: "Roboto" },
    fontSize: { type: String, default: "16px" },
    fontWeight: { type: String, default: "400" },
    textAlign: {
      type: String,
      enum: ["left", "center", "right"],
      default: "center"
    },

    text: { type: String, default: "#e0e0e0" },
    linkText: { type: String, default: "#4aa3df" },
    buttonText: { type: String, default: "#ffffff" },
    buttonBackground: { type: String, default: "#2a2a2a" },
    buttonHoverText: { type: String, default: "#ffffff" },
    buttonHoverBackground: { type: String, default: "#4a9bcf" },

    border: { type: String, default: "#dddddd" },
    borderRadius: { type: String, default: "8px" },

    contentBackground: { type: String, default: "#1f1f1f" },
    contentPadding: { type: String, default: "20px" },
    contentGap: { type: String, default: "12px" },

    background: {
      type: {
        type: String,
        enum: ["color", "gradient", "image"],
        default: "color"
      },
      value: {
        color: { type: String, default: "#121212" },
        gradient: {
          start: { type: String, default: "#6ab6e2" },
          end: { type: String, default: "#4a9bcf" },
          angle: { type: String, default: "135deg" }
        },
        image: { type: String, default: "" },
        position: { type: String, default: "center" },
        size: { type: String, default: "cover" },
        repeat: { type: String, default: "no-repeat" }
      }
    }
  }
});

export const User = mongoose.model<IUser>("User", userSchema);
