const axios = require("axios");
const cheerio = require("cheerio");

async function fetchDataxvideos(query) {
try {

const url = "https://www.xvideos.com/" + query;
const { data } = await axios.get(url);
const $ = cheerio.load(data);
const fotoPerfil = $(".profile-pic img").attr("src") || "Não encontrado"; 
const usuario = $(".text-danger").first().text().trim(); 
const visualizacoesVideo = $("#pinfo-videos-views span").text().trim(); 
const inscritos = $("#pinfo-subscribers span").text().trim(); 
const descricao = $("#header-about-me").text().trim(); 
const qtdVideos = $(".xv-slim-tab-btn span.count").eq(0).text().trim() || "0"; 
const qtdVideosRed = $(".xv-slim-tab-btn.premium span.ticket-in").text().trim() || "0"; 
const visualizacoesPerfil = $("#pinfo-profile-hits span").text().trim();
const idiomas = $("#pinfo-languages span").text().trim(); 
const dataRegistro = $("#pinfo-signedup span").text().trim();
const ultimaAtividade = $("#pinfo-lastactivity span").text().trim(); 
const responseBio = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pt&dt=t&q=${descricao}`);
const databio = await responseBio.json();
const resulttbio = databio[0][0][0];


const responseUltimo = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=pt&dt=t&q=${ultimaAtividade}`);
const dataultima = await responseUltimo.json();
const resulttultimo = dataultima[0][0][0];


const resultado = {
Foto_perfil: fotoPerfil,
Usuário: usuario,
Visualizações_de_vídeo: visualizacoesVideo,
Inscritos: inscritos,
Descrição: resulttbio,
Quantidade_de_vídeos: qtdVideos,
Quantidade_de_vídeos_no_RED: qtdVideosRed,
Visualizações_do_perfil: visualizacoesPerfil,
Idiomas: idiomas,
Data_de_registro: dataRegistro,
Última_atividade: resulttultimo
};


return resultado;
} catch (error) {
console.error("Erro ao capturar informações:", error.message);
return { Erro: error.message };
}
}

module.exports = { fetchDataxvideos };
