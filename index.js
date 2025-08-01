const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan")
const connectDB = require("./src/config/db");
const userRouter = require("./src/routes/user.routes")

dotenv.config();
const app = express();
app.use(express.json())
app.use(morgan("dev"))

const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Welcome To My Farm App!");
});

app.use("/api/user", userRouter);

app.listen(PORT, () => {
    connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
