const { Router } = require('express');
const pedidoController = require('../controllers/pedido.controller');
const { auth, adminOnly } = require('../middlewares/auth.middleware');

const router = Router();

// todas admin-only
router.use(auth, adminOnly);

// ver todos pedidos (painel)
router.get('/pedidos', pedidoController.listar);

// ver detalhes
router.get('/pedidos/:id', pedidoController.buscarPorId);

// atualizar status
router.patch('/pedidos/:id/status', pedidoController.atualizarStatus);

// deletar (opcional no painel)
router.delete('/pedidos/:id', pedidoController.deletar);

module.exports = router;