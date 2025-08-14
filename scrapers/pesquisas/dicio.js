const axios = require('axios');
const cheerio = require('cheerio');



async function scrapeDicio(query) {
  try {
  const url = `https://www.dicio.com.br/${query}`
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const resultados = [];

    // Classe gramatical simples
    const classeGramaticalSimples = $('span.cl').first().text().trim();
    resultados.push({ tipo: 'classe_gr', conteudo: classeGramaticalSimples });

    // Bloco adicional completo (único p.adicional)
    const adicionalHTML = $('p.adicional').html();
    const adicionalTexto = $('p.adicional').text().trim().replace(/\s+/g, ' ');

    resultados.push({ tipo: 'adicional_texto', conteudo: adicionalTexto });

    // Extrair características via regex com limites claros
    const texto = adicionalTexto;

    const classeGramaticalMatch = texto.match(/Classe gramatical:\s*([^S]+?)\s*(?=Separação silábica|$)/);
    const silabicaMatch = texto.match(/Separação silábica:\s*([^\s]+)\s*/);
    const pluralMatch = texto.match(/Plural:\s*([^\s]+)\s*/);
    const letrasMatch = texto.match(/Possui (\d+) letras/);

    const vogaisMatch = texto.match(/Possui as vogais:\s*([a-z\s]+?)\s*Possui as consoantes:/i);
    const consoantesMatch = texto.match(/Possui as consoantes:\s*([a-z\s]+?)\s*A palavra escrita ao contrário:/i);

    const invertidaMatch = texto.match(/palavra escrita ao contrário:\s*([^\s]+)/i);

    const caracteristicas = {
      classe_gramatical: classeGramaticalMatch ? classeGramaticalMatch[1].trim() : null,
      silabica: silabicaMatch ? silabicaMatch[1].trim() : null,
      plural: pluralMatch ? pluralMatch[1].trim() : null,
      letras: letrasMatch ? letrasMatch[1].trim() : null,
      vogais: vogaisMatch ? vogaisMatch[1].trim() : null,
      consoantes: consoantesMatch ? consoantesMatch[1].trim() : null,
      invertida: invertidaMatch ? invertidaMatch[1].trim() : null,
    };

    resultados.push({ tipo: 'caracteristicas', conteudo: caracteristicas });

    // Sinônimos
    const sinonimos = [];
    $('p.sinonimos a').each((i, el) => {
      sinonimos.push($(el).text().trim());
    });
    if (sinonimos.length) resultados.push({ tipo: 'sinonimos', conteudo: sinonimos });

    // Antônimos
    const antonimos = [];
    $('p.antonimos a').each((i, el) => {
      antonimos.push($(el).text().trim());
    });
    if (antonimos.length) resultados.push({ tipo: 'antonimos', conteudo: antonimos });

    // Imagem
    const imagem = $('img.imagem-palavra').attr('src');
    if (imagem) resultados.push({ tipo: 'imagem', conteudo: imagem });

    // Função para extrair listas de texto (com ou sem <a>)
    function extrairLista($ul) {
      const lista = [];
      $ul.find('li').each((i, el) => {
        const texto = $(el).text().trim();
        if (texto) lista.push(texto);
      });
      return lista;
    }

    // Rimas e Anagramas
    const wrapSections = $('div.wrap-section');
    let rimas = [];
    let anagramas = [];

    wrapSections.each((i, section) => {
      const titulo = $(section).find('h3.tit-other').text().trim().toLowerCase();

      if (titulo.includes('rimas com amor')) {
        const ul = $(section).find('ul.list');
        rimas = extrairLista(ul);
      }

      if (titulo.includes('anagramas de amor')) {
        const ul = $(section).find('ul.list');
        anagramas = extrairLista(ul);
      }
    });

    if (rimas.length) resultados.push({ tipo: 'rimas', conteudo: rimas });
    if (anagramas.length) resultados.push({ tipo: 'anagramas', conteudo: anagramas });

    // Significado da palavra (texto dividido em spans)
    const significadoSpans = [];
    $('p.significado.textonovo > span').each((i, el) => {
      // Remove spans vazios ou só com classes específicas que não interessam
      const textoSpan = $(el).text().trim();
      if (textoSpan) significadoSpans.push(textoSpan);
    });

    const significadoCompleto = significadoSpans.join(' ');
    resultados.push({ tipo: 'significado', conteudo: significadoCompleto });

//    console.log(resultados);
    return resultados
  } catch (err) {
    console.error('Erro:', err.message);
  }
}

//scraper('sexo');
module.exports = { scrapeDicio }