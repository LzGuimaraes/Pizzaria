const { Prisma } = require('@prisma/client');

// eslint-disable-next-line no-unused-vars
const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // Erros do Prisma
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'Registro duplicado.', campo: err.meta?.target });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Registro não encontrado.' });
    }
    return res.status(400).json({ error: 'Erro de banco de dados.', code: err.code });
  }

  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({ error: 'Dados inválidos enviados ao banco.' });
  }

  // Erros de validação genéricos
  if (err.status) {
    return res.status(err.status).json({ error: err.message });
  }

  // Erro interno padrão
  return res.status(500).json({ error: 'Erro interno do servidor.' });
};

module.exports = errorMiddleware;