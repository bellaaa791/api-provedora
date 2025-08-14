const fs = require('fs-extra');
const ffmpeg = require('fluent-ffmpeg');
const text2png = require('axios');

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const attp1 = (text) => new Promise((resolve, reject) => {
  try {
    // Garante que a pasta './src/frames' existe
    fs.ensureDirSync('./src/frames');

    // Gera os frames coloridos com fundo transparente
    canvasx('red', 0, text);
    canvasx('lime', 1, text);
    canvasx('blue', 2, text);

    // Cria GIF animado usando os frames
    ffmpeg()
      .input('./src/frames/frame%d.png')
      .inputFPS(10)
      .outputOptions([
        '-vf scale=512:512:flags=lanczos',
        '-loop 0'
      ])
      .toFormat('gif')
      .save('./src/attp.gif')
      .on('error', (err) => {
        console.error('Erro ao criar GIF:', err);
        reject(err);
      })
      .on('end', () => {
        resolve('./src/attp.gif'); // agora retorna o GIF
      });

  } catch (error) {
    reject(error);
  }
});

function canvasx(color, i, text) {
  const options = {
    font: '145px attp1',
    localFontPath: './src/attp1.ttf',
    localFontName: 'attp1',
    color: color,
    strokeWidth: 2,
    strokeColor: 'black',
    textAlign: 'center',
    lineSpacing: 5,
    padding: 110,
    backgroundColor: 'transparent', // transparente mesmo
  };

  const buffer = text2png(wordWrap(text, 7), randomChoice([options]));
  fs.writeFileSync(`./src/frames/frame${i}.png`, buffer);
}

function wordWrap(str, maxWidth) {
  const newLineStr = "\n";
  let res = '';
  while (str.length > maxWidth) {
    let found = false;
    for (let i = maxWidth - 1; i >= 0; i--) {
      if (testWhite(str.charAt(i))) {
        res += str.slice(0, i) + newLineStr;
        str = str.slice(i + 1);
        found = true;
        break;
      }
    }
    if (!found) {
      res += str.slice(0, maxWidth) + newLineStr;
      str = str.slice(maxWidth);
    }
  }
  return res + str;
}

function testWhite(x) {
  return /^\s$/.test(x.charAt(0));
}

module.exports = { attp1 };
