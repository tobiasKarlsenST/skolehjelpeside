const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const mime = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg"
};

const server = http.createServer((req, res) => {
  // --- Proxy route: /sheet?id=...&range=...&key=...
  if (req.url.startsWith("/sheet")) {
    const url = new URL(req.url, `http://${req.headers.host}`);
    const id = url.searchParams.get("id");
    const range = url.searchParams.get("range");
    const key = url.searchParams.get("key");

    const apiUrl =
      `https://sheets.googleapis.com/v4/spreadsheets/${id}/values/${range}?key=${key}`;

    https.get(apiUrl, apiRes => {
      let data = "";
      apiRes.on("data", chunk => data += chunk);
      apiRes.on("end", () => {
        res.writeHead(200, {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"   // no cors issues
        });
        res.end(data);
      });
    }).on("error", err => {
      res.writeHead(500);
      res.end("Error: " + err.message);
    });

    return;
  }

  // --- Static file server
  let filePath = "." + (req.url === "/" ? "/index.html" : req.url);
  const ext = path.extname(filePath);
  const type = mime[ext] || "text/plain";

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(404);
      res.end("Not found");
    } else {
      res.writeHead(200, { "Content-Type": type });
      res.end(content);
    }
  });
});

server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
