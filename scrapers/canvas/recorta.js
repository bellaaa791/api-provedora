const axios = require('axios');
const { createCanvas, loadImage } = require('canvas');

// Converte centímetros para pixels (96 DPI)
const cmToPx = (cm) => Math.round(cm * 96 / 2.54);

/**
 * Recorta 3 cm da parte inferior da imagem e retorna o buffer
 * @param {string} imageUrl - URL da imagem a ser processada
 * @returns {Promise<Buffer>} - Buffer da imagem recortada em JPEG
 */
async function recortarImagem(imageUrl) {
try {
// Baixar imagem
const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
const buffer = Buffer.from(response.data, 'binary');

// Carregar imagem no Canvas
const img = await loadImage(buffer);

// Altura a ser cortada
const cortePx = cmToPx(3);
const novaAltura = img.height - cortePx;

// Criar canvas com nova altura
const canvas = createCanvas(img.width, novaAltura);
const ctx = canvas.getContext('2d');

// Desenhar imagem no canvas
ctx.drawImage(img, 0, 0, img.width, novaAltura, 0, 0, img.width, novaAltura);

// Retornar buffer JPEG
return canvas.toBuffer('image/jpeg');
} catch (error) {
throw new Error(`Erro ao processar imagem: ${error.message}`);
}
}
module.exports = { recortarImagem }