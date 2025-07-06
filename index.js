import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import logger from "./utils/logger.js";
import nsvroute from "./routes/routensv.js";

dotenv.config();

const app = express();
const port = parseInt(process.env.WMS_PORT) || 6001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// const testing = async () => {
//   console.log("api called");
//   return
// };
// app.use(testing);

app.use("/nsv", nsvroute);

// 🛠 FIXED this line
app.use((req, res) => {
  logger.error("Unknown URL endpoint");
  res.status(404).send("ERROR 404 Page not found");
});

app.listen(port, () => {
  logger.info({ port }, `App listening on port`);
});

export default app;
