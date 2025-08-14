const { loadImage } = require('canvas');

async function desenharPing(ctx, {
  imagemFundo,
  imagemCircular,
  titulo,
  velocidade,
  sistema,
  tempoOnline,
  usoCpu,
  memoria,
  nomeBot
}) {
  // Configurações do canvas
  ctx.canvas.width = 840;
  ctx.canvas.height = 400;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Fundo cinza
  ctx.globalAlpha = 1;
  ctx.fillStyle = "rgba(120, 120, 120, 1)";
  ctx.fillRect(5, 5, 830, 390);

  // Imagem de fundo (com arredondamento)
  const imgFundo = await loadImage(imagemFundo);
  ctx.save();
  roundRect(ctx, 12, 12, 815, 377, 20);
  ctx.clip();
  ctx.drawImage(imgFundo, 12, 12, 815, 377);
  ctx.restore();

  // Camada escura por cima
  ctx.globalAlpha = 0.83;
  ctx.fillStyle = "rgba(0, 0, 0, 0.83)";
  ctx.fillRect(19, 20, 800, 363);
  ctx.globalAlpha = 1;

  // Círculo branco
  ctx.fillStyle = "rgba(255, 255, 255, 1)";
  ctx.beginPath();
  ctx.arc(105, 105, 76, 0, Math.PI * 2);
  ctx.fill();

  // Imagem circular
  const imgPerfil = await loadImage(imagemCircular);
  ctx.save();
  ctx.beginPath();
  ctx.arc(105, 105, 75, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(imgPerfil, 30, 25, 150, 160);
  ctx.restore();

  // Texto grande (título)
  ctx.fillStyle = "white";
  ctx.font = "40px Arial";
  ctx.fillText(titulo, 343, 73);

  // Outros textos
  ctx.font = "30px Arial";
  ctx.fillText(velocidade, 350, 144);

  ctx.font = "20px Arial";
  ctx.fillText(sistema, 97, 226);
  ctx.fillText(tempoOnline, 96, 260);
  ctx.fillText(usoCpu, 100, 294);
  ctx.fillText(memoria, 100, 325);

  ctx.fillText(nomeBot, 639, 359);
}

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

module.exports = { desenharPing };
