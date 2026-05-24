# Pizzaria API - Backend

API REST desenvolvida com **Node.js**, **Express** e **Prisma** para gerenciar uma aplicação de delivery de pizzas. A API implementa autenticação via JWT, controle de acesso baseado em roles (usuário comum e admin) e gerenciamento de pedidos e usuários.

## 📋 Índice

- [Arquitetura](#arquitetura)
- [Tecnologias](#tecnologias)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Configuração](#configuração)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Banco de Dados](#banco-de-dados)
- [Autenticação e Autorização](#autenticação-e-autorização)
- [Endpoints da API](#endpoints-da-api)
- [Fluxo de Funcionamento](#fluxo-de-funcionamento)
- [Executando a Aplicação](#executando-a-aplicação)

---

## 🏗️ Arquitetura

O backend segue o padrão **MVC (Model-View-Controller)** com separação em camadas:

```
pizzaria-backend/
├── src/
│   ├── server.js              # Ponto de entrada da aplicação
│   ├── app.js                 # Configuração do Express e middlewares
│   ├── lib/
│   │   └── prisma.js          # Cliente Prisma para acesso ao banco
│   ├── controllers/           # Lógica de requisição/resposta
│   │   ├── usuario.controller.js
│   │   └── pedido.controller.js
│   ├── services/              # Lógica de negócio
│   │   ├── usuario.service.js
│   │   └── pedido.service.js
│   ├── routes/                # Definição de rotas
│   │   ├── usuario.routes.js
│   │   ├── pedido.routes.js
│   │   └── admin.pedido.routes.js
│   ├── middlewares/           # Middlewares Express
│   │   ├── auth.middleware.js     # Autenticação JWT
│   │   ├── validacao.middleware.js
│   │   └── error.middleware.js
│   └── helpers/               # Funções auxiliares
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
└── .env                       # Variáveis de ambiente
```

### Camadas da Aplicação

1. **Routes**: Define os endpoints HTTP e mapeia para os controllers
2. **Controllers**: Recebe requisições, chama services e envia respostas
3. **Services**: Contém toda a lógica de negócio (validações, operações com dados)
4. **Prisma Client**: Comunica com o banco PostgreSQL

---

## 🛠️ Tecnologias

| Tecnologia | Versão | Descrição |
|---|---|---|
| **Node.js** | - | Runtime JavaScript |
| **Express** | 4.19.2 | Framework web para Node.js |
| **Prisma** | 5.0.0 | ORM para acesso ao banco de dados |
| **PostgreSQL** | - | Banco de dados relacional |
| **JWT** | 9.0.2 | Autenticação por token |
| **bcrypt** | 5.1.1 | Hash de senhas |
| **CORS** | 2.8.6 | Controle de requisições entre domínios |
| **Nodemon** | 3.1.0 | Auto-reload em desenvolvimento |

---

## 📦 Pré-requisitos

- **Node.js** (v18+)
- **npm** ou **yarn**
- **PostgreSQL** (localmente ou em produção)
- Variáveis de ambiente configuradas (`.env`)

---

## 🚀 Instalação

1. **Clone o repositório**:
```bash
cd pizzaria-backend
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Gere o cliente Prisma**:
```bash
npm run prisma:generate
```

4. **Configure o arquivo `.env`** (veja [Configuração](#configuração))

5. **Execute as migrations**:
```bash
npm run prisma:migrate
```

---

## ⚙️ Configuração

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
# Conexão ao Banco de Dados PostgreSQL
DATABASE_URL="postgresql://usuario:senha@localhost:5432/delivery?schema=public"

# JWT - Autenticação
JWT_SECRET="sua_chave_secreta_forte"
JWT_EXPIRES_IN="7d"

# Servidor
PORT=3000
```

### Explicação das variáveis:

- **DATABASE_URL**: String de conexão PostgreSQL (usuario:senha@host:porta/banco)
- **JWT_SECRET**: Chave privada para assinar e validar tokens JWT (use uma string forte em produção)
- **JWT_EXPIRES_IN**: Tempo de expiração do token JWT
- **PORT**: Porta em que o servidor escuta (padrão: 3000)

---

## 📊 Banco de Dados

### Schema Prisma

A aplicação possui 3 modelos principais:

#### 1. **Usuario**
```prisma
model Usuario {
  id      Int      @id @default(autoincrement())
  nome    String
  email   String   @unique
  senha   String
  ativo   Boolean  @default(true)
  admin   Boolean  @default(false)
  pedidos Pedido[]
}
```

- **id**: Identificador único (auto-incremento)
- **nome**: Nome do usuário
- **email**: Email único do usuário
- **senha**: Senha com hash bcrypt
- **ativo**: Flag para ativar/desativar usuário
- **admin**: Flag para indicar se é administrador

#### 2. **Pedido**
```prisma
model Pedido {
  id         Int    @id @default(autoincrement())
  status     String
  preco      Float
  usuarioId  Int
  usuario    Usuario @relation(fields: [usuarioId], references: [id])
  
  cep        String
  rua        String
  bairro     String
  cidade     String
  estado     String
  numero     String?
  complemento String?
  
  itens      ItemPedido[]
}
```

- **id**: Identificador único do pedido
- **status**: Estado do pedido (pendente, em_preparo, saiu_entrega, entregue, cancelado)
- **preco**: Valor total do pedido
- **usuarioId**: Referência ao usuário que fez o pedido
- **Endereço**: CEP, rua, bairro, cidade, estado, número e complemento

#### 3. **ItemPedido**
```prisma
model ItemPedido {
  id             Int    @id @default(autoincrement())
  quantidade     Int
  sabor          String
  tamanho        String
  precoUnitario  Float
  pedidoId       Int
  pedido         Pedido @relation(fields: [pedidoId], references: [id])
}
```

- **id**: Identificador único do item
- **quantidade**: Quantidade de pizzas
- **sabor**: Sabor da pizza
- **tamanho**: Tamanho (pequena, média, grande)
- **precoUnitario**: Preço unitário da pizza
- **pedidoId**: Referência ao pedido

---

## 🔐 Autenticação e Autorização

### Fluxo de Autenticação

1. **Login**: Usuário envia email e senha → Service valida credenciais e gera JWT
2. **Token JWT**: Contém `id`, `email` e `admin` do usuário
3. **Requisições Autenticadas**: Cliente envia token no header `Authorization: Bearer <token>`
4. **Validação**: Middleware valida e decodifica o token

### Middleware de Autenticação (`auth.middleware.js`)

```javascript
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload;  // Armazena dados do usuário na requisição
    next();
  } catch {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
};
```

### Middleware de Admin (`adminOnly`)

Valida se o usuário tem privilégios de administrador:

```javascript
const adminOnly = (req, res, next) => {
  if (!req.usuario?.admin) {
    return res.status(403).json({ error: 'Acesso restrito a administradores.' });
  }
  next();
};
```

### Proteção de Rotas

```javascript
app.js
// Rotas públicas (sem auth)
app.use('/usuarios', usuarioRoutes);

// ✅ Auth obrigatório daqui em diante
app.use(auth);

app.use('/pedidos', pedidoRoutes);
app.use('/admin/pedidos', adminPedidoRoutes);
```

---

## 📡 Endpoints da API

### 👤 Usuários (Públicas)

#### Registrar Usuário
```http
POST /usuarios
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123",
  "admin": false
}
```

**Resposta**: 201 Created
```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com",
  "ativo": true,
  "admin": false
}
```

#### Login
```http
POST /usuarios/login
Content-Type: application/json

{
  "email": "joao@email.com",
  "senha": "senha123"
}
```

**Resposta**: 200 OK
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "admin": false
  }
}
```

#### Listar Usuários
```http
GET /usuarios
Authorization: Bearer <token>
```

**Resposta**: 200 OK
```json
[
  {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com",
    "ativo": true,
    "admin": false
  }
]
```

#### Buscar Usuário por ID
```http
GET /usuarios/:id
Authorization: Bearer <token>
```

#### Atualizar Usuário
```http
PUT /usuarios/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "nome": "João Silva Atualizado"
}
```

#### Deletar Usuário
```http
DELETE /usuarios/:id
Authorization: Bearer <token>
```

---

### 🍕 Pedidos (Protegidas)

#### Criar Pedido
```http
POST /pedidos
Authorization: Bearer <token>
Content-Type: application/json

{
  "preco": 89.90,
  "cep": "12345678",
  "rua": "Rua das Flores",
  "bairro": "Centro",
  "cidade": "São Paulo",
  "estado": "SP",
  "numero": "123",
  "complemento": "Apt 42",
  "itens": [
    {
      "quantidade": 2,
      "sabor": "Margherita",
      "tamanho": "grande",
      "precoUnitario": 45.00
    }
  ]
}
```

**Resposta**: 201 Created

#### Listar Meus Pedidos
```http
GET /pedidos
Authorization: Bearer <token>
```

- **Usuários comuns**: Veem apenas seus próprios pedidos
- **Admins**: Veem todos os pedidos

#### Buscar Pedido por ID
```http
GET /pedidos/:id
Authorization: Bearer <token>
```

#### Atualizar Status do Pedido
```http
PATCH /pedidos/:id/status
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "em_preparo"
}
```

Valores possíveis de status: `pendente`, `em_preparo`, `saiu_entrega`, `entregue`, `cancelado`

#### Deletar Pedido (Admin Only)
```http
DELETE /pedidos/:id
Authorization: Bearer <token>
```

---

### 👨‍💼 Pedidos - Admin

#### Atualizar Pedido (Admin)
```http
PATCH /admin/pedidos/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "status": "entregue",
  "preco": 95.00
}
```

---

## 🔄 Fluxo de Funcionamento

### 1. Registro e Login

```mermaid
graph LR
A["Usuário envia email + senha<br/>(POST /usuarios)"] --> B["Service valida dados"]
B --> C["Hash da senha com bcrypt"]
C --> D["Cria usuário no Prisma"]
D --> E["Retorna usuário criado"]
```

```mermaid
graph LR
A["Usuário envia email + senha<br/>(POST /usuarios/login)"] --> B["Service busca usuário"]
B --> C["Compara senha com bcrypt"]
C --> D["Gera JWT com id, email, admin"]
D --> E["Retorna token + dados usuário"]
```

### 2. Requisições Autenticadas

```mermaid
graph LR
A["Cliente envia requisição<br/>com header Authorization"] --> B["Middleware auth valida JWT"]
B --> C{"Token válido?"}
C -->|Sim| D["Decodifica token<br/>req.usuario = dados"]
D --> E["Passa para Controller"]
C -->|Não| F["Retorna 401 Unauthorized"]
E --> G["Service executa lógica"]
G --> H["Retorna resposta"]
```

### 3. Criação de Pedido

```mermaid
graph LR
A["POST /pedidos com itens"] --> B["Controller recebe"]
B --> C["Service valida dados"]
C --> D["Cria Pedido no Prisma"]
D --> E["Cria ItemPedidos vinculados"]
E --> F["Retorna pedido com itens"]
```

---

## ▶️ Executando a Aplicação

### Modo Desenvolvimento

```bash
npm run dev
```

Usa **nodemon** para auto-reload ao alterar arquivos.

### Modo Produção

```bash
npm start
```

### Verificar Saúde da API

```bash
curl http://localhost:3000/health
```

---

## 🛡️ Segurança

### Implementações de Segurança:

1. **Hash de Senhas**: Usando bcrypt com 10 rounds de salt
2. **JWT**: Tokens com expiração (padrão 7 dias)
3. **CORS**: Configurado para aceitar apenas requisições do frontend (`http://localhost:5173`)
4. **Autenticação**: Todas as rotas críticas exigem token JWT
5. **Autorização**: Rotas de admin verificam flag `admin` do usuário
6. **Validação**: Dados validados antes de serem salvos no banco

---

## 📝 Tratamento de Erros

A aplicação usa um middleware global de erros:

```javascript
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Erro interno.' });
});
```

### Status HTTP Comuns:

- **200**: OK - Requisição bem-sucedida
- **201**: Created - Recurso criado com sucesso
- **204**: No Content - Deletado com sucesso
- **400**: Bad Request - Dados inválidos
- **401**: Unauthorized - Token ausente ou inválido
- **403**: Forbidden - Acesso restrito (ex: não é admin)
- **404**: Not Found - Recurso não encontrado
- **500**: Internal Server Error - Erro no servidor

---

## 📚 Recursos Adicionais

- [Documentação do Express](https://expressjs.com)
- [Documentação do Prisma](https://www.prisma.io/docs)
- [JWT - JSON Web Tokens](https://jwt.io)
- [bcrypt](https://www.npmjs.com/package/bcrypt)

---

## 📧 Contato

Caso tenha dúvidas sobre a API, verifique os endpoints acima ou entre em contato com o time de desenvolvimento.
