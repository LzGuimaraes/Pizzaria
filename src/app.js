const express = require('express');
const { auth } = require('./middlewares/auth.middleware');

const usuarioRoutes = require('./routes/usuario.routes');   // suas rotas de usuário
const pedidoRoutes = require('./routes/pedido.routes');
const adminPedidoRoutes = require('./routes/admin.pedido.routes');

const app = express();
app.use(express.json());

const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Rotas públicas (sem auth)
app.use('/usuarios', usuarioRoutes); 

// ✅ Rotas protegidas — auth aplicado aqui, vale para tudo abaixo
app.use(auth);

app.use('/pedidos', pedidoRoutes);
app.use('/admin/pedidos', adminPedidoRoutes); // adminOnly aplicado dentro do próprio arquivo

// Handler de erros global
app.use((err, req, res, next) => {
  const status = err.status || 500;
  res.status(status).json({ error: err.message || 'Erro interno.' });
});

module.exports = app;