import crypto from "crypto";
import dotenv from "dotenv";

import path from "path";
dotenv.config();
const SERVER_URL = process.env.SERVER_URL || "s";

const algorithm = "aes-256-cbc";
const secretKey = crypto.randomBytes(32); // Change this to a fixed secret key for consistency
const iv = crypto.randomBytes(16); // Initialization vector
// const dbPromise = open({
//   filename: path.resolve(__dirname, "database.db"),
//   driver: sqlite3.Database,
// });

// Encrypt function
export const encrypt = (text: string): string => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return `${iv.toString("hex")}:${encrypted}`; // Store IV with the encrypted text
};

// Decrypt function
export const decrypt = (encryptedText: string): string => {
  const [ivHex, encrypted] = encryptedText.split(":");
  const decipher = crypto.createDecipheriv(
    algorithm,
    secretKey,
    Buffer.from(ivHex, "hex")
  );
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
};
export const generateRandomString = (length: number): string => {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
};
// dbPromise.then(async (db) => {
//   await db.exec(
//     "CREATE TABLE IF NOT EXISTS links (id TEXT PRIMARY KEY, url TEXT)"
//   );
// });

// export async function shortenUrl(url: string): Promise<string> {
//   const id = shortid.generate();
//   const db = await dbPromise;
//   await db.run("INSERT INTO links (id, url) VALUES (?, ?)", [id, url]);

//   return `${SERVER_URL}/${id}`;
// }
