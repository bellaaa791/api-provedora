const axios = require('axios');
const cheerio = require('cheerio');

async function capturarPerfilCompleto(tagJogador) {
  try {
    const baseUrl = 'https://www.clashofstats.com/players';
    const urlSummary = `${baseUrl}/${tagJogador}/summary`;

    const { data: dataSummary } = await axios.get(urlSummary);
    const $ = cheerio.load(dataSummary);

    const perfil = $('.container_HaVgj');

    const nome = perfil.find('h1.text-h3').text().trim();

    let fotoSrcset = perfil.find('img.playerCharacter_Z8I-R').attr('srcset') || '';
    const fotoRelativa = fotoSrcset.split(' ')[0];
    const foto = fotoRelativa ? `https://www.clashofstats.com${fotoRelativa}` : null;

    const chips = perfil.find('.v-chip .num-val').map((i, el) => $(el).text().trim()).get();

    const xp = perfil.find('.v-chip.xp .body-2').text().trim();
    const trofeuNormal = perfil.find('.v-chip.trophy .body-2').text().trim();
    const trofeuLendario = perfil.find('.v-chip.legend .body-2').text().trim();
    const trofeuConstrutor = perfil.find('.v-chip.versus .body-2').text().trim();
    const estrelasDeGuerra = perfil.find('.v-chip.war-star .body-2').text().trim();
    const doacoesFeitas = perfil.find('.v-chip.donated .body-2').text().trim();
    const doacoesRecebidas = perfil.find('.v-chip.received .body-2').text().trim();

    const ataques = perfil.find('.v-chip.muted-primary .body-2').map((i, el) => $(el).text().trim()).get();
    const idJogador = perfil.find('button[data-clipboard-text]').attr('data-clipboard-text');

    // Requisição 2 - Exército
    const urlArmy = `${baseUrl}/${tagJogador}/army`;
    const { data: dataArmy } = await axios.get(urlArmy);
    const $army = cheerio.load(dataArmy);

    // Heróis
    const heroes = [];
    $army('h2.subsection-title:contains("Heroes")').nextAll('a').each((i, el) => {
      const elem = $army(el);
      const name = elem.attr('aria-label')?.trim();
      const level = parseInt(elem.find('.v-badge__badge').text().trim(), 10) || null;
      const link = elem.attr('href');
      const avatarRelativo = elem.find('img').attr('srcset')?.split(' ')[0];
      const avatar = avatarRelativo ? `https://www.clashofstats.com${avatarRelativo}` : null;
      if (name) heroes.push({ name, level, link, avatar });
    });

    // Equipamentos agrupados por herói
    const equipamentos = [];
    $army('h2.text-overline:contains("Hero Equipment")').next('.row.row--dense').find('.v-card').each((i, card) => {
      const heroi = $army(card).find('.text--secondary').text().trim();
      const iconeRelativo = $army(card).find('.text--secondary img').attr('srcset')?.split(' ')[0];
      const icone = iconeRelativo ? `https://www.clashofstats.com${iconeRelativo}` : null;

      const itens = [];
      $army(card).find('a').each((j, eq) => {
        const elem = $army(eq);
        const nome = elem.attr('aria-label');
        const link = elem.attr('href');
        const nivel = parseInt(elem.find('.v-badge__badge').text().trim(), 10);
        const iconeRel = elem.find('img').attr('srcset')?.split(' ')[0];
        const iconeEquip = iconeRel ? `https://www.clashofstats.com${iconeRel}` : null;

        if (nome) itens.push({ nome, nivel, link, icone: iconeEquip });
      });

      if (heroi && itens.length) {
        equipamentos.push({ heroi, icone, itens });
      }
    });

    // Pets — deve ficar fora do loop dos equipamentos!
    const pets = [];
    $army('h2.text-overline.text--secondary:contains("Pets")').nextAll('a').each((i, el) => {
      const elem = $army(el);
      const nome = elem.attr('aria-label')?.trim();
      const nivel = parseInt(elem.find('.v-badge__badge').text().trim(), 10) || null;
      const link = elem.attr('href');
      const avatarRelativo = elem.find('img').attr('srcset')?.split(' ')[0];
      const avatar = avatarRelativo ? `https://www.clashofstats.com${avatarRelativo}` : null;
      if (nome) pets.push({ nome, nivel, link, avatar });
    });



// Capturar Tropas (Troops)
const troops = [];
$army('h2.subsection-title:contains("Troops")').nextAll('a').each((i, el) => {
  const elem = $army(el);
  const nome = elem.attr('aria-label')?.trim();
  const nivelText = elem.find('.v-badge__badge').text().trim();
  const nivel = nivelText ? parseInt(nivelText, 10) : null;
  const link = elem.attr('href');
  const avatarRelativo = elem.find('img').attr('srcset')?.split(' ')[0];
  const avatar = avatarRelativo ? `https://www.clashofstats.com${avatarRelativo}` : null;
  if (nome) troops.push({ nome, nivel, link, avatar });
});


// Super Troops
const superTroops = [];
$army('h2.text-overline:contains("Super Troops")').nextAll('a').each((i, el) => {
  const elem = $army(el);
  const nome = elem.attr('aria-label')?.trim() || '';

  const nivelText = elem.find('.v-badge__badge').text().trim();
  const nivel = nivelText ? parseInt(nivelText, 10) : null;

  const link = elem.attr('href');

  const avatarRelativo = elem.find('img.gds').attr('srcset')?.split(' ')[0];
  const avatar = avatarRelativo ? `https://www.clashofstats.com${avatarRelativo}` : null;

  if (nome) {
    superTroops.push({ nome, nivel, link, avatar });
  }
});

// Builder Base
const builderBase = [];
$army('h2.text-overline.text--secondary:contains("Builder Base")').nextAll('a').each((i, el) => {
  const elem = $army(el);
  const nome = elem.attr('aria-label')?.trim() || '';

  const nivelText = elem.find('.v-badge__badge').text().trim();
  const nivel = nivelText ? parseInt(nivelText, 10) : null;

  const link = elem.attr('href');

  const avatarRelativo = elem.find('img.gds').attr('srcset')?.split(' ')[0];
  const avatar = avatarRelativo ? `https://www.clashofstats.com${avatarRelativo}` : null;

  if (nome) {
    builderBase.push({ nome, nivel, link, avatar });
  }
});

// Spells
const spells = [];
$army('h2.subsection-title:contains("Spells")').nextAll('a').each((i, el) => {
  const elem = $army(el);
  const nome = elem.attr('aria-label')?.trim() || '';

  const nivelText = elem.find('.v-badge__badge').text().trim();
  const nivel = nivelText ? parseInt(nivelText, 10) : null;

  const link = elem.attr('href');

  const avatarRelativo = elem.find('img.gds').attr('srcset')?.split(' ')[0];
  const avatar = avatarRelativo ? `https://www.clashofstats.com${avatarRelativo}` : null;

  if (nome) {
    spells.push({ nome, nivel, link, avatar });
  }
});

    const resultado = {
      nome,
      idJogador,
      foto,
      chips,
      xp,
      trofeuNormal,
      trofeuLendario,
      trofeuConstrutor,
      estrelasDeGuerra,
      doacoesFeitas,
      doacoesRecebidas,
      ataquesBemSucedidos: {
        ataque1: ataques[0] || null,
        ataque2: ataques[1] || null
      },
      heroes,
      equipamentos,
      pets,
      troops,
      superTroops,
      builderBase,
      spells
    };
return resultado
//    console.log(resultado);
  } catch (err) {
    console.error('Erro ao capturar perfil completo:', err.message);
  }
}

module.exports = {capturarPerfilCompleto }
