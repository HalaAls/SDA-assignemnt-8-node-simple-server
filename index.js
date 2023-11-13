import http from "http";
import fs from "fs/promises";
import { parse } from "querystring";

const PORT = "8080";

const errorHandler = (res, statusCode, message) => {
  res.writeHead(statusCode, { "Content-Type": "application/json" });
  res.end(
    JSON.stringify({
      message: message,
    })
  );
};

const server = http.createServer(async (req, res) => {
  if (req.url === "/" && req.method === "GET") {
    try {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "Hello World",
        })
      );
    } catch (error) {
      errorHandler(res, 500, error.message);
    }
  } else if (req.url === "/products" && req.method === "GET") {
    try {
      const products = JSON.parse(await fs.readFile("products.json", "utf-8"));
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "successfuly get products list",
          products: products,
        })
      );
    } catch (error) {
      errorHandler(res, 500, error.message);
    }
  } else if (req.url === "/" && req.method === "POST") {
    try {
      const products = JSON.parse(await fs.readFile("products.json", "utf-8"));
      let requestData = "";
      req.on("data", (chunk) => {
        requestData += chunk;
      });

      req.on("end", () => {
        const data = parse(requestData);
        const newProduct = {
          id: new Date().getTime().toString(),
          name: data.name,
          description: data.description,
          price: data.price,
        };

        products.push(newProduct);

        console.log("Received POST request data:");
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "New product is received and created.",
            products: products,
          })
        );
      });
    } catch (error) {
      res.end(error.message);
    }
  } else if (req.url === "/products" && req.method === "POST") {
    try {
      let requestData = "";
      req.on("data", (chunk) => {
        requestData += chunk;
      });

      req.on("end", async () => {
        const data = parse(requestData);
        const newProduct = {
          id: new Date().getTime().toString(),
          name: data.name,
          description: data.description,
          price: data.price,
        };

        const products = JSON.parse(
          await fs.readFile("products.json", "utf-8")
        );
        products.push(newProduct);
        await fs.writeFile("products.json", JSON.stringify(products));

        console.log("Received POST request data:");
        res.writeHead(201, { "Content-Type": "application/json" });
        res.end(
          JSON.stringify({
            message: "New product is received and created.",
            products: products,
          })
        );
      });
    } catch (error) {
      res.end(error.message);
    }
  } else if (req.url.match(/\/products\/([0-9]+)/) && req.method === "GET") {
    try {
      const products = JSON.parse(await fs.readFile("products.json", "utf-8"));
      const productId = req.url.split("/")[2];
      const product = products.find((product) => product.id === productId);
      if (!product) {
        errorHandler(res, 404, "Product not Found");
        return;
      }
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "successfuly get product by id",
          products: product,
        })
      );
    } catch (error) {
      errorHandler(res, 500, error.message);
    }
  } else if (req.url.match(/\/products\/([0-9]+)/) && req.method === "DELETE") {
    try {
      const products = JSON.parse(await fs.readFile("products.json", "utf-8"));
      const productId = req.url.split("/")[2];
      const product = products.find((product) => product.id === productId);
      if (!product) {
        errorHandler(res, 404, "Product not Found");
        return;
      }
      const filteredProducts = products.filter(
        (product) => product.id !== productId
      );
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "successfuly deleted product by id",
          products: filteredProducts,
        })
      );
    } catch (error) {
      errorHandler(res, 500, error.message);
    }
  } else if (req.url.match(/\/products\/([0-9]+)/) && req.method === "PUT") {
    const productId = req.url.split("/")[2];
    try {
      const products = JSON.parse(await fs.readFile("products.json", "utf-8"));
      const index = products.findIndex((product) => product.id === productId);
      if (index == -1) {
        errorHandler(res, 404, "Product not Found");
        return;
      }

      let requestData = "";
      req.on("data", (chunk) => {
        requestData += chunk;
      });
      req.on("end", () => {
        const { name, description, price } = parse(requestData);
        products[index].name = name ?? products[index].name;
        products[index].description =
          description ?? products[index].description;
        products[index].price = price ?? products[index].price;
      });
      await fs.writeFile("products.json", JSON.stringify(products));
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(
        JSON.stringify({
          message: "successfuly updated product by id",
          product: products[index],
        })
      );
    } catch (error) {
      errorHandler(res, 500, error.message);
    }
  }
});

server.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
