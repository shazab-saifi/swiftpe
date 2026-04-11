import { Schema, model, type InferSchemaType } from "mongoose";

const userSchema = new Schema({
  username: String,
  password: String,
  firstName: String,
  lastName: String,
});

export type User = InferSchemaType<typeof userSchema>;

export const UserModel = model("User", userSchema);
