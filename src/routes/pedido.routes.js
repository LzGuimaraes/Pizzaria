const { Router } = require('express');
const pedidoController = require('../controllers/pedido.controller');
const { auth, adminOnly } = require('../middlewares/auth.middleware');

const router = Router();

// Todas as rotas exigem autenticação
router.use(auth);

router.get('/', pedidoController.listar);
router.get('/:id', pedidoController.buscarPorId);
router.post('/', pedidoController.criar);
router.patch('/:id/status', pedidoController.atualizarStatus);
router.delete('/:id', adminOnly, pedidoController.deletar);

module.exports = router;