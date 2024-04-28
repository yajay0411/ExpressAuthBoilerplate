import mongoose from "mongoose";

const userSchema = new mongoose.Schema<User>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<User>("User", userSchema);

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
}
