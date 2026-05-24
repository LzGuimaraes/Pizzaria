const validarCadastro = (req, res, next) => {
  const { nome, email, senha } = req.body;
  const erros = [];

  if (!nome || nome.trim().length < 2) {
    erros.push('Nome deve ter ao menos 2 caracteres.');
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    erros.push('E-mail inválido.');
  }

  if (!senha || senha.length < 6) {
    erros.push('Senha deve ter ao menos 6 caracteres.');
  }

  if (erros.length > 0) {
    return res.status(400).json({ error: 'Dados inválidos.', detalhes: erros });
  }

  // Garante que o cliente nunca se auto-promova a admin
  req.body.admin = false;

  next();
};

module.exports = { validarCadastro };