import fs from "fs/promises";

export const getAllProducts = async (req, res) => {
  const products = JSON.parse(await fs.readFile("products.json", "utf-8"));
  res.status(200).send({
    success: true,
    message: "all products are returned",
    data: products,
  });
};

export const getProductById = async (req, res) => {
  const id = req.params.id;
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
};

export const deleteProductById = async (req, res) => {
  const id = req.params.id;
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
};

export const craeteProduct = async (req, res) => {
  const body = req.body;
  const products = JSON.parse(await fs.readFile("products.json", "utf-8"));
  const newProduct = {
    id: new Date().getTime().toString(),
    name: body.name,
    description: body.description,
    price: body.price,
  };

  products.push(newProduct);
  await fs.writeFile("products.json", JSON.stringify(products));

  res.status(201).send({
    success: true,
    message: "new product is created",
    data: products,
  });
};

export const updateProductById = async (req, res) => {
  const id = req.params.id;
  const body = req.body;
  const products = JSON.parse(await fs.readFile("products.json", "utf-8"));
  const index = products.findIndex((product) => product.id === id);
  if (index == -1) {
    res.status(404).send({
      success: false,
      message: `product with the id ${id} is not found`,
    });
    return;
  }
  if (body.name) {
    products[index].name = body.name;
  }
  if (body.description) {
    products[index].description = body.description;
  }
  if (body.price) {
    products[index].price = body.price;
  }
  await fs.writeFile("products.json", JSON.stringify(products));

  res.status(200).send({
    success: true,
    message: `product with the id ${id} is updated`,
    data: products,
  });
};
