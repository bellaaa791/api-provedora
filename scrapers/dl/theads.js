const axios = require('axios');

const downloadFromThreads = async (threadsUrl) => {
  const api = 'https://api.threadsphotodownloader.com/v2/media';

  try {
    const response = await axios.get(api, {
      params: { url: threadsUrl },
      headers: {
        'Origin': 'https://sssthreads.pro',
        'Referer': 'https://sssthreads.pro/',
        'User-Agent': 'Mozilla/5.0',
      }
    });

    const { video_urls = [], image_urls = [] } = response.data;

    if (video_urls.length === 0 && image_urls.length === 0) {
      //console.log('ga ada media, senpai!');
      return;
    }

    for (const item of video_urls) {
     return(`${item.download_url}`);
    }

    for (const url of image_urls) {
     // console.log(`Gambar tersedia: ${url}`);
    }

  } catch (err) {
    console.error(`A-ano... terjadi kesalahan saat memproses, senpai: ${err.message}`);
  }
};

// contoh pke
//const testURL = 'https://www.threads.net/@indrati.1259/post/DLCr1h9yrna';
//downloadFromThreads(testURL);

module.exports = { downloadFromThreads }