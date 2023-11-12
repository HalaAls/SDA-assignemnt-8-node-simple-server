import { Router } from "express";
import {
  craeteProduct,
  deleteProductById,
  getAllProducts,
  getProductById,
  updateProductById,
} from "../controllers/productsController.js";

const productsRouter = Router();

productsRouter.get("/products", getAllProducts);
productsRouter.get("/products/:id", getProductById);
productsRouter.delete("/products/:id", deleteProductById);
productsRouter.post("/products", craeteProduct);
productsRouter.put("/products/:id", updateProductById);

export default productsRouter;
