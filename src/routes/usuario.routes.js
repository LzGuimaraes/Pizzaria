const { Router } = require('express');
const usuarioController = require('../controllers/usuario.controller');
const { auth, adminOnly } = require('../middlewares/auth.middleware');
const { validarCadastro } = require('../middlewares/validacao.middleware');

const router = Router();

// Pública
router.post('/login', usuarioController.login);
router.post('/cadastro', validarCadastro, usuarioController.criar)


// Autenticadas
router.get('/', auth, adminOnly, usuarioController.listar);
router.get('/:id', auth, usuarioController.buscarPorId);
router.put('/:id', auth, usuarioController.atualizar);
router.delete('/:id', auth, adminOnly, usuarioController.deletar);

module.exports = router;