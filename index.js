import http from "http";
// const http = require("http");
const PORT = "8080";
let product = [
  { id: "1", name: "surface", description: "new tablet", price: 900 },
  { id: "2", name: "macbook", description: "apple macbook", price: 1200 },
];
const server = http.createServer((req, res) => {
  /* handle http requests */
  if (req.url === "/" && req.method === "GET") {
    try {
      res.writeHead(200, { "Content-Type": "applocation/json" });
      res.end(
        JSON.stringify({
          success: true,
          message: "Hello World",
        })
      );
    } catch (error) {
      res.end(
        JSON.stringify({
          success: false,
          message: error.message,
        })
      );
    }
  } else if (req.method === "POST" && req.url === "/") {
    try {
      let requestData = "";
      req.on("data", (chunk) => {
        requestData += chunk;
      });
      req.on("end", () => {
        console.log("Received POST request data:", requestData);
        res.writeHead(200, { "Content-Type": "text/plain" });
        res.end("New product is received and created.");
      });
    } catch (error) {
      res.end(error.message);
    }
  }
});
server.listen(PORT, () => {
  console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
