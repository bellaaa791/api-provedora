const { Classic, ClassicPro, Dynamic, Mini  } = require("musicard");
const fs = require('fs')
const gerarImagem = async (options, outputPath, tipo) => {
try {
const tipoImagem = 
tipo === 'Classic' ? Classic :
tipo === 'ClassicPro' ? ClassicPro :
tipo === 'Dynamic' ? Dynamic :
tipo === 'Mini' ? Mini : null;
if (!tipoImagem) {
throw new Error("Tipo inválido fornecido");
}
const imageBuffer = await tipoImagem({
thumbnailImage: options.thumbnailImage,
backgroundImage: options.backgroundImage,
imageDarkness: options.imageDarkness,
nameColor: options.nameColor,
progressColor: options.progressColor,
progressBarColor: options.progressBarColor,
progress: options.progress,
author: options.author,
startTime: options.startTime,
endTime: options.endTime,
name: options.name,
menuColor: options.menuColor
});

fs.writeFileSync(outputPath, imageBuffer);
return outputPath;
} catch (err) {
throw new Error("Erro ao gerar a imagem: " + err);
}
};

module.exports = { gerarImagem }