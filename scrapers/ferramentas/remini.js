const axios = require('axios');
const FormData = require('form-data');

/**
 * Faz o upscale de uma imagem usando o serviço picupscaler.com
 * @param {Buffer} imageBuffer - Imagem em buffer (JPEG)
 * @returns {Promise<string>} - URL da imagem melhorada
 */
async function upscale(imageBuffer) {
  try {
    const form = new FormData();
    form.append('image', imageBuffer, {
      filename: 'upload.jpg',
      contentType: 'image/jpeg'
    });
    form.append('user_id', 'undefined');
    form.append('is_public', 'true');

    const headers = {
      ...form.getHeaders(),
      'Accept': '*/*',
      'Origin': 'https://picupscaler.com',
      'Referer': 'https://picupscaler.com/',
      'User-Agent': 'Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36'
    };

    const { data } = await axios.post(
      'https://picupscaler.com/api/generate/handle',
      form,
      { headers }
    );

    const resultUrl = data?.image_url || data?.url;
    if (!resultUrl) throw new Error('Upscale falhou: URL da imagem não encontrada');

    return resultUrl;
  } catch (erro) {
    throw new Error(`Erro ao fazer upscale: ${erro.message || erro}`);
  }
}

module.exports = { upscale };
