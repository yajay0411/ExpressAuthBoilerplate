import { sign } from "jsonwebtoken";

const GenerateJwtToken = (
  user_id: string,
  secret: string,
  expires_in: string
) => {
  return sign({ sub: user_id }, secret, {
    expiresIn: expires_in,
    algorithm: "HS256",
  });
};

export default GenerateJwtToken;
