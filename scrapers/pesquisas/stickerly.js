const axios = require('axios');

async function buscarStickerly(query) {
  try {


    const { data } = await axios.post('https://api.sticker.ly/v4/stickerPack/smartSearch', {
      keyword: query,
      enabledKeywordSearch: true,
      filter: {
        extendSearchResult: false,
        sortBy: 'RECOMMENDED',
        languages: ['ALL'],
        minStickerCount: 5,
        searchBy: 'ALL',
        stickerType: 'ALL'
      }
    }, {
      headers: {
        'user-agent': 'androidapp.stickerly/3.17.0 (Redmi Note 4; U; Android 29; in-ID; id;)',
        'content-type': 'application/json',
        'accept-encoding': 'gzip'
      }
    });

    const resultados = data.result.stickerPacks.map(pack => ({
      nome: pack.name,
      autor: pack.authorName,
      quantidade: pack.resourceFiles.length,
      views: pack.viewCount,
      exports: pack.exportCount,
      pago: pack.isPaid,
      animado: pack.isAnimated,
      thumbnail: `${pack.resourceUrlPrefix}${pack.resourceFiles[pack.trayIndex]}`,
      url: pack.shareUrl
    }));

    return resultados;
  } catch (err) {
    throw new Error(err.message);
  }
}

module.exports = { buscarStickerly }