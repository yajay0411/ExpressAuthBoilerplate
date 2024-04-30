import mongoose from "mongoose";

const userSchema = new mongoose.Schema<User>(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
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
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
