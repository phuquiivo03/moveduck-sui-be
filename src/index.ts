import express from "express";
import { Request, Response } from "express-serve-static-core";
import router from "./routes/index";
import dotenv from "dotenv";
import cors from "cors";
import './db/mongodb_connection'
// import { getAllData } from "./pinata";

dotenv.config();
const app = express();
app.use(
  cors({
    credentials: true,
    origin: ["https://x.com", "http://localhost:3000", "https://moveduck.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    
  })
);
const PORT = process.env.PORT || 3000;
app.use(express.json());
app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Moveduck-sui with Express!!");
});

// config for short link
// const dbPromise = open({
//   filename: path.resolve(__dirname, "database.db"),
//   driver: sqlite3.Database,
// });
// @ts-ignore

// dbPromise.then(async (db) => {
//   await db.exec(
//     "CREATE TABLE IF NOT EXISTS links (id TEXT PRIMARY KEY, url TEXT)"
//   );
// });

// app.get("/:id", async (req: Request, res: Response) => {
//   const { id } = req.params;
//   const db = await dbPromise;
//   const result = await db.get("SELECT url FROM links WHERE id = ?", [id]);

//   if (!result) res.status(404).json({ error: "Link not found" });

//   res.redirect(result.url);
// });

app.use("/api", router);

// app.get('/a' , async (req: Request, res: Response) => {
//   const result = await getAllData();
//   res.send(result)
// })


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



