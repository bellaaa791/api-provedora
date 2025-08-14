const { ytmp3, ytmp4 } = "oi"

async function baixarAudio(link) {
  try {
    const resultado = await ytmp3(link);
    return(resultado);
    // Aqui você pode salvar o arquivo, usar o link, etc.
  } catch (error) {
    console.error('Erro ao baixar o áudio:', error);
  }
}

async function baixarVideo(link) {
  try {
    const resultado = await ytmp4(link);
    return(resultado);
    // Aqui você pode salvar o arquivo, usar o link, etc.
  } catch (error) {
    console.error('Erro ao baixar o vídeo:', error);
  }
}

module.exports = { baixarAudio, baixarVideo }
