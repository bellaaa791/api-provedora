const axios = require('axios')
const cheerio = require('cheerio')
async function buscarFilmes(nome) {
  const nomeEncoded = encodeURIComponent(nome);
  const [res1, res2] = await Promise.all([
    axios.get(`https://v3.sg.media-imdb.com/suggestion/x/${nomeEncoded}.json?includeVideos=1`),
    axios.get(`https://v3.sg.media-imdb.com/suggestion/x/${nomeEncoded}.json?includeVideos=2`)
  ]);
  const mapa = new Map();
  [...res1.data.d, ...res2.data.d].forEach(item => {
    const existente = mapa.get(item.id);
    if (existente) {
      if (item.v && existente.v) {
        existente.v.push(...item.v.filter(v => !existente.v.some(ev => ev.id === v.id)));
      } else if (item.v) {
        existente.v = item.v;
      }
    } else {
      mapa.set(item.id, { ...item });
    }
  });
  const filmes = {
    resultado: await Promise.all(Array.from(mapa.values()).map(async item => ({
    id: item.id,
    titulo: item.l,
    tipo: item.q,
    tipoId: item.qid,
    ano: item.y || null,
    rank: item.rank || null,
    elenco: item.s || null,
    imagem: item.i ? {
      url: item.i.imageUrl,
      largura: item.i.width,
      altura: item.i.height
    } : null,
    trailers: item.v ? await Promise.all(item.v.map(async video => ({
      id: video.id,
      titulo: video.l,
      duracao: video.s,
      imagem: {
        url: video.i.imageUrl,
        largura: video.i.width,
        altura: video.i.height
      },
    }))) : []
  })))};
  //console.log(filmes)
  return filmes;
}
//buscarFilmes('Vis a Vis')
module.exports = { buscarFilmes }