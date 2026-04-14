import { Schema, model, type InferSchemaType } from "mongoose";

const accountSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  balance: Number,
});

export type Account = InferSchemaType<typeof accountSchema>;

export const AccountModel = model<Account>("Account", accountSchema);
