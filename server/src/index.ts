import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import deployContractRouter from "./routes/deployContract.routes";

const app = express();
const PORT = 8000;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use("/deploy", deployContractRouter);

app.listen(PORT, () => {
  console.log("server is listing on port:", PORT);
});
