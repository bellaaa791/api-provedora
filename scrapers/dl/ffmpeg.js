const fs = require('fs');
const path = require('path');
const axios = require('axios');
const ffmpeg = require('fluent-ffmpeg');

const OUTPUT_DIR = path.join(__dirname, 'downloads');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

async function streamAudioFromVideoUrl(videoUrl, res) {
  const tmpVideoPath = path.join(OUTPUT_DIR, `video_${Date.now()}.mp4`);

  // 1) Baixar vídeo para arquivo temporário
  const writer = fs.createWriteStream(tmpVideoPath);
  const response = await axios({
    url: videoUrl,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  await new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });

  // 2) Configurar headers para resposta HTTP - áudio mp3
  res.setHeader('Content-Type', 'audio/mpeg');
  res.setHeader('Content-Disposition', 'inline; filename="audio.mp3"');

  // 3) Extrair áudio com ffmpeg e enviar para res (stream)
  await new Promise((resolve, reject) => {
    ffmpeg(tmpVideoPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .format('mp3')
      .on('error', reject)
      .on('end', resolve)
      .pipe(res, { end: true });
  });

  // 4) Apagar arquivo temporário do vídeo
  fs.unlink(tmpVideoPath, err => {
    if (err) console.error('Erro ao apagar vídeo temporário:', err);
  });
}

module.exports = { streamAudioFromVideoUrl };
