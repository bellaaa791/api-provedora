const axios = require("axios");
const cheerio = require("cheerio");
function limparTexto(texto) {
if (!texto) return ""; 
return [...new Set(texto.split(/\s+/))].join(" ").trim();
}
async function pegarPerfil(query) {
try {
const url = `https://cameraprive.com/br/${query}`; 
const { data } = await axios.get(url);
const $ = cheerio.load(data);

const avatar = $("div.header-profile__avatar img").attr("src");


const avaliacao = limparTexto(
$(".header-profile__reviews-text").first().text().trim()
);
const seguidores = limparTexto(
$(".header-profile__reviews-text:contains('Seguidores')")
.text()
.trim()
);
const curtidas = limparTexto(
$(".header-profile__reviews-text:contains('Curtidas')")
.text()
.trim()
);
const ultimoAcesso = limparTexto(
$(".header-profile__about small").text().trim()
);


const sobreMimRaw = $(
".side-profile__item.is-about p.post-timeline__text"
).attr("data-description");

const sobreMim = sobreMimRaw
? sobreMimRaw.replace(/<br\s*\/?>/gi, " ") 
: "";

const hashtags = [];
$(".side-profile__tags-item").each((index, element) => {
const tagTexto = $(element).text().trim();
if (tagTexto) hashtags.push(tagTexto);
});

const hashtagsUnicas = [...new Set(hashtags)];
const conquistas = [];
$(".badges").each((index, element) => {
const titulo = $(element).find("h6.badges__title").text().trim();
const imagemConquista = $(element).find("img.badges__image").attr("src");
if (titulo && imagemConquista) {
conquistas.push({ titulo, imagemConquista });
}
});

const dataCriacaoConta = limparTexto(
$(".header-profile__created").text().trim() || "Data não disponível"
);
const textoFotos = $("a.js-timeline__filter-item[data-type='photo'] span")
.last()
.text();
const textoVideos = $("a.js-timeline__filter-item[data-type='video'] span")
.last()
.text();

const quantidadeFotos = parseInt(textoFotos.replace(/[^\d]/g, ""), 10);
const quantidadeVideos = parseInt(textoVideos.replace(/[^\d]/g, ""), 10);
const postagens = [];
$("article.post-timeline__item").each((index, element) => {
const tipoPostagem = $(element).data("post-type");
const idPostagem = $(element).data("post-id");
let urlMedia = "";
let urlThumb = ""; 
let descricao = "";

if (tipoPostagem === "photo") {
urlMedia = $(element).find(".post-photo__media").attr("src");
urlThumb = $(element).find(".post-photo__thumb img").attr("src"); 
descricao = $(element).find(".post-timeline__link").attr("title") || "";
} else if (tipoPostagem === "video") {
urlMedia = $(element).find("video").attr("src") || $(element).find("img").attr("src");
urlThumb = $(element).find(".post-photo__thumb img").attr("src"); 
descricao = $(element).find(".post-elements__floating").text().trim() || "";
} else if (tipoPostagem === "status") {
descricao = $(element).find(".post-timeline__link").text().trim();
}

if (urlMedia) {
postagens.push({
idPostagem,
tipoPostagem,
urlMedia,
urlThumb, 
descricao,
});
}
});


return {
avatar,
avaliacao,
seguidores,
curtidas,
ultimoAcesso,
sobreMim,
hashtags: hashtagsUnicas,
conquistas,
dataCriacaoConta, 
postagens
};
} catch (error) {
console.error("Erro ao fazer o scrape:", error.message);
return null;
}
}



module.exports = { pegarPerfil }