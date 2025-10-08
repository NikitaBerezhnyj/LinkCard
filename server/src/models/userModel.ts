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

    text: { type: String, default: "#f3f4f6" },
    linkText: { type: String, default: "#60a5fa" },
    buttonText: { type: String, default: "#f3f4f6" },
    buttonBackground: { type: String, default: "#181818" },
    buttonHoverText: { type: String, default: "#f3f4f6" },
    buttonHoverBackground: { type: String, default: "#60a5fa" },

    border: { type: String, default: "#2c2c2c" },
    borderRadius: { type: String, default: "10px" },

    contentBackground: { type: String, default: "#1e1e1e" },
    contentPadding: { type: String, default: "24px" },
    contentGap: { type: String, default: "16px" },

    background: {
      type: {
        type: String,
        enum: ["color", "gradient", "image"],
        default: "color"
      },
      value: {
        color: { type: String, default: "#181818" },
        gradient: {
          start: { type: String, default: "#1e1e1e" },
          end: { type: String, default: "#181818" },
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
