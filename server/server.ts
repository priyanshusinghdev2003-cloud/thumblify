import express, { Request, Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDB } from "./db/index.ts";
import session from "express-session";
import MongoStore from "connect-mongo";
import authRoute from "./routes/authRoute.ts";
import thumbnailRoute from "./routes/thumbnailRoute.ts";
import userThubnailRoute from "./routes/UserThubnailRoute.ts";
import rateLimit from "express-rate-limit";

declare module "express-session" {
  interface SessionData {
    isLoggedIn: boolean;
    userId: string;
  }
}

dotenv.config();
connectToDB();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    message: "Too many requests, please try again later.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
const port = process.env.PORT || 3000;

// middleware

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "*",
      "http://localhost:3000",
      "http://localhost:5000",
    ],
    credentials: true,
  })
);
app.set("trust proxy", 1);
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    },
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI as string,
      collectionName: "sessions",
    }),
  })
);
app.use(limiter);
app.use(express.json());
app.use("/api/auth", authRoute);
app.use("/api/thumbnail", thumbnailRoute);
app.use("/api/user/thumbnails", userThubnailRoute);

app.get("/", (req: Request, res: Response) => {
  res.send("server is Live!");
});

app.listen(port, () =>
  console.log(`Server running on port http://localhost:${port}`)
);
