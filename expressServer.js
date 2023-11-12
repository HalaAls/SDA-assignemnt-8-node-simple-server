import express from "express";
import morgan from "morgan";
import "dotenv/config";

import productsRouter from "./routes/productRoute.js";

const app = express();
const port = process.env.PORT || 5000;

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(productsRouter);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running at http://127.0.0.1:${port}/`);
});
