const axios = require("axios");
const cheerio = require("cheerio");

async function fetchAllCNNBrasil() {
try {
const url = "https://www.cnnbrasil.com.br/";
const { data: html } = await axios.get(url, {
headers: { "User-Agent": "Mozilla/5.0" }
});

const $ = cheerio.load(html);

// Seleciona todos os blocos que correspondem ao container que quer
const containers = $(".border-t.border-neutral-300.py-8.lg\\:border-t-0.lg\\:py-0");

const results = [];

containers.each((i, container) => {
const c = $(container);
const figure = c.find("figure.group").first();

// Manchete principal
const mainLink = figure.find("> a").attr("href");
const mainImg = figure.find("> a picture img").attr("src");
const mainTitle = figure.find("figcaption h2").text().trim();

// Sub notícias (lista ul dentro do figure, e lista fora do figure)
const subNews = [];

// Sub notícias dentro do figure > ul
figure.find("> ul li a").each((_, el) => {
const el$ = $(el);
const link = el$.attr("href");
const title = el$.find("h3").text().trim();
subNews.push({ link, title });
});

// Sub notícias no ul irmão (após figure)
c.find("> ul li a").each((_, el) => {
const el$ = $(el);
const link = el$.attr("href");
const title = el$.find("h3").text().trim();
// Evita duplicados já que as sub notícias às vezes repetem
if (!subNews.find(s => s.link === link)) {
subNews.push({ link, title });
}
});

results.push({
main: {
link: mainLink,
image: mainImg,
title: mainTitle
},
subNews
});
});

return results;

} catch (error) {
console.error("Erro ao buscar CNN Brasil:", error.message);
return null;
}
}

module.exports = { fetchAllCNNBrasil }