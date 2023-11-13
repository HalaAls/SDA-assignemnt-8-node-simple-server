import fs from "fs/promises";

export const getAllProducts = async (req, res) => {
  try {
    const products = JSON.parse(await fs.readFile("products.json", "utf-8"));
    res.status(200).send({
      success: true,
      message: "all products are returned",
      data: products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `error getting the products: ${error.message}`,
    });
  }
};

export const getProductById = async (req, res) => {
  const id = req.params.id;

  try {
    const products = JSON.parse(await fs.readFile("products.json", "utf-8"));
    const product = products.find((product) => product.id === id);
    if (!product) {
      res.status(404).send({
        success: false,
        message: `product with the id ${id} is not found`,
      });
      return;
    }
    res.status(200).send({
      success: true,
      message: `product with the id ${id} is returned`,
      data: product,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `error getting the product: ${error.message}`,
    });
  }
};

export const deleteProductById = async (req, res) => {
  const id = req.params.id;
  try {
    let products = JSON.parse(await fs.readFile("products.json", "utf-8"));
    const product = products.find((product) => product.id === id);
    if (!product) {
      res.status(404).send({
        success: false,
        message: `product with the id ${id} is not found`,
      });
      return;
    }
    const filteredProducts = products.filter((product) => product.id !== id);
    await fs.writeFile("products.json", JSON.stringify(filteredProducts));
    res.status(200).send({
      success: true,
      message: `product with the id ${id} is deleted`,
      data: filteredProducts,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `error deleting product: ${error.message}`,
    });
  }
};

export const createProduct = async (req, res) => {
  const { name, description, price } = req.body;

  try {
    const products = JSON.parse(await fs.readFile("products.json", "utf-8"));
    const newProduct = {
      id: new Date().getTime().toString(),
      name: name,
      description: description,
      price: price,
    };

    products.push(newProduct);
    await fs.writeFile("products.json", JSON.stringify(products));
    res.status(201).send({
      success: true,
      message: "new product is created",
      data: products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `error creating new product: ${error.message}`,
    });
  }
};

export const updateProductById = async (req, res) => {
  try {
    const id = req.params.id;
    const { name, description, price } = req.body;
    const products = JSON.parse(await fs.readFile("products.json", "utf-8"));
    const index = products.findIndex((product) => product.id === id);
    if (index == -1) {
      res.status(404).send({
        success: false,
        message: `product with the id ${id} is not found`,
      });
      return;
    }
    products[index].name = name ?? products[index].name;
    products[index].description = description ?? products[index].description;
    products[index].price = price ?? products[index].price;

    await fs.writeFile("products.json", JSON.stringify(products));
    res.status(200).send({
      success: true,
      message: `product with the id ${id} is updated`,
      data: products,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: `error updating product: ${error.message}`,
    });
  }
};
