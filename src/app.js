const express = require('express');
const usuarioRoutes = require('./routes/usuario.routes');
const pedidoRoutes = require('./routes/pedido.routes');
const errorMiddleware = require('./middlewares/error.middleware');

const app = express();

app.use(express.json());
const cors = require('cors');

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
}));


// Rotas
app.use('/usuarios', usuarioRoutes);
app.use('/pedidos', pedidoRoutes);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok' }));

// 404
app.use((req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));

// Tratamento de erros (deve ser o último middleware)
app.use(errorMiddleware);

module.exports = app;