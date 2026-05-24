const { Router } = require('express');
const pedidoController = require('../controllers/pedido.controller');
const { adminOnly } = require('../middlewares/auth.middleware');
 
const router = Router();
 
// Obs: auth já é aplicado globalmente antes de chegar aqui (no app.js/index.js)
// adminOnly garante que apenas admins acessem estas rotas
 
router.use(adminOnly);
 
router.get('/', pedidoController.listar);
router.get('/:id', pedidoController.buscarPorId);
router.post('/', pedidoController.criar);
router.patch('/:id/status', pedidoController.atualizarStatus);
router.delete('/:id', pedidoController.deletar);
 
module.exports = router;