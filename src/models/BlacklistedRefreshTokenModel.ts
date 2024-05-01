import mongoose from "mongoose";

const BlacklistedRefreshTokenSchema = new mongoose.Schema({
  refresh_token: {
    type: String,
    required: true,
  },
  expiresAt: {
    type: Date,
    expires: "1h", // Set the expiration time for the document
    default: Date.now, // Set the default value to the current date and time
  },
});

export default mongoose.model(
  "BlacklistedRefreshToken",
  BlacklistedRefreshTokenSchema
);
