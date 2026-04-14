import { Schema, model, type InferSchemaType } from "mongoose";

const accountSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  balance: { type: Number, required: true },
});

export type Account = InferSchemaType<typeof accountSchema>;

export const AccountModel = model<Account>("Account", accountSchema);
