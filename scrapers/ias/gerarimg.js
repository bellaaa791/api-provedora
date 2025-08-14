const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

const gpt1image = async (prompt) => {
  if (!prompt) throw new Error("Descreva a imagem que deseja gerar.");

  const headers = {
    "Content-Type": "application/json",
    "Referer": "https://gpt1image.exomlapi.com/",
    "User-Agent": "Mozilla/5.0"
  };

  const body = JSON.stringify({
    prompt: prompt,
    n: 1,
    size: "1024x1024",
    is_enhance: true,
    response_format: "url"
  });

  const response = await fetch("https://gpt1image.exomlapi.com/v1/images/generations", {
    method: "POST",
    headers,
    body
  });

  if (!response.ok) {
    throw new Error(`Erro na requisição: ${response.status} ${response.statusText}`);
  }

  const json = await response.json();
  const url = json?.data?.[0]?.url;

  if (!url) {
    throw new Error(`URL não encontrada no retorno. Erro: ${json?.error || 'Desconhecido'}`);
  }

  return url;
};

module.exports = { gpt1image }

