import express, { Express } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { server, app } from "./socket/socket";

dotenv.config();

const port = process.env.PORT;

app.use("/upload", express.static("./upload"));
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use(cors());

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  })
);

// routes
import userRoutes from "./routes/userRoutes";
import postRoutes from "./routes/postRoutes";
import commentRoutes from "./routes/commentRoutes";
import savedRoute from "./routes/savedRoute";
import notificationRoutes from "./routes/notificationRoutes";
import googleRoutes from "./routes/googleRoutes";
import authhorizationRoute from "./routes/authorizationRoute";
import chatRoutes from "./routes/chatRoutes";
import storyRoutes from "./routes/storyRoutes";

app.use("/auth", googleRoutes);
app.use("/user", userRoutes);
app.use("/comments", commentRoutes);
app.use("/notifications", notificationRoutes);
app.use("/saved", savedRoute);
app.use("/posts", postRoutes);
app.use("/authorization", authhorizationRoute);
app.use("/chat", chatRoutes);
app.use("/story", storyRoutes);

server.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
