const prisma = require('../lib/prisma');

const STATUS_VALIDOS = [
  'PENDENTE',
  'EM_PREPARO',
  'SAIU_PARA_ENTREGA',
  'ENTREGUE',
  'CANCELADO'
];

const listarPedidos = async (usuarioId, isAdmin) => {
  const where = isAdmin ? {} : { usuarioId };
  return prisma.pedido.findMany({
    where,
    include: {
      itens: true,
      usuario: { select: { id: true, nome: true, email: true } },
    },
    orderBy: { id: 'desc' },
  });
};

const buscarPedidoPorId = async (id, usuarioId, isAdmin) => {
  const pedido = await prisma.pedido.findUnique({
    where: { id },
    include: {
      itens: true,
      usuario: { select: { id: true, nome: true, email: true } },
    },
  });

  if (!pedido) {
    const err = new Error('Pedido não encontrado.');
    err.status = 404;
    throw err;
  }

  if (!isAdmin && pedido.usuarioId !== usuarioId) {
    const err = new Error('Acesso negado.');
    err.status = 403;
    throw err;
  }

  return pedido;
};

const calcularPreco = (itens) =>
  itens.reduce((total, item) => total + item.quantidade * item.precoUnitario, 0);

const criarPedido = async (usuarioId, { itens }) => {
  if (!itens || itens.length === 0) {
    const err = new Error('O pedido deve ter ao menos um item.');
    err.status = 400;
    throw err;
  }

  const preco = calcularPreco(itens);

  return prisma.pedido.create({
    data: {
      status: 'PENDENTE',
      preco,
      usuarioId,
      itens: { create: itens },
    },
    include: { itens: true },
  });
};

const atualizarStatusPedido = async (id, status, usuarioId, isAdmin) => {
  if (!STATUS_VALIDOS.includes(status)) {
    const err = new Error(`Status inválido. Valores aceitos: ${STATUS_VALIDOS.join(', ')}`);
    err.status = 400;
    throw err;
  }

  // Verifica se o pedido existe e pertence ao usuário (ou é admin)
  await buscarPedidoPorId(id, usuarioId, isAdmin);

  return prisma.pedido.update({
    where: { id },
    data: { status },
    include: { itens: true },
  });
};

const deletarPedido = async (id, usuarioId, isAdmin) => {
  await buscarPedidoPorId(id, usuarioId, isAdmin);

  await prisma.itemPedido.deleteMany({ where: { pedidoId: id } });

  return prisma.pedido.delete({ where: { id } });
};

module.exports = { listarPedidos, buscarPedidoPorId, criarPedido, atualizarStatusPedido, deletarPedido };