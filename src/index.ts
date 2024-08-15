import express from "express";
import * as dotenv from "dotenv";
import userRoutes from "./routes/users.routes";
import loginRoutes from "./routes/login.routes";
import tweetsRoutes from "./routes/tweets.routes";
import likesRoutes from "./routes/likes.routes";

dotenv.config();

const app = express();
app.use(express.json());

app.use("/users", userRoutes());
app.use("/login", loginRoutes());
app.use("/tweets", tweetsRoutes());
app.use("/likes", likesRoutes());

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}...`);
});
