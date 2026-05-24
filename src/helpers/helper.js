const fetch = require('node-fetch');

const limparCep = (cep) => cep.replace(/\D/g, '');

const buscarEnderecoViaCep = async (cep) => {
  const cepLimpo = limparCep(cep);

  if (cepLimpo.length !== 8) {
    const err = new Error('CEP inválido. Deve conter 8 dígitos.');
    err.status = 400;
    throw err;
  }

  let res, data;
  try {
    res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    data = await res.json();
  } catch {
    const err = new Error('Erro ao consultar ViaCEP.');
    err.status = 503;
    throw err;
  }

  if (data.erro) {
    const err = new Error('CEP não encontrado.');
    err.status = 404;
    throw err;
  }

  return data;
};

module.exports = { limparCep, buscarEnderecoViaCep };