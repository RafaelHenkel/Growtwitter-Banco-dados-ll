import express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server is running on PORT: ${port}...`);
});
