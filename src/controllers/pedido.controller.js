const pedidoService = require('../services/pedido.service');

const listar = async (req, res, next) => {
  try {
    const pedidos = await pedidoService.listarPedidos(req.usuario.id, req.usuario.admin);
    res.json(pedidos);
  } catch (err) {
    next(err);
  }
};

const buscarPorId = async (req, res, next) => {
  try {
    const pedido = await pedidoService.buscarPedidoPorId(
      Number(req.params.id),
      req.usuario.id,
      req.usuario.admin
    );
    res.json(pedido);
  } catch (err) {
    next(err);
  }
};

const criar = async (req, res, next) => {
  try {
    const pedido = await pedidoService.criarPedido(req.usuario.id, req.body);
    res.status(201).json(pedido);
  } catch (err) {
    next(err);
  }
};

const atualizarStatus = async (req, res, next) => {
  try {
    const pedido = await pedidoService.atualizarStatusPedido(
      Number(req.params.id),
      req.body.status,
      req.usuario.id,
      req.usuario.admin
    );
    res.json(pedido);
  } catch (err) {
    next(err);
  }
};

const deletar = async (req, res, next) => {
  try {
    await pedidoService.deletarPedido(
      Number(req.params.id),
      req.usuario.id,
      req.usuario.admin
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};

module.exports = { listar, buscarPorId, criar, atualizarStatus, deletar };