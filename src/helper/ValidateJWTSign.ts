import { verify } from "jsonwebtoken";

const VerifyJwtToken = (refresh_token: string, secret: string) => {
  return verify(refresh_token, secret);
};

export default VerifyJwtToken;
