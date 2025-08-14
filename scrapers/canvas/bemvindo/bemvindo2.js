const { createCanvas, loadImage } = require('canvas');

const width = 800;
const height = 900; // altura total

async function gerarbemvindo2({
  tituloTopo = 'Bem vindo(a)',
  imagem1Url,
  imagem2Url,
  textoCard1 = 'grupo obsidian',
  textoCard2 = 'tokyo'
}) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Fundo preto
  ctx.fillStyle = '#000';
  ctx.fillRect(0, 0, width, height);

  // Função para desenhar retângulo arredondado
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
  }

  // Função para desenhar card
  function drawCard(x, y, w, h, radius, fillColor, border1Color, border1Width, border2Color, border2Width, text) {
    ctx.fillStyle = fillColor;
    roundRect(ctx, x, y, w, h, radius);
    ctx.fill();

    // Borda externa
    ctx.lineWidth = border2Width;
    ctx.strokeStyle = border2Color;
    roundRect(ctx, x - border2Width, y - border2Width, w + border2Width * 2, h + border2Width * 2, radius + border2Width);
    ctx.stroke();

    // Borda interna
    ctx.lineWidth = border1Width;
    ctx.strokeStyle = border1Color;
    roundRect(ctx, x, y, w, h, radius);
    ctx.stroke();

    // Texto
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + w / 2, y + h / 2);
  }

  // Card topo
  const cardHeight = 60;
  const cardWidth = 350;
  const cardX = (width - cardWidth) / 2;
  const cardY = 20;
  drawCard(cardX, cardY, cardWidth, cardHeight, 15, 'rgba(0,0,0,0.5)', 'rgba(255,255,255,0.7)', 2, '#fff', 5, tituloTopo);

  // Carregar imagens
  const [image1, image2] = await Promise.all([
    loadImage(imagem1Url),
    loadImage(imagem2Url)
  ]);

  // Imagem 1
  const maxWidth1 = 520;
  const maxHeight1 = 600;
  const ratio1 = Math.min(maxWidth1 / image1.width, maxHeight1 / image1.height);
  const imgWidth1 = image1.width * ratio1;
  const imgHeight1 = image1.height * ratio1;
  const imgX1 = width - imgWidth1 - 50;
  const imgY1 = cardY + cardHeight + 30;

  ctx.save();
  roundRect(ctx, imgX1, imgY1, imgWidth1, imgHeight1, 60);
  ctx.clip();
  ctx.drawImage(image1, imgX1, imgY1, imgWidth1, imgHeight1);
  ctx.restore();

  ctx.lineWidth = 6;
  ctx.strokeStyle = '#fff';
  roundRect(ctx, imgX1, imgY1, imgWidth1, imgHeight1, 60);
  ctx.stroke();

  // Card abaixo da imagem 1
  drawCard(imgX1, imgY1 + imgHeight1 + 15, imgWidth1, 50, 15, 'rgba(0,0,0,0.5)', 'rgba(255,255,255,0.7)', 2, '#fff', 5, textoCard1);

  // Imagem 2
  const side = Math.min(image2.width, image2.height);
  const sx = (image2.width - side) / 2;
  const sy = (image2.height - side) / 2;
  const imgWidth2 = 350;
  const imgHeight2 = 350;
  const baseX2 = imgX1 - imgWidth2 - 10 + 120;
  const baseY2 = cardY + cardHeight + 150;

  ctx.save();
  roundRect(ctx, baseX2, baseY2, imgWidth2, imgHeight2, 30);
  ctx.clip();
  ctx.drawImage(image2, sx, sy, side, side, baseX2, baseY2, imgWidth2, imgHeight2);
  ctx.restore();

  ctx.lineWidth = 6;
  ctx.strokeStyle = '#fff';
  roundRect(ctx, baseX2, baseY2, imgWidth2, imgHeight2, 30);
  ctx.stroke();

  // Card abaixo da imagem 2
  drawCard(baseX2, baseY2 + imgHeight2 + 15, imgWidth2, 50, 15, 'rgba(0,0,0,0.5)', 'rgba(255,255,255,0.7)', 2, '#fff', 5, textoCard2);

  // Retornar buffer
  return canvas.toBuffer('image/png');
}

module.exports = { gerarbemvindo2 } 
