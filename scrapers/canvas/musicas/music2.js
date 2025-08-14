const { musicCard } = require("musicard-quartz");
const fs = require('fs');
const gerarImagem2 = async (options, outputPath, tipo) => {
try {
const tipoImagem = 
tipo === 'quartz+' || tipo === 'onepiece+' || tipo === 'vector+' ? tipo : null;
if (!tipoImagem) {
throw new Error("Tipo inválido fornecido");
}
const card = new musicCard()
.setName(options.setName)
.setAuthor(options.setAuthor)
.setColor(options.setColor)
.setTheme(tipoImagem)  
.setBrightness(options.setBrightness)
.setThumbnail(options.setThumbnail)
.setProgress(options.setProgress)
.setStartTime(options.setStartTime)
.setEndTime(options.setEndTime);
const imageBuffer = await card.build();
fs.writeFileSync(outputPath, imageBuffer);
return outputPath;
} catch (err) {
throw new Error("Erro ao gerar a imagem: " + err);
}
};

module.exports = { gerarImagem2 };

