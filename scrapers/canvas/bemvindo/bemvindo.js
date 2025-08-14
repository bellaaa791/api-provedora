const { loadImage } = require('canvas');

// Recebe os parâmetros conforme solicitado
async function desenharCena(ctx, textobemvindo, imgbanner, imgperfil, nomegrupo, numerouser) {
  ctx.canvas.width = 900;
  ctx.canvas.height = 300;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Elemento: retângulo de fundo
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(64, 64, 64, 1)";
  ctx.lineWidth = 0;
  ctx.strokeStyle = "rgba(64, 64, 64, 1)";
  ctx.fillRect(4, 5, 892, 289);

  // Elemento: imagem de banner
  const img1 = await loadImage(imgbanner);
  ctx.save();
  roundRect(ctx, 10, 13, 880, 273, 20);
  ctx.clip();
  ctx.drawImage(img1, 10, 13, 880, 273);
  ctx.restore();

  // Elemento: sobreposição escura
  ctx.globalAlpha = 0.78;
  ctx.fillStyle = "rgba(0, 0, 0, 0.78)";
  ctx.fillRect(19, 22, 857, 252);
  ctx.globalAlpha = 1;

  // Elemento: círculo branco de fundo da imagem de perfil
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.beginPath();
  ctx.arc(110, 144, 84, 0, Math.PI * 2);
  ctx.fill();

  // Elemento: imagem de perfil
  const img2 = await loadImage(imgperfil);
  ctx.save();
  ctx.beginPath();
  ctx.arc(110.5, 144, Math.min(163, 182) / 2, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(img2, 29, 53, 163, 182);
  ctx.restore();

  // Texto de boas-vindas
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.font = "60px Arial";
  ctx.fillText(textobemvindo, 235, 145);

  // Nome do grupo
  ctx.font = "20px Arial";
  ctx.fillText(nomegrupo, 732, 253);

  // Número de usuários
  ctx.font = "30px Arial";
  ctx.fillText(numerouser, 244, 201);
}

// Função auxiliar para criar retângulos arredondados
function roundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

module.exports = { desenharCena };
