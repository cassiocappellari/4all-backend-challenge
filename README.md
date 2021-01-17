<h1 align="center">API REST de Sistema de Locação de Filmes</h1>

## 🤖 Technologies

- [Node.js](https://nodejs.org/pt-br/docs/)
- [TypeScript](https://www.typescriptlang.org/docs/)
- [MySQL](https://dev.mysql.com/doc/)
- [Redis](https://redis.io/documentation)
- [TypeORM](https://typeorm.io/)
- [Express](https://expressjs.com/pt-br/guide/routing.html)
- [JWT-Redis](https://www.npmjs.com/package/jwt-redis)
- [Bcrypt](https://www.npmjs.com/package/bcrypt)

## 🚀 Features

- Criação de usuários
- Logon e Logoff de usuários
- Cadastro de filmes
- Listagem de filmes disponíveis
- Pesquisa de filmes pelo título
- Locação de filmes
- Devolução de filmes

## ⚙ How to Run

```bash
# Clone o repositório

$ git clone https://github.com/cassiocappellari/4all-backend-challenge.git

# Entre na pasta

$ cd 4all-backend-challenge

# Instale as dependências

$ npm install

# Inicie o projeto

$ npm start

```

## 🗄️ Database

- **Redis**

```bash
# Atualize seu cache de pacotes do Linux

$ sudo apt update

# Instale o Redis

$ sudo apt install redis

# Instale o Redis-Server

$ sudo apt install redis-server
```

- **MySQL**

Tabela de usuários

```
CREATE TABLE users (
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);
```

Tabela de filmes

```
CREATE TABLE movies (
  id INTEGER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  director VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL
);
```

Após clonar o projeto, rodar os comandos e instalar as dependências junto com os bancos de dados, é possível testar o sistema localmente através do aplicativo [Insomnia](https://insomnia.rest/). Basta clicar no botão abaixo:

[![Run in Insomnia}](https://insomnia.rest/images/run.svg)](https://insomnia.rest/run/?label=4all-backend-challenge&uri=https%3A%2F%2Fraw.githubusercontent.com%2Fcassiocappellari%2F4all-backend-challenge%2Fmaster%2FInsomnia_2021-01-17)

## 🗺️ Routes

🔓 **Públicas**

- Nas rotas abaixo não há necessidade de token para acessá-las.

|rota|Método HTTP|parâmetros|descrição
|:---|:---:|:---:|:---:
|`/user/signup`|POST|Request body com `name`, `email` and `password`|Cadastra o usuário no banco de dados com `password` encriptado e retorna token de acesso à rotas privadas
|`/user/logon`|POST|Request body com `email` and `password`|Loga o usuário no sistema e retorna token de acesso à rotas privadas

**Exemplos de requisições**

- **POST:** `/user/signup`

Entrada:
```json
{
	"name": "Cássio Cappellari",
	"email": "cassiocappellari@gmail.com",
	"password": "123456"
}
```

Saída:
```json
{
  "userSignUpStatus": "user successfully created",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwianRpIjoxLCJpYXQiOjE2MTA5MTQ5NTYsImV4cCI6MTYxMDkxODU1Nn0.gh-qfLHAvgg7g2nBjJXGHgtq_P6sx26FxUaU4LDquus"
}
```
- **POST:** `/user/logon`

Entrada:
```json
{
	"email": "cassiocappellari@gmail.com",
	"password": "123456"
}
```

Saída:
```json
{
  "userAuthenticationStatus": "user successfuly logged in",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsImp0aSI6MjAsImlhdCI6MTYxMDkxMzAyNSwiZXhwIjoxNjEwOTE2NjI1fQ.8XJjKqgDThgEHsY5nr92C1WGpjhbk57vnL7SCrtLAPM"
}
```

🔐 **Privadas**

- As rotas abaixo somente podem ser acessadas mediante `JWT token` validado
- O token de acesso tem duração de 60 minutos

|rota|Método HTTP|parâmetros|descrição
|:---|:---:|:---:|:---:
|`/user/logoff`|GET|Request header authorization com `Bearer` + `JWT token`|Invalida o token de acesso do usuário
|`/movie/create`|POST|Request body com `title`, `director` and `quantity`|Cadastra um novo filme no banco de dados
|`/movie/available`|GET|-|Lista todos os filmes no banco de dados disponíveis para aluguel
|`/movie/filter`|GET|Query parameter com `title` + nome do filme|Retorna o filme de acordo com o título desejado
|`/movie/rent/:id`|PUT|Query parameter com `id` do filme desejado|Aluga o filme caso ele esteja disponível
|`/movie/return/:id`|PUT|Query parameter com `id` do filme devolvido|Devolve o filme alugado

**Exemplos de requisições**

- **GET:** `/user/logoff`
Entrada:
```
{
    Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsImp0aSI6MjAsImlhdCI6MTYxMDkxMzAyNSwiZXhwIjoxNjEwOTE2NjI1fQ.8XJjKqgDThgEHsY5nr92C1WGpjhbk57vnL7SCrtLAPM
}
```
Saída:
```json
{
  "userTokenStatus": "user successfuly logged out"
}
```

- **POST:** `/movie/create`
Entrada:
```json
{
	"title": "Gangues de Nova York",
	"director": "Martin Scorsese",
	"quantity": 4
}
```
Saída:
```json
{
  "createMovieStatus": "movie successfully created"
}
```

- **GET:** `/movie/available`

A rota de listar filmes disponíveis não apresenta aqueles cuja quantidade é igual a 0.

```
Saída:
```json
[
  {
    "id": 1,
    "title": "Jurassic Park",
    "director": "Steven Spielberg",
    "quantity": 2
  },
  {
    "id": 2,
    "title": "Guerra dos Mundos",
    "director": "Steven Spielberg",
    "quantity": 3
  },
  {
    "id": 3,
    "title": "Pulp Fiction",
    "director": "Quentin Tarantino",
    "quantity": 3
  },
  {
    "id": 4,
    "title": "Era uma Vez em Hollywood",
    "director": "Quentin Tarantino",
    "quantity": 3
  },
  {
    "id": 5,
    "title": "O Lobo de Wall Street",
    "director": "Martin Scorsese",
    "quantity": 2
  },
  {
    "id": 6,
    "title": "Gangues de Nova York",
    "director": "Martin Scorsese",
    "quantity": 4
  }
]
```

- **GET:** `/movie/filter`
Entrada:
```
http://localhost:3000/movie/filter?title=Jurassic%20Park
```
Saída:
```json
[
  {
    "id": 1,
    "title": "Jurassic Park",
    "director": "Steven Spielberg",
    "quantity": 2
  }
]
```

- **PUT:** `/movie/rent/:id`

A rota de alugar filme subtrai 1 da quantidade do filme.

Entrada:
```
http://localhost:3000/movie/rent/1
```
Saída:
```json
{
  "rentMovieStatus": "movie rented successfuly"
}
```

- **PUT:** `/movie/return/:id`

A rota de devolver filme soma 1 da quantidade do filme.

Entrada:
```
http://localhost:3000/movie/return/1
```
Saída:
```json
{
  "returnMovieStatus": "movie returned successfuly"
}
```

## 👨‍🚀 Author

**Cássio Cappellari**

- GitHub: [@cassiocappellari](https://github.com/cassiocappellari)
- LinkedIn: [@cassiocappellari](https://www.linkedin.com/in/cassiocappellari/)

---

Developed with 💚 by Cássio Cappellari!