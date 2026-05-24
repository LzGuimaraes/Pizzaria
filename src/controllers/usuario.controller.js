const usuarioService = require('../services/usuario.service');

const listar = async (req, res, next) => {
  try {
    const usuarios = await usuarioService.listarUsuarios();
    res.json(usuarios);
  } catch (err) {
    next(err);
  }
};

const buscarPorId = async (req, res, next) => {
  try {
    const usuario = await usuarioService.buscarUsuarioPorId(Number(req.params.id));
    res.json(usuario);
  } catch (err) {
    next(err);
  }
};

const criar = async (req, res, next) => {
  try {
    const usuario = await usuarioService.criarUsuario(req.body);
    res.status(201).json(usuario);
  } catch (err) {
    next(err);
  }
};

const atualizar = async (req, res, next) => {
  try {
    const usuario = await usuarioService.atualizarUsuario(Number(req.params.id), req.body);
    res.json(usuario);
  } catch (err) {
    next(err);
  }
};

const deletar = async (req, res, next) => {
  try {
    await usuarioService.deletarUsuario(Number(req.params.id));
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const resultado = await usuarioService.login(req.body);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, buscarPorId, criar, atualizar, deletar, login };