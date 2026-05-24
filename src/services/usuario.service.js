const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SALT_ROUNDS = 10;

const listarUsuarios = async () => {
  return prisma.usuario.findMany({
    select: { id: true, nome: true, email: true, ativo: true, admin: true },
    orderBy: { id: 'asc' },
  });
};

const buscarUsuarioPorId = async (id) => {
  const usuario = await prisma.usuario.findUnique({
    where: { id },
    select: { id: true, nome: true, email: true, ativo: true, admin: true },
  });
  if (!usuario) {
    const err = new Error('Usuário não encontrado.');
    err.status = 404;
    throw err;
  }
  return usuario;
};

const criarUsuario = async ({ nome, email, senha, admin = false }) => {
  const senhaHash = await bcrypt.hash(senha, SALT_ROUNDS);
  return prisma.usuario.create({
    data: { nome, email, senha: senhaHash, admin },
    select: { id: true, nome: true, email: true, ativo: true, admin: true },
  });
};

const atualizarUsuario = async (id, dados) => {
  if (dados.senha) {
    dados.senha = await bcrypt.hash(dados.senha, SALT_ROUNDS);
  }
  return prisma.usuario.update({
    where: { id },
    data: dados,
    select: { id: true, nome: true, email: true, ativo: true, admin: true },
  });
};

const deletarUsuario = async (id) => {
  return prisma.usuario.delete({ where: { id } });
};

const login = async ({ email, senha }) => {
  const usuario = await prisma.usuario.findUnique({ where: { email } });

  if (!usuario || !usuario.ativo) {
    const err = new Error('Credenciais inválidas.');
    err.status = 401;
    throw err;
  }

  const senhaValida = await bcrypt.compare(senha, usuario.senha);
  if (!senhaValida) {
    const err = new Error('Credenciais inválidas.');
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: usuario.id, email: usuario.email, admin: usuario.admin },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );

  return {
    token,
    usuario: { id: usuario.id, nome: usuario.nome, email: usuario.email, admin: usuario.admin },
  };
};

module.exports = { listarUsuarios, buscarUsuarioPorId, criarUsuario, atualizarUsuario, deletarUsuario, login };