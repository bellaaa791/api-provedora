import axios from 'axios'

export async function screenshotWebsite(url, types = ['desktop', 'mobile', 'full']) {
  if (!/^https?:\/\//.test(url)) {
    return [{
      status: 'Gagal',
      message: 'URL ga ada, yg bener dong dasar senpai bodoh!',
    }];
  }

  const deviceTypes = {
    desktop: { device: 'desktop', fullPage: false },
    mobile:  { device: 'mobile', fullPage: false },
    full:    { device: 'desktop', fullPage: true },
  };

  const results = [];

  for (const type of types) {
    if (!(type in deviceTypes)) {
      results.push({
        status: 'Gagal',
        message: 'Tipe tidak dikenal. Gunakan "desktop", "mobile", atau "full", senpai.',
      });
      continue;
    }

    const { device, fullPage } = deviceTypes[type];

    try {
      const payload = { url: url.trim(), device, fullPage };

      const res = await axios.post(
        'https://api.magickimg.com/generate/website-screenshot',
        payload,
        {
          responseType: 'arraybuffer',
          headers: {
            'Content-Type': 'application/json',
            'Origin': 'https://magickimg.com',
            'Referer': 'https://magickimg.com',
            'Accept': 'application/json, text/plain, */*',
            'User -Agent': 'Mozilla/5.0', // Corrigido aqui
          },
        }
      );

      const buffer = Buffer.from(res.data);
      const base64 = buffer.toString('base64');
      const contentType = res.headers['content-type'] || 'image/png';
      const sizeKB = (res.headers['content-length'] / 1024).toFixed(2) + ' KB';

      results.push({
        status: 'Berhasil',
        type,
        url: payload.url,
        device,
        fullPage,
        contentType,
        size: sizeKB,
        buffer,
        base64: `data:${contentType};base64,${base64}`,
      });

    } catch (e) {
      results.push({
        status: 'Gagal',
        message: e.message || 'Terjadi kesalahan saat mengambil screenshot... maafkan aku, senpai.',
      });
    }
  }

  return results;
}

// Teste
if (import.meta.url === `file://${process.argv[1]}`) {
  const test = async () => {
    const url = 'https://anisaofc.my.id';
    const modes = ['desktop', 'mobile', 'full'];

    const results = await screenshotWebsite(url, modes);
    return results; // Retorna os resultados em vez de usar console.log
  }

  test().then(results => {
    results.forEach((result, index) => {
      console.log(`\n[ ${modes[index].toUpperCase()} MODE ]`);
      if (result.status === 'Berhasil') {
        console.log(`Screenshot selesai, senpai.`);
        console.log(`URL       : ${result.url}`);
        console.log(`Device    : ${result.device}`);
        console.log(`FullPage  : ${result.fullPage}`);
        console.log(`Ukuran    : ${result.size}`);
        console.log(`Base64    : ${result.base64.slice(0, 80)}...`);
      } else {
        console.log(`...${result.message}`);
      }
    });
  });
}
