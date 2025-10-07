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
    text: string;
    button: string;
    contentBackground: string;
    border: string;
    background: {
      type: "color" | "gradient" | "image";
      value: {
        color?: string;
        gradient?: { start: string; end: string };
        image?: string;
      };
    };
  };
}

// TODO: Finalize styles parameters in the model
// styles: {
//   font: string;
//   fontSize: string;
//   fontWeight: string;
//   textAlign: "left" | "center" | "right";

//   text: string;        // Основний текст
//   linkText: string;    // Колір посилань
//   buttonText: string;
//   buttonBackground: string;
//   buttonHoverText: string;
//   buttonHoverBackground: string;

//   border: string;
//   borderRadius: string;

//   contentBackground: string;
//   contentPadding: string;
//   contentGap: string;

//   background: {
//     type: "color" | "gradient" | "image";
//     value: {
//       color?: string;
//       gradient?: { start: string; end: string; angle?: string };
//       image?: string;
//       position?: string;  // top, center, bottom
//       size?: string;      // cover, contain, auto
//       repeat?: string;    // no-repeat, repeat
//     };
//   };
// }

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
    text: { type: String, default: "#e0e0e0" },
    button: { type: String, default: "#2a2a2a" },
    contentBackground: { type: String, default: "#1f1f1f" },
    border: { type: String, default: "#dddddd" },
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
          end: { type: String, default: "#4a9bcf" }
        },
        image: { type: String, default: "" }
      }
    }
  }
});

export const User = mongoose.model<IUser>("User", userSchema);
