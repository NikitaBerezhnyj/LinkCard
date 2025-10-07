import mongoose, { Document, Schema } from "mongoose";

interface IResetToken extends Document {
  token: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const resetTokenSchema: Schema<IResetToken> = new Schema({
  token: { type: String, required: true },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  createdAt: { type: Date, default: Date.now, expires: 3600 }
});

const ResetToken = mongoose.model<IResetToken>("ResetToken", resetTokenSchema);

export { ResetToken };
