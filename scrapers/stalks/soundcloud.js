const axios = require("axios");
const cheerio = require("cheerio");

async function obterDadosPerfilSoundCloud(url) {
try {
const { data } = await axios.get(url, {
headers: {
"User-Agent": "Mozilla/5.0"
}
});

const $ = cheerio.load(data);

const nomeUsuario = $("h1").first().text().trim();
const fotoPerfil = $("div.RatioBox_InnerBox__M7kq9 img").attr("src");

const metadados = $("div.Metadata_MetadataLabel__3GU8Y").map((_, el) => $(el).text().trim()).get();
const seguidores = metadados.length > 0 ? metadados[0].replace(/ Followers/, "") : "Não encontrado";
const seguindo = metadados.length > 1 ? metadados[1].replace(/ Following/, "") : "Não encontrado";


const faixas = [];
$("div[data-testid='cell-entity']").each((_, el) => {
const tituloFaixa = $(el).find("div.Information_CellTitle__2KitR").text().trim();
const imagemFaixa = $(el).find("img").attr("src");
const reproducoes = $(el).find("div.Metadata_MetadataLabel__3GU8Y").first().text().trim(); 

faixas.push({
titulo: tituloFaixa,
imagem: imagemFaixa,
reproducoes: reproducoes
});
});

return {
nomeUsuario,
fotoPerfil,
seguidores,
seguindo,
faixas
};

} catch (erro) {
console.error("Erro ao buscar os dados:", erro.message);
return [];
}
}


module.exports = { obterDadosPerfilSoundCloud }