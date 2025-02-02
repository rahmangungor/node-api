import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET || "supersecretkey";

export const generateToken = (userId: number) => {
  return jwt.sign({ id: userId }, secret, { expiresIn: "1h" });
};

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, secret);
  } catch (error) {
    throw new Error("Invalid Token");
  }
};
