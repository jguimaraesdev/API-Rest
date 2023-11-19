const express = require('express');
const app = express();
const port = 3000;

// Middleware para permitir o uso de JSON no corpo das requisições
app.use(express.json());

// Rota de teste para verificar se a API está no ar
app.get('/status', (req, res) => {
     res.json({ message: 'API is up and running' });
});

// Rota para receber dados de um cliente e imprimir no console
app.post('/client-data', (req, res) => {
     console.log('Dados do Cliente:', req.body);
     res.json({ message: 'Dados do cliente recebidos com sucesso' });
});
// Rota para receber dados de um cliente e autorizar se a idade for maior que 18 anos
app.post('/authorize', (req, res) => {
     const { name, age } = req.body;

     if (age > 18) {
          res.json({ message: 'Autorizado' });
     } else {
          res.status(401).json({ message: 'Não autorizado' });
     }
 });

app.listen(port, () => {
     console.log(`Servidor rodando na porta ${port}`);
});


//----------------------------------------------------------------------------------//
//APP AYTHENTIC USERS
const jwt = require("jsonwebtoken");

// Objeto de usuário fictício para demonstração
const users = [
     
     { id: 2, username: "jane", password: "password" },
     { id: 3, username: "jhonny", password: "password" },
];

// Chave secreta para assinar e verificar JWTs
const secretKey = "minhachaveprivada";

// Endpoint de login
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  // Encontrar o usuário pelo nome de usuário e senha
  const user = users.find(
    (u) => u.username === username && u.password === password
  );

  if (user) {
    // Criar um token JWT com o ID do usuário como payload
    const token = jwt.sign({ userId: user.id }, secretKey);

    // Enviar o token de volta para o cliente
    res.json({ token });
  } else {
    // Enviar uma resposta de erro se o usuário não for encontrado
    res.status(401).json({ message: "Nome de usuário ou senha inválidos" });
  }
});

// Endpoint protegido
app.get("/perfil", (req, res) => {
  // Obter o cabeçalho de autorização da solicitação
  const authHeader = req.headers.authorization;

  if (authHeader) {
    // Extrair o token JWT do cabeçalho de autorização
    const token = authHeader.split(" ")[1];

    try {
      // Verificar o token JWT com a chave secreta
      const decodedToken = jwt.verify(token, secretKey);

      // Obter o ID do usuário do token decodificado
      const userId = decodedToken.userId;

      // Encontrar o usuário pelo ID
      const user = users.find((u) => u.id === userId);

      // Enviar o objeto de usuário de volta para o cliente
      res.json({ user });
    } catch (error) {
      // Enviar uma resposta de erro se o token for inválido
      res.status(401).json({ message: "Token inválido" });
    }
  } else {
    // Enviar uma resposta de erro se o cabeçalho de autorização não estiver presente
    res.status(401).json({ message: "Não autorizado" });
  }
});

