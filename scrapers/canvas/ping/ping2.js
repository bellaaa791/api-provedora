const { createCanvas, loadImage } = require('canvas');
const axios = require('axios');
const fs = require('fs');
const path = require('path');

async function loadImageFromUrl(url) {
  const response = await axios.get(url, { responseType: 'arraybuffer' });
  return await loadImage(Buffer.from(response.data, 'binary'));
}

function drawRoundedImage(ctx, image, x, y, width, height, radius) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(image, x, y, width, height);

  ctx.restore();
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.stroke();
}

/**
 * Cria a imagem com as duas URLs e o texto passado.
 * @param {string} url1 URL da primeira imagem (grande).
 * @param {string} url2 URL da segunda imagem (círculo).
 * @param {string} text Texto a ser escrito no card.
 * @param {boolean} [saveToFile=false] Se true, salva arquivo localmente.
 * @returns {Promise<Buffer>} Buffer da imagem PNG gerada.
 */
async function gerarping2(nomebot, url1, url2, text, saveToFile = false) {
  const img1 = await loadImageFromUrl(url1);
  const img2 = await loadImageFromUrl(url2);

  const width = 800;
  const height = 850;

  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fundo preto
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, width, height);

  // Imagem1 com largura aumentada para 700
  const img1Width = 700;
  const img1Height = (img1.height / img1.width) * img1Width;
  const img1X = (width - img1Width) / 2;
  const img1Y = 20;
  const borderRadius = 30;

  drawRoundedImage(ctx, img1, img1X, img1Y, img1Width, img1Height, borderRadius);

  // Card maior só com bordas (sem preenchimento)
  const cardWidth = 350;
  const cardHeight = 120;
  const cardX = width - cardWidth - 40;
  const cardY = img1Y + img1Height + 40;

  ctx.fillStyle = 'transparent';
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
  ctx.lineWidth = 3;
  ctx.shadowColor = 'rgba(255, 255, 255, 0.2)';
  ctx.shadowBlur = 10;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  roundRect(ctx, cardX, cardY, cardWidth, cardHeight, 25);

  // Texto dentro do card, itálico e branco
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#FFF';
  ctx.font = 'italic 36px Arial';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, cardX + cardWidth / 2, cardY + cardHeight / 2);

  // Imagem2 maior no canto inferior esquerdo
  const circleRadius = 140;
  const img2X = 40 + circleRadius;
  const img2Y = height - 40 - circleRadius;

  ctx.save();
  ctx.beginPath();
  ctx.arc(img2X, img2Y, circleRadius, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.clip();

  ctx.drawImage(img2, img2X - circleRadius, img2Y - circleRadius, circleRadius * 2, circleRadius * 2);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(img2X, img2Y, circleRadius, 0, Math.PI * 2, true);
  ctx.lineWidth = 5;
  ctx.strokeStyle = 'white';
  ctx.shadowColor = 'white';
  ctx.shadowBlur = 15;
  ctx.stroke();

  // Texto "Obsidian" maior, itálico e bem grande ao lado direito da segunda imagem
  ctx.shadowColor = 'transparent';
  ctx.fillStyle = '#FFF';
  ctx.font = 'italic bold 60px Arial';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const textX = img2X + circleRadius + 25;
  const textY = img2Y;
  ctx.fillText(nomebot, textX, textY);

  const buffer = canvas.toBuffer('image/png');

  if (saveToFile) {
    const outputPath = path.join(__dirname, 'saida');
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }
    const filePath = path.join(outputPath, 'imagem_final_retrato.png');
    fs.writeFileSync(filePath, buffer);
    console.log('Imagem salva em:', filePath);
  }

  return buffer;
}

module.exports = { gerarping2 };
