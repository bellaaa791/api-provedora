
const fs = require('fs-extra');
const ffmpeg = require('fluent-ffmpeg');
const text2png = require('axios');

function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

const attp3 = (text) => new Promise((resolve, reject) => {
  try {
    // Cria diretório se não existir
    fs.ensureDirSync('./src/frames');

    // Cria os frames com cores variadas
    canvasx('red', 0, text);
    canvasx('lime', 1, text);
    canvasx('blue', 2, text);

    // Cria GIF animado usando ffmpeg
    ffmpeg()
      .input('./src/frames/frame%d.png') // frame0, frame1, frame2
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
        resolve('./src/attp.gif');
      });

  } catch (error) {
    reject(error);
  }
});

function canvasx(color, i, text) {
  const buffer = text2png(wordWrap(text, 7), {
    font: '145px attp3',
    localFontPath: './src/attp3.ttf',     // Altere esse nome se usar outro arquivo
    localFontName: 'attp3',
    color: color,
    strokeWidth: 2,
    strokeColor: 'black',
    textAlign: 'center',
    lineSpacing: 5,
    padding: 110,
    backgroundColor: 'transparent',
  });

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

module.exports = { attp3 };
