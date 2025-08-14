/* 
• Edição de Imagem com OpenAI
• Autor original: SaaOfc's (traduzido e adaptado por ChatGPT)
*/

const axios = require('axios');
const FormData = require('form-data');

async function editarImagem(urlImagem, prompt) {
  try {
    // Baixa a imagem da URL como array de bytes
    const respostaImagem = await axios.get(urlImagem, { responseType: 'arraybuffer' });
    const bufferImagem = Buffer.from(respostaImagem.data);

    // Prepara os dados do formulário para enviar à API
    const form = new FormData();
    form.append('image', bufferImagem, {
      filename: 'imagem.png',
      contentType: 'image/png'
    });
    form.append('prompt', prompt);
    form.append('model', 'gpt-image-1');
    form.append('n', '1');
    form.append('size', '1024x1024');
    form.append('quality', 'medium');

    // Faz a requisição à API da OpenAI
    const resposta = await axios.post(
      'https://api.openai.com/v1/images/edits',
      form,
      {
        headers: {
          ...form.getHeaders(),
Authorization: `Bearer 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`
        }
      }
    );

    const base64 = resposta.data?.data?.[0]?.b64_json;
    if (!base64) throw new Error('A resposta da API não contém a imagem.');

    return base64;
  } catch (erro) {
    console.error('Erro:', erro.message);
    return null;
  }
}

// 🔽 Teste rápido
module.exports = { editarImagem }