const axios = require('axios');
const cheerio = require('cheerio');

async function soundcloudDownloader(link) {
  const form = `------WebKitFormBoundaryfe79BFG397L2GBLa\r
Content-Disposition: form-data; name="url"\r
\r
${link}\r
------WebKitFormBoundaryfe79BFG397L2GBLa--`;

  const headers = {
    'Content-Type': 'multipart/form-data; boundary=----WebKitFormBoundaryfe79BFG397L2GBLa',
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)', // Corrigido aqui
    'Referer': 'https://soundcloudmp3.co/pt',
    'Origin': 'https://soundcloudmp3.co',
    'Accept': '*/*'
  };

  try {
    const { data } = await axios.post('https://soundcloudmp3.co/result.php', form, { headers });
    const $ = cheerio.load(data);

    const title = $('.text-2xl').text().trim();
    const audiourl = $('audio > source').attr('src');
    const dhref = $('a.chbtn').attr('href');
    const durl = dhref?.startsWith('http') ? dhref : `https://soundcloudmp3.co${decodeURIComponent(dhref)}`;

    if (!audiourl || !title || !durl) throw new Error('Erro ao capturar os dados');

    return {
      'titulo': title,
      'audio': audiourl,
      'download': durl
    };

  } catch (error) {
    console.error('Erro ao baixar o áudio:', error.message);
    throw new Error('Falha ao processar o download');
  }
}

module.exports = { soundcloudDownloader };
