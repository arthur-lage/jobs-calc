const express = require("express");
const server = express();
const routes = require("./routes");
const path = require("path");

// usando a template engine

server.set("view engine", "ejs")

server.set('views', path.join(__dirname, 'views'));

// ativar o req.body

server.use(express.urlencoded({ extended: true }));

// usar a pasta public

server.use(express.static("public"));

// usar as rotas do arquivo rotas

server.use(routes);

// fazer o servidor escutar a porta 3000

server.listen(3000, () =>
  console.log("Servidor rodando rodando na porta 3000")
);
