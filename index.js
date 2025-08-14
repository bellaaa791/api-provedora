const express = require('express');
const axios = require('axios')
const { Loggings } = require('loggings');
const logger = new Loggings("instance");
logger.config({
register_dir: "./Logs",
});

const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const pino = require("pino");
const readline = require('readline');
const { Boom } = require('@hapi/boom');
const makeWASocket = require("@whiskeysockets/baileys").default;
const { prepareWAMessageMedia, proto, isJidNewsletter } = require("@whiskeysockets/baileys");

const {
DisconnectReason,
useMultiFileAuthState,
Browsers,
jidDecode,
generateMessageID
} = require("baileys-pro");

const app = express();
const port = 7025;

// Permitir enviar arquivos grandes
app.use(express.raw({ type: '*/*', limit: '100mb' }));

// Página de upload simples
app.get('/', (req, res) => {
res.send(`
<!DOCTYPE html>
<html lang="pt-br">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Dashboard de APIs</title>
<style>
body {
font-family: sans-serif;
margin: 0;
background-color: #121212;
color: #f0f0f0; 
transition: background-color 0.3s ease, color 0.3s ease;
}

.light-theme {
background-color: #f0f0f0;
color: #121212;
}

.dashboard-container {
display: flex;
flex-direction: column;
min-height: 100vh;
}

header {
padding: 20px;
text-align: center; 
}

header h1 {
color: #8e44ad;
margin-bottom: 20px;
}

header h1.light-theme {
color: #9b59b6;
}

.theme-toggle {
text-align: right; 
padding: 10px 20px;
}

#theme-button {
background-color: #8e44ad;
color: #f0f0f0;
border: none;
padding: 10px 15px;
border-radius: 5px;
cursor: pointer;
transition: background-color 0.3s ease;
}

#theme-button.light-theme {
background-color: #9b59b6;
color: #333;
}

#theme-button:hover {
background-color: #7a3a9d;
}

#theme-button.light-theme:hover {
background-color: #8c4eb0;
}

.cards-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(270px, 1fr)); 
gap: 20px;
padding: 20px;
}

.card {
background-color: #212121;
color: #f0f0f0;
padding: 20px;
border-radius: 5px;
}

.card.light-theme {
background-color: #e0e0e0;
color: #333;
}

.card h3 {
margin-top: 0;
color: #f0f0f0;
}

.card.light-theme h3 {
color: #333;
}

.card-content {
margin-top: 15px;
}

.status-indicator {
display: inline-block;
width: 10px;
height: 10px;
border-radius: 50%;
margin-right: 5px;
}

 .card-content button {
background-color:
color: #f0f0f0; 
border: none; 
padding: 10px 15px; 
border-radius: 5px; 
cursor: pointer;
transition: background-color 0.3s ease;
margin-top: 10px; 
}

.card-content button:hover {
background-color: #7a3999; 
}

.card-content button:active {
background-color: #662e85; 
}

.card-content button.light-theme {
background-color: #9b59b6;
color: #333;
}

.card-content button:hover {
background-color: #7a3a9d;
}

.card-content button.light-theme:hover {
background-color: #8c4eb0;
}

.api-searches-title {
padding: 0 20px;
margin-top: 30px;
text-align: center;
color: #8e44ad; 
}

.api-searches-grid {
display: grid;
grid-template-columns: repeat(auto-fit, minmax(270px, 1fr));
gap: 20px;
padding: 20px;
}

.api-card {
background-color: #212121;
color: #f0f0f0;
padding: 20px;
border-radius: 5px;
}

.api-card.light-theme {
background-color: #e0e0e0;
color: #333;
}

.api-card h3 {
margin-top: 0;
color: #f0f0f0;
}

.api-card.light-theme h3 {
color: #333;
}

.api-card p {
margin-top: 10px;
margin-bottom: 15px;
}

.api-card button {
background-color: #8e44ad; 
color: #f0f0f0;
border: none;
padding: 10px 15px;
border-radius: 5px;
cursor: pointer;
transition: background-color 0.3s ease;
text-decoration: none; 
}

.api-card button.light-theme {
background-color: #9b59b6;
color: #333;
}

.api-card button:hover {
background-color: #7a3a9d;
}

.api-card button.light-theme:hover {
background-color: #8c4eb0;
}
</style>
</head>
<body>
<div class="dashboard-container">
<header>
<h1>Dashboard</h1>
</header>
<div class="theme-toggle">
<button id="theme-button">Tema Claro</button>
</div>

 
 
<h1 class="api-searches-title">links importantes</h1>
<div class="api-searches-grid">
<div class="api-card">
<h3>Canal no whatsapp</h3>
<p>Acesse nosso canal no whatsapp</p>
<button onclick="window.location.href='https://whatsapp.com/channel/0029VbBHcwqAYlUI1JmRix3V'">Usar</button>
</div>
<div class="api-card">
<h3>Grupo do whatsapp</h3>
<p>Acesse nosso grupo do whatsapp</p>
<button onclick="window.location.href='https://chat.whatsapp.com/HFPLRKCZBcu9m0xHVNWfqz'">Usar</button>
</div>

<div class="api-card">
<h3>Canal do youtube</h3>
<p>Acesse nosso canal do youtube</p>
<button onclick="window.location.href='https://www.youtube.com/@Mabel-h4n'">Usar</button>
</div>


<div class="api-card">
<h3>Suporte</h3>
<p>Relate ao suporte algum problema</p>
<button onclick="window.location.href='https://wa.me/553285076326'">Usar</button>
</div>

</div>


<h1 class="api-searches-title">Apis de ferramentas</h1>
<div class="api-searches-grid">
<div class="api-card">
<h3>EncodeBinary</h3>
<p>Transforme textos comuns em textos binários</p>
<button onclick="window.location.href='/ferramentas/encodebinary?texto=obsidian apis'">Usar</button>
</div>
<div class="api-card">
<h3>Unbinary</h3>
<p>Transforme textos binários em texto normal</p>
<button onclick="window.location.href='/ferramentas/unbinary?texto=1101111 1100010 1110011 1101001 1100100 1101001 1100001 1101110 100000 1100001 1110000 1101001 1110011'">Usar</button>
</div>

<div class="api-card">
<h3>Fazernick</h3>
<p>Transforme textos com diversos estilos!</p>
<button onclick="window.location.href='/ferramentas/fazernick?texto=obsidian apis'">Usar</button>
</div>


 <div class="api-card">
<h3>SPAM ngl</h3>
<p>Envie a mesma mensagem varias vezes sem parar para um link ngl</p>
<button onclick="window.location.href='/ferramentas/spam_ngl?texto=TOKYO_TESTE&mensagem=obsidian apis&quantidade=10'">Usar</button>
</div>


 <div class="api-card">
<h3>SSWEB</h3>
<p>Obtenha a captura de tela de um site em tempo real!</p>
<button onclick="window.location.href='/ferramentas/ssweb?texto=https://google.com'">Usar</button>
</div>


 <div class="api-card">
<h3>Piadas</h3>
<p>Obtenha piadas com diversas categorias listadas no início do resultado json!</p>
<button onclick="window.location.href='/ferramentas/piadas'">Usar</button>
</div>


 <div class="api-card">
<h3>Frases para perfil</h3>
<p>Obtenha frases de perfil com diversas categorias listadas no início do resultado json!</p>
<button onclick="window.location.href='/ferramentas/frases'">Usar</button>
</div>


 <div class="api-card">
<h3>Info país</h3>
<p>Obtenha informações e estatísticas de um país!</p>
<button onclick="window.location.href='/ferramentas/info_pais?texto=Brasil'">Usar</button>
</div>

 <div class="api-card">
<h3>Remini</h3>
<p>Melhore a qualidade de uma imagem através do link dela!</p>
<button onclick="window.location.href='/ferramentas/remini?texto=https://files.catbox.moe/zthob7.jpg'">Usar</button>
</div>










</div>









<h1 class="api-searches-title">Apis de pesquisas</h1>
<div class="api-searches-grid">
<div class="api-card">
<h3>Amazon</h3>
<p>Pesquisa e obtenha informações de um produto da amazon</p>
<button onclick="window.location.href='/pesquisas/amazon?texto=alexa'">Usar</button>
</div>

<div class="api-card">
<h3>Get mods apk</h3>
<p>Pesquisa e obtenha informações de um mod para tal aplicativo.</p>
<button onclick="window.location.href='/pesquisas/getmodsapk?texto=netflix'">Usar</button>
</div>

<div class="api-card">
<h3>tekmods</h3>
<p>Pesquisa e obtenha informações de um mod para tal aplicativo.</p>
<button onclick="window.location.href='/pesquisas/tekmods?texto=netflix'">Usar</button>
</div>


<div class="api-card">
<h3>Youtube</h3>
<p>Pesquisa e obtenha resultados de um vídeo do YouTube</p>
<button onclick="window.location.href='/pesquisas/youtube?texto=latino americano'">Usar</button>
</div>

<div class="api-card">
<h3>Pensador</h3>
<p>Pesquisa e obtenha resultados de uma frase filosófica</p>
<button onclick="window.location.href='/pesquisas/pensador?pensador=amor'">Usar</button>
</div>

<div class="api-card">
<h3>Versículo</h3>
<p>Pesquisa e obtenha o resultado de um versículo!</p>
<button onclick="window.location.href='/pesquisas/versiculo?texto=Marcos: 12:30'">Usar</button>
</div>


<div class="api-card">
<h3>Toda matéria</h3>
<p>Pesquisa e obtenha o resultados de uma matéria e todo o seu conteúdo para ajudar nos seus estudos!</p>
<button onclick="window.location.href='/pesquisas/todamateria?texto=Briofitas'">Usar</button>
</div>


<div class="api-card">
<h3>Letra</h3>
<p>Pesquisa e obtenha resultados e a letra de uma música</p>
<button onclick="window.location.href='/pesquisas/letra?texto=latino americano drinho sp'">Usar</button>
</div>


<div class="api-card">
<h3>GoodReads</h3>
<p>Pesquisa e obtenha resultados sobre um livro</p>
<button onclick="window.location.href='/pesquisas/goodreads?texto=a rainha vermelha'">Usar</button>
</div>



 <div class="api-card">
<h3>DDD</h3>
<p>Pesquisa e obtenha resultados de um DDD</p>
<button onclick="window.location.href='/pesquisas/ddd?texto=33'">Usar</button>
</div>

 <div class="api-card">
<h3>AppleMusic</h3>
<p>Pesquisa e obtenha resultados de uma música no appleMusic</p>
<button onclick="window.location.href='/pesquisas/applemusic?texto=papoulas'">Usar</button>
</div>


 <div class="api-card">
<h3>Dicionário </h3>
<p>Pesquisa e obtenha resultados sobre uma palavra do dicionário</p>
<button onclick="window.location.href='/pesquisas/dicio?texto=amor'">Usar</button>
</div>


 <div class="api-card">
<h3>Sticker.ly </h3>
<p>Pesquisa e obtenha resultados de stickers no sticker.ly</p>
<button onclick="window.location.href='/pesquisas/stickerly?texto=gato'">Usar</button>
</div> 

 <div class="api-card">
<h3>Gnulahd</h3>
<p>Pesquisa e obtenha resultados de um filme</p>
<button onclick="window.location.href='/pesquisas/gnulahd?texto=minions'">Usar</button>
</div>

 
 <div class="api-card">
<h3>Imdb</h3>
<p>Pesquisa e obtenha resultados de um filme</p>
<button onclick="window.location.href='/pesquisas/imdb?texto=Vis a vis'">Usar</button>
</div>


 <div class="api-card">
<h3>GrupoWhatsapp</h3>
<p>Pesquisa e obtenha resultados sobre um grupo de whatsapp</p>
<button onclick="window.location.href='/pesquisas/grupowhatsapp?texto=Amizade'">Usar</button>
</div>

 <div class="api-card">
<h3>Sticker pack</h3>
<p>Pesquisa e obtenha resultados de um pack de stickers</p>
<button onclick="window.location.href='/pesquisas/stickerpack?texto=Coreana'">Usar</button>
</div>

 <div class="api-card">
<h3>Steam jogo</h3>
<p>Pesquisa e obtenha resultados de um jogo na steam</p>
<button onclick="window.location.href='/pesquisas/steamjogo?texto=need for speed'">Usar</button>
</div>

 

 <div class="api-card">
<h3>Piracanjuba</h3>
<p>Pesquisa e obtenha resultados sobre uma receita</p>
<button onclick="window.location.href='/pesquisas/piracanjuba?texto=alasanha'">Usar</button>
</div>


 <div class="api-card">
<h3>Dafont</h3>
<p>Pesquisa e obtenha resultados sobre uma fonte de texto</p>
<button onclick="window.location.href='/pesquisas/dafont?texto=block'">Usar</button>
</div>


 <div class="api-card">
<h3>Happymod</h3>
<p>Pesquisa e obtenha resultados sobre um jogo no happymod</p>
<button onclick="window.location.href='/pesquisas/happymod?texto=freefire'">Usar</button>
</div>

 <div class="api-card">
<h3>Npmjs</h3>
<p>Pesquisa e obtenha resultados sobre um modulo no site npmjs</p>
<button onclick="window.location.href='/pesquisas/npmjs?texto=axios'">Usar</button>
</div>

 <div class="api-card">
<h3>xvideos</h3>
<p>Pesquisa e obtenha resultados sobre um vídeo do xvideos</p>
<button onclick="window.location.href='/pesquisas/xvideos?texto=Brasil'">Usar</button>
</div>


 <div class="api-card">
<h3>Pornhub</h3>
<p>Pesquisa e obtenha resultados sobre um vídeo do pornhub</p>
<button onclick="window.location.href='/pesquisas/pornhub?texto=lesbicas tribing'">Usar</button>
</div>


 <div class="api-card">
<h3>Erome</h3>
<p>Pesquisa e obtenha resultados sobre um vídeo do erome</p>
<button onclick="window.location.href='/pesquisas/erome?texto=lesbicas'">Usar</button>
</div>

<div class="api-card">
<h3>Pinterest Imagem</h3>
<p>Pesquisa e obtenha imagens de algo</p>
<button onclick="window.location.href='/pesquisas/pinterest?texto=gatos'">Usar</button>
</div>

<div class="api-card">
<h3>Hentai tv</h3>
<p>Pesquisa e obtenha resultados do hentai tv</p>
<button onclick="window.location.href='/pesquisas/hentaiTv?texto=loli'">Usar</button>
</div>




</div>



<h1 class="api-searches-title">Apis de stalks</h1>
<div class="api-searches-grid">

 <div class="api-card">
<h3>Free fire</h3>
<p>Obtenha informações de uma conta do free fire</p>
<button onclick="window.location.href='/stalks/ff?texto=62875162'">Usar</button>
</div>


 <div class="api-card">
<h3>Clash of clans</h3>
<p>Obtenha informações de uma conta do Clash of clans</p>
<button onclick="window.location.href='/stalks/clashofclans?texto=G980CL9Q'">Usar</button>
</div>

<div class="api-card">
<h3>Kwai</h3>
<p>Obtenha informações de uma conta do kwai</p>
<button onclick="window.location.href='/stalks/kwai?texto=netflixbrasil'">Usar</button>
</div>

<div class="api-card">
<h3>Wattpad</h3>
<p>Obtenha informações de uma conta do wattpad</p>
<button onclick="window.location.href='/stalks/wattpad?texto=KRafyra'">Usar</button>
</div>

<div class="api-card">
<h3>Github</h3>
<p>Obtenha informações de uma conta do github</p>
<button onclick="window.location.href='/stalks/kwai?texto=Tokyoksk'">Usar</button>
</div>

<div class="api-card">
<h3>Minecraft</h3>
<p>Obtenha informações de uma conta do minecraft</p>
<button onclick="window.location.href='/stalks/kwai?texto=vinicius13'">Usar</button>
</div>

<div class="api-card">
<h3>Snapchat</h3>
<p>Obtenha informações de uma conta do snapchat</p>
<button onclick="window.location.href='/stalks/snapchat?texto=anittaofficial'">Usar</button>
</div>

<div class="api-card">
<h3>youtube</h3>
<p>Obtenha informações de uma conta do youtube</p>
<button onclick="window.location.href='/stalks/youtube?texto=netflixbrasil'">Usar</button>
</div>

<div class="api-card">
<h3>Xvideos</h3>
<p>Obtenha informações de uma conta do xvideos</p>
<button onclick="window.location.href='/stalks/xvideos?texto=raissaconte_official'">Usar</button>
</div>

<div class="api-card">
<h3>Pornhub</h3>
<p>Obtenha informações de uma conta do pornhub</p>
<button onclick="window.location.href='/stalks/pornhub?texto=safadinha'">Usar</button>
</div>

<div class="api-card">
<h3>Erome</h3>
<p>Obtenha informações de uma conta do erome</p>
<button onclick="window.location.href='/stalks/erome?texto=safadinha'">Usar</button>
</div>

<div class="api-card">
<h3>Camera privê</h3>
<p>Obtenha informações de uma conta do camera privê</p>
<button onclick="window.location.href='/stalks/cameraprive?texto=safadinha'">Usar</button>
</div>



</div>


<h1 class="api-searches-title">Apis de downloads</h1>
<div class="api-searches-grid">
<div class="api-card">
<h3>Facebook</h3>
<p>Baixe vídeos do facebook através do link </p>
<button onclick="window.location.href='/dl/facebook?texto=https://www.facebook.com/watch/?v=308871028426451'">Usar</button>
</div>
 <div class="api-card">
<h3>Capcut</h3>
<p>Baixe vídeos do capcut através do link </p>
<button onclick="window.location.href='/dl/capcut?texto=https://www.capcut.com/t/Zs8atG293/'">Usar</button>
</div>
 <div class="api-card">
<h3>Pinterest</h3>
<p>Baixe vídeos do pointerest através do link </p>
<button onclick="window.location.href='/dl/pinterest?texto=https://pin.it/4bOdHRyJP'">Usar</button>
</div>
 <div class="api-card">
<h3>pinterest V2</h3>
<p>Baixe vídeos do pinterest através do link </p>
<button onclick="window.location.href='/dl/pinterestv2?texto=https://pin.it/4bOdHRyJP'">Usar</button>
</div>

<div class="api-card">
<h3>pinterest V3</h3>
<p>Baixe vídeos do pinterest através do link </p>
<button onclick="window.location.href='/dl/pinterestv3?texto=https://pin.it/4bOdHRyJP'">Usar</button>
</div>
 <div class="api-card">
<h3>Tiktok</h3>
<p>Baixe vídeos do tiktok através do link </p>
<button onclick="window.location.href='/dl/tiktok?texto=https://vm.tiktok.com/ZMSPFteGy/'">Usar</button>
</div>
 <div class="api-card">
<h3>Tiktok V2</h3>
<p>Baixe vídeos do tiktok através do link </p>
<button onclick="window.location.href='/dl/tiktok_videov2?texto=https://vm.tiktok.com/ZMSPFteGy/'">Usar</button>
</div>
 <div class="api-card">
<h3>Tiktok audio</h3>
<p>Baixe audios do tiktok através do link </p>
<button onclick="window.location.href='/dl/tiktok_audiov2?texto=https://vm.tiktok.com/ZMSPFteGy/'">Usar</button>
</div>
 
 <div class="api-card">
<h3>Instagram</h3>
<p>Baixe vídeos do instagram através do link </p>
<button onclick="window.location.href='/dl/instagram?texto=https://www.instagram.com/reel/DJnaBcJtyYu/?igsh=djQ4aDN2d2NsMmg='">Usar</button>
</div>


 <div class="api-card">
<h3>Youtube mp4</h3>
<p>Baixe vídeos do youtube através do link </p>
<button onclick="window.location.href='/dl/youtube?texto=https://youtu.be/V2Bail4Iag8?si=w7sR8FkkZQigFB15'">Usar</button>
</div>

 <div class="api-card">
<h3>Youtube mp3</h3>
<p>Baixe áudios do youtube através do link </p>
<button onclick="window.location.href='/dl/youtube_audio?texto=https://youtu.be/V2Bail4Iag8?si=w7sR8FkkZQigFB15'">Usar</button>
</div>

<div class="api-card">
<h3>Spotify mp3</h3>
<p>Baixe áudios do spotify através do link </p>
<button onclick="window.location.href='/dl/spotify?texto=https://open.spotify.com/track/1daDRI9ahBonbWD8YcxOIB?si=a80d133e059d4aa6'">Usar</button>
</div>

<div class="api-card">
<h3>soundcloud mp3</h3>
<p>Baixe áudios do soundcloud através do link </p>
<button onclick="window.location.href='/dl/soundcloud?texto=https://on.soundcloud.com/nIUYuwXHMn2LLZZX0o'">Usar</button>
</div>

<div class="api-card">
<h3>terabox imagem</h3>
<p>Baixe imagens do terabox através do link </p>
<button onclick="window.location.href='/dl/terabox?texto=https://1024terabox.com/s/1eMGgziykka1knXWtea6Psg'">Usar</button>
</div>


<div class="api-card">
<h3>theads download</h3>
<p>Baixe vídeos do theads através do link </p>
<button onclick="window.location.href='/dl/theads?texto=https://www.threads.com/@jdm.mobil/post/DEw5w8sPbAa?xmt=AQF0xVET9H7p2KpmMImlMiryoTeHZdN_13MO9QuQQsS2Uw'">Usar</button>
</div>
</div>


<h1 class="api-searches-title">Apis de consultas</h1>
<div class="api-searches-grid">


<div class="api-card">
<h3>Cpf full</h3>
<p>Obtenha resultados de um cpf (tudo conforme as leis)</p>
<button onclick="window.location.href='/consultas/cpf_full?texto=29223067553'">Usar</button>
</div>


<div class="api-card">
<h3>Cpf</h3>
<p>Obtenha resultados de um cpf (tudo conforme as leis)</p>
<button onclick="window.location.href='/consultas/cpf?texto=453.178.287-91'">Usar</button>
</div>

<div class="api-card">
<h3>Cpf serasa</h3>
<p>Obtenha resultados de um cpf (tudo conforme as leis)</p>
<button onclick="window.location.href='/consultas/cpf_serasa?texto=79857019234'">Usar</button>
</div>

<div class="api-card">
<h3>Cpf Credilink</h3>
<p>Obtenha resultados de um cpf (tudo conforme as leis)</p>
<button onclick="window.location.href='/consultas/cpf_credilink?texto=453.178.287-91'">Usar</button>
</div>

<div class="api-card">
<h3>Cpf Spini</h3>
<p>Obtenha resultados de um cpf (tudo conforme as leis)</p>
<button onclick="window.location.href='/consultas/cpf_spini?texto=03908935016'">Usar</button>
</div>


<div class="api-card">
<h3>Cnpj </h3>
<p>Obtenha resultados de um cnpj (tudo conforme a lei)</p>
<button onclick="window.location.href='/consultas/cnpj?texto=27865757000102'">Usar</button>
</div>


 <div class="api-card">
<h3>Placa </h3>
<p>Obtenha resultados de uma placa de veículo (tudo conforme a lei)</p>
<button onclick="window.location.href='/consultas/placa?texto=EBM9143'">Usar</button>
</div>

 <div class="api-card">
<h3>CNH amazonas </h3>
<p>Obtenha resultados de uma CNH do Amazonas(tudo conforme a lei)</p>
<button onclick="window.location.href='/consultas/cnh_amazonas?texto=91661641253'">Usar</button>
</div>


 <div class="api-card">
<h3>Nome Serasa</h3>
<p>Obtenha resultados de um nome (tudo conforme a lei)</p>
<button onclick="window.location.href='/consultas/nome_serasa?texto=Sandra Maria Batista dos Santos'">Usar</button>
</div>

 <div class="api-card">
<h3>Nome mãe</h3>
<p>Obtenha resultados de um nome (tudo conforme a lei)</p>
<button onclick="window.location.href='/consultas/nome_mae?texto=Maria'">Usar</button>
</div>



 <div class="api-card">
<h3>Rg</h3>
<p>Obtenha resultados de um rg (tudo conforme a lei)</p>
<button onclick="window.location.href='/consultas/rg?texto=272819'">Usar</button>
</div>





</div>


 <h1 class="api-searches-title">Apis de IAS</h1>
<div class="api-searches-grid">
<div class="api-card">
<h3>Gemini texto</h3>
<p>Obtenha resultados e converse com a ia de texto do gemini</p>
<button onclick="window.location.href='/ias/gemini?texto=olá'">Usar</button>
</div>

<div class="api-card">
<h3>Blackbox texto</h3>
<p>Obtenha resultados e converse com a ia de texto do blackbox</p>
<button onclick="window.location.href='/ias/blackbox?texto=Que dia é hoje e quantas bactérias tem em um celular aproximadamente?'">Usar</button>
</div>



<div class="api-card">
<h3>Gerar imagem </h3>
<p>Gere imagens</p>
<button onclick="window.location.href='/ias/gerarimg?texto=um carro vermelho'">Usar</button>
</div>

<div class="api-card">
<h3>Gerar imagem ghibili</h3>
<p>Gere imagens no estilo ghibili</p>
<button onclick="window.location.href='/ias/gerar_ghibili?texto=um carro vermelho'">Usar</button>
</div>

<div class="api-card">
<h3>Gerar imagem realista </h3>
<p>Gere imagens no estilo realista</p>
<button onclick="window.location.href='/ias/gerar_imagem_realista?texto=um carro vermelho'">Usar</button>
</div>

<div class="api-card">
<h3>Edit imagens</h3>
<p>Edit uma imagem através da url </p>
<button onclick="window.location.href='/ias/edit_imagem?texto=deixe no estilo ghibili&imagem=https://files.catbox.moe/vfx1vg'">Usar</button>
</div>

 <div class="api-card">
<h3>Gerar poemas </h3>
<p>Gere poemas apenas com uma frase!</p>
<button onclick="window.location.href='/ias/gerar_poema?texto=um carro vermelho a noite&linguagem=portuguese&tipo=Romantic'">Usar</button>
</div>

 <div class="api-card">
<h3>Gerar código </h3>
<p>Gere códigos em diferentes linguagens apenas com um prompt!</p>
<button onclick="window.location.href='/ias/gerar_codigo?texto=crie uma função que gera nuneros de 0 a 1000 e se a pessoa digitar o número que a função escolher ela ganha&linguagem=nodeJs'">Usar</button>
</div>

</div>




<h1 class="api-searches-title">Apis de canvas</h1>
<div class="api-searches-grid">
<div class="api-card">
<h3>Bem vindo</h3>
<p>Faça uma imagem personalizada com canvas de boas vindas</p>
<button onclick="window.location.href='/canvas/bemvindo?textobemvindo=Bem vindo (a)&nomegrupo=Daki infos&numerouser=Tokyo&imgperfil=https://i.pinimg.com/736x/d7/7d/53/d77d539d8f61cd9371ee97c32b7c5b4b.jpg&imgbanner=https://files.catbox.moe/vyybe9.jpg'">Usar</button>
</div>

<div class="api-card">
<h3>Bem vindo V2</h3>
<p>Faça uma imagem personalizada com canvas de boas vindas</p>
<button onclick="window.location.href='/canvas/bemvindo2?textobemvindo=Bem vindo (a)&nomegrupo=Daki infos&numerouser=Tokyo&imgperfil=&imgbanner='">Usar</button>
</div>

<div class="api-card">
<h3>Ping</h3>
<p>Faça uma imagem personalizada com canvas de ping</p>
<button onclick="window.location.href='/canvas/ping?titulo=PING DO BOT&imagemFundo=https://files.catbox.moe/vyybe9.jpg&imagemCircular=https://i.pinimg.com/736x/d7/7d/53/d77d539d8f61cd9371ee97c32b7c5b4b.jpg&velocidade=1.92ms&sistema=Sistema operacional: Linux&tempoOnline=Tempo online: 05h 12m 30s&usoCpu=Uso da cpu: 15%25&memoria=Memória: 3.5gb&nomeBot=Daki infos'">
Usar
</button>
</div>

<div class="api-card">
<h3>Ping V2</h3>
<p>Faça uma imagem personalizada com canvas de ping</p>
<button onclick="window.location.href='/canvas/ping2?titulo=0.0004 ms&nomebot=Toxicons&imagemFundo=&imagemCircular='">
Usar
</button>
</div>

</div>



<h1 class="api-searches-title">Apis de adesivos</h1>
<div class="api-searches-grid">
 <div class="api-card">
<h3>ATTP 1 </h3>
<p>Gereum sticker colorido no estilo attp (1)!</p>
<button onclick="window.location.href='/adesivos/attp1?texto=Daki infos'">Usar</button>
</div>


 <div class="api-card">
<h3>ATTP 2 </h3>
<p>Gereum sticker colorido no estilo one piece!</p>
<button onclick="window.location.href='/adesivos/attp2?texto=Daki infos'">Usar</button>
</div>

 <div class="api-card">
<h3>ATTP 3 </h3>
<p>Gereum sticker colorido no estilo attp3!</p>
<button onclick="window.location.href='/adesivos/attp3?texto=Daki infos'">Usar</button>
</div>


<h1 class="api-searches-title">Apis de Logos</h1>
<div class="api-searches-grid">


 <div class="api-card">
<h3>Dragon Ball </h3>
<p>Gere uma imagem no estilo Dragon Ball através de um texto!</p>
<button onclick="window.location.href='/logos/dragonball?texto=Tokyo'">Usar</button>
</div>

 <div class="api-card">
<h3>Efeito 3d </h3>
<p>Gere uma imagem com efeito 3d através de um texto!</p>
<button onclick="window.location.href='/logos/efeito_3d?texto=Tokyo'">Usar</button>
</div>

 <div class="api-card">
<h3>Luz neon </h3>
<p>Gere uma imagem de luz neon através de um texto!</p>
<button onclick="window.location.href='/logos/luz_neon?texto=Tokyo'">Usar</button>
</div>

 <div class="api-card">
<h3>Vidro </h3>
<p>Gere uma imagem com um texto em um vidro embaçado através de um texto!</p>
<button onclick="window.location.href='/logos/vidro?texto=Tokyo'">Usar</button>
</div>

 <div class="api-card">
<h3>Glitch </h3>
<p>Gere uma imagem com efeito glitch através de um texto!</p>
<button onclick="window.location.href='/logos/glitch?texto=Tokyo'">Usar</button>
</div>

 <div class="api-card">
<h3>Blackpink </h3>
<p>Gere uma imagem com efeito blackpink através de um texto!</p>
<button onclick="window.location.href='/logos/blackpink?texto=Tokyo'">Usar</button>
</div>


</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
const themeButton = document.getElementById('theme-button');
const body = document.body;
const cards = document.querySelectorAll('.card');
const cardTitles = document.querySelectorAll('.card h3');
const cardButtons = document.querySelectorAll('.card-content button');
const headerTitle = document.querySelector('header h1');
const apiCards = document.querySelectorAll('.api-card');
const apiCardTitles = document.querySelectorAll('.api-card h3');
const apiCardButtons = document.querySelectorAll('.api-card button');
const apiSearchesTitle = document.querySelector('.api-searches-title');

const playSoundButton = document.getElementById('play-sound-button');
const apiHealthSound = document.getElementById('api-health-sound');

themeButton.addEventListener('click', () => {
body.classList.toggle('light-theme');
headerTitle.classList.toggle('light-theme');
themeButton.classList.toggle('light-theme');
cards.forEach(card => card.classList.toggle('light-theme'));
cardTitles.forEach(title => title.classList.toggle('light-theme'));
cardButtons.forEach(button => button.classList.toggle('light-theme'));
apiCards.forEach(apiCard => apiCard.classList.toggle('light-theme'));
apiCardTitles.forEach(title => title.classList.toggle('light-theme'));
apiCardButtons.forEach(button => button.classList.toggle('light-theme'));
if (apiSearchesTitle) {
apiSearchesTitle.classList.toggle('light-theme');
}


if (body.classList.contains('light-theme')) {
themeButton.textContent = 'Tema Escuro';
} else {
themeButton.textContent = 'Tema Claro';
}
});

if (playSoundButton && apiHealthSound) {
playSoundButton.addEventListener('click', () => {
apiHealthSound.play();
});
}
});
</script>
</body>
</html>`);
});

// Recebe o arquivo e retorna JSON
app.post('/upload', (req, res) => {
const filename = req.query.filename;
if (!filename) return res.status(400).json({ error: 'Nome do arquivo não enviado!' });

const newFilename = Date.now() + '_' + filename;
const filePath = path.join(__dirname, 'uploads', newFilename);

fs.writeFile(filePath, req.body, err => {
if (err) return res.status(500).json({ error: 'Erro ao salvar o arquivo.' });

const fileUrl = `/uploads/${newFilename}`;
res.json({
status: "sucesso",
link: fileUrl
});
});
});

// Servir os arquivos da pasta "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Função para baixar TikTok
//const Tiktok = require('tiktok-api-src');
async function downloadTikTok(link) {
try {
//const result = await Tiktok.Downloader(link, { version: 'v2' });
return "api desativada";
} catch (error) {
console.error('Erro ao baixar o TikTok:', error);
return null;
}
}

// Importação dos scrapers de FERRAMENTAS
const { eBinary, dBinary } = require('./scrapers/ferramentas/binary.js');
const { buscarEmojis } = require('./scrapers/ferramentas/emoji.js');
const { styletext } = require('./scrapers/ferramentas/fazernick.js');
const { scrapeFlagInfo } = require('./scrapers/ferramentas/info_pais.js');
const { memezeira } = require('./scrapers/ferramentas/memezeira.js');
const { scrapeNGL } = require('./scrapers/ferramentas/spam_ngl.js');
const { ssweb} = require('./scrapers/ferramentas/ssweb.js');
const { mainfrases } = require('./scrapers/ferramentas/frases')
const {mainpiadas } = require('./scrapers/ferramentas/piadas')
const {upscale } = require('./scrapers/ferramentas/remini')



// Rotas de ferramentas


app.get('/ferramentas/remini', async (req, res) => {
logger.info(`ROTA ACESSADA: /ferramentas/remini`);
const { texto } = req.query;

try {
 if (!texto) {
return res.status(400).json({ erro: 'Parâmetro "texto" (URL da imagem) é obrigatório.' });
 }

 // Baixar a imagem como buffer
 const respostaImagem = await axios.get(texto, { responseType: 'arraybuffer' });
 const bufferImagem = Buffer.from(respostaImagem.data);

 // Fazer o upscale
 const urlUpscalada = await upscale(bufferImagem);

 res.json({ resultado: { texto: urlUpscalada } });
} catch (error) {
 logger.error(`ERRO NA ROTA /ferramentas/remini\n\n${error}`);
 res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});



app.get('/ferramentas/frases', async (req, res) => {
logger.info(`ROTA ACESSADA: /ferramentas/feases`);
const { texto } = req.query;
try {
let eb = await mainfrases();
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /ferramentas/frases\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/ferramentas/piadas', async (req, res) => {
logger.info(`ROTA ACESSADA: /ferramentas/piadas`);
const { texto } = req.query;
try {
let eb = await mainpiadas();
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /ferramentas/piadas\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});








app.get('/ferramentas/encodebinary', async (req, res) => {
logger.info(`ROTA ACESSADA: /ferramentas/encodebinary`);
const { texto } = req.query;
try {
let eb = await eBinary(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /ferramentas/encodebinary\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/ferramentas/unbinary', async (req, res) => {
logger.info(`ROTA ACESSADA: /ferramentas/unbinary`);

const { texto } = req.query;
try {
let eb = await dBinary(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /ferramentas/unbinary\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/ferramentas/emoji', async (req, res) => {
logger.info(`ROTA ACESSADA: /ferramentas/emoji`);
const { plataforma, emoji } = req.query;
try {
const resultados = await buscarEmojis(emoji);
const resultadoFiltrado = resultados.find(item => item.emoji === emoji);
const categoriasWhatsApp = resultadoFiltrado.categorias.filter(
categoria => categoria.plataforma_nome.toLowerCase() === plataforma
);
res.json({
resultado: {
emoji: resultadoFiltrado.emoji,
nome: resultadoFiltrado.nome,
descricao: resultadoFiltrado.descricao,
categorias: categoriasWhatsApp.length > 0 ? categoriasWhatsApp : "plataforma não disponível"
}
});
} catch (error) {
logger.error(`ERRO NA ROTA /ferramentas/emoji\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/ferramentas/fazernick', async (req, res) => {
logger.info(`ROTA ACESSADA: /ferramentas/fazernick`);
const { texto } = req.query;
try {
let eb = await styletext(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /ferramentas/fazernick\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/ferramentas/info_pais', async (req, res) => {
logger.info(`ROTA ACESSADA: /ferramentas/info_pais`);
const { texto } = req.query;
try {
let eb = await scrapeFlagInfo(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /ferramentas/info_pais\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/ferramentas/memezeira', async (req, res) => {
logger.info(`ROTA ACESSADA: /ferramentas/memezeira`);
const { texto } = req.query;
try {
let eb = await memezeira(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /ferramentas/memezeira\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});



app.get('/ferramentas/spam_ngl', async (req, res) => {
logger.info(`ROTA ACESSADA: /ferramentas/spam_ngl`);

const { texto, mensagem, quantidade } = req.query;
try {
await scrapeNGL(texto || 'TOKYO_TESTE', mensagem || 'obisian apis', quantidade, 1000);
res.json({ resultado: { texto: "spam concluido" } });
} catch (error) {
logger.error(`ERRO NA ROTA /ferramentas/spam_ngl\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/ferramentas/ssweb', async (req, res) => {
logger.info(`ROTA ACESSADA: /ferramentas/ssweb`);

const { texto } = req.query;
try {
let eb = await ssweb(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /ferramentas/ssweb\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});


// Importação dos scrapers de PESQUISAS
const { buscar_amazon } = require('./scrapers/pesquisas/amazon.js');
const { AppleMusic } = require('./scrapers/pesquisas/applemusic');
const { scrapeGoodreads } = require('./scrapers/pesquisas/book');
const { scrapeDDD } = require('./scrapers/pesquisas/ddd');
const { scrapeDicio } = require('./scrapers/pesquisas/dicio');
const { infofilme } = require('./scrapers/pesquisas/filme');
const { scrapeGnula } = require('./scrapers/pesquisas/filme2');
const { fetchData } = require('./scrapers/pesquisas/filme_serie');
const { freeSound } = require('./scrapers/pesquisas/freesound');
const { tiktokSearch } = require('./scrapers/pesquisas/tiktok');
const { gpwhatsapp } = require('./scrapers/pesquisas/gruposwa1');
const { PlaystoreSearch } = require('./scrapers/pesquisas/playstore');
const { rasparDados } = require('./scrapers/pesquisas/sticker');
const { steamR } = require('./scrapers/pesquisas/steam');
const { searchApp } = require('./scrapers/pesquisas/aplicativo');
const { receitakk } = require('./scrapers/pesquisas/piracanjuba');
const { scrapeDafont } = require('./scrapers/pesquisas/dafonte');
const { scrapeData } = require('./scrapers/pesquisas/happymod');
const { searchHentai } = require('./scrapers/pesquisas/hentai');
const { scrapenpmjs } = require('./scrapers/pesquisas/npmjs');
const { scrapeXvideosFull } = require('./scrapers/pesquisas/xvideos');
const { searchPornhub } = require('./scrapers/pesquisas/pornhub');
const { scrapeErome } = require('./scrapers/pesquisas/erome');
const { buscarFilmes } = require('./scrapers/pesquisas/imdb');
const { pinterestV1 } = require('./scrapers/pesquisas/pinterest');
const { ytVideosSearch } = require('./scrapers/pesquisas/youtube');
const { lyrics } = require('./scrapers/pesquisas/lyrics');
const { buscarStickerly } = require('./scrapers/pesquisas/stickerly');
const { scrapeBibliaComImagem } = require('./scrapers/pesquisas/biblia')
const { pensador } = require('./scrapers/pesquisas/pensador')
const { rasparTodaMateria } = require('./scrapers/pesquisas/todamateria')
const { scraperimdb } = require('./scrapers/pesquisas/imdb')
const { getmodsapk } = require('./scrapers/pesquisas/getmodsapk')
const { scrapeTekmods } = require('./scrapers/pesquisas/tekmods')



// Rotas de pesquisas
app.get('/pesquisas/todamateria', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/todamateria`);
const { texto } = req.query;
try {
let eb = await rasparTodaMateria(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/todamateria\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/todamateria', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/todamateria`);
const { texto } = req.query;
try {
let eb = await rasparTodaMateria(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/todamateria\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});



app.get('/pesquisas/getmodsapk', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/getmodsapk`);
const { texto } = req.query;
try {
let eb = await getmodsapk(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/getmodsapk\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/tekmods', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/tekmods`);
const { texto } = req.query;
try {
let eb = await scrapeTekmods(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/tekmods\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/versiculo', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/versiculo`);
const { texto } = req.query;
try {
let eb = await scrapeBibliaComImagem(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/versiculo\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});










app.get('/pesquisas/letra', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/letra`);
const { texto } = req.query;
try {
let eb = await lyrics(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/letra\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/youtube', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/youtube`);
const { texto } = req.query;
try {
let eb = await ytVideosSearch(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/youtube\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/stickerpack', async (req, res) => {

logger.info(`ROTA ACESSADA: /pesquisas/stickerpack`);

const { texto } = req.query;

try {

let eb = await rasparDados(texto);

res.json({ resultado: { texto: eb } });

} catch (error) {

logger.error(`ERRO NA ROTA /pesquisas/stickerpack\n\n${error}`);

res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });

}

});app.get('/pesquisas/amazon', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/amazon`);
const { texto } = req.query;
try {
let eb = await buscar_amazon(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/amazon\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/applemusic', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/applemusic`);
const { texto } = req.query;
try {
const resultados = await AppleMusic(texto);
res.json({ resultado: resultados });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/applemusic\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao buscar no Apple Music" });
}
});

app.get('/pesquisas/goodreads', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/goodreads`);
const { texto } = req.query;
try {
let eb = await scrapeGoodreads(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/goodreads\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/ddd', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/ddd`);
const { texto } = req.query;
try {
let eb = await scrapeDDD(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/ddd\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/dicio', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/dicio`);
const { texto } = req.query;
try {
let eb = await scrapeDicio(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/dicio\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/adorocinema', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/adorocinema`);
const { texto } = req.query;
try {
let eb = await infofilme(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/adorocinema\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/gnulahd', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/gnulahd`);
const { texto } = req.query;
try {
let eb = await scrapeGnula(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/gnulahd\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/imdb', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/imdb`);
const { texto } = req.query;
try {
let eb = await buscarFilmes(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/imdb\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

/*
app.get('/pesquisas/lendafilmes', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/lendafilmes`);
const { texto } = req.query;
try {
let eb = await fetchData(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/lendafilmes\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});
*/
app.get('/pesquisas/freesound', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/freesound`);
const { texto } = req.query;
try {
let eb = await freeSound(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/freesound\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/tiktok', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/tiktok`);
const { texto } = req.query;
try {
let eb = await tiktokSearch(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/tiktoksearch\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/grupowhatsapp', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/grupowhatsapp`);
const { texto } = req.query;
try {
let eb = await gpwhatsapp(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/grupowhatsapp\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/playstore', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/playstore`);
const { texto } = req.query;
try {
let eb = await PlaystoreSearch(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/playstore\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/stickerpack', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/stickerpack`);
const { texto } = req.query;
try {
let eb = await rasparDados(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/stickerpack\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/steamJogo', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/steamjogo`);
const { texto } = req.query;
try {
let eb = await steamR(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/steamjogo\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

/*
app.get('/pesquisas/gamedva', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/gamedva`);
const { texto } = req.query;
try {
let eb = await searchApp(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/gamedva\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});
*/
app.get('/pesquisas/piracanjuba', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/piracanjuba`);
const { texto } = req.query;
try {
let eb = await receitakk(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/piracanjuba\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/dafont', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/dafont`);
const { texto } = req.query;
try {
let eb = await scrapeDafont(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/dafont\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/happymod', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/happymod`);
const { texto } = req.query;
try {
let eb = await scrapeData(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/happymod\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/hentaiTv', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/hentaitv`);
const { texto } = req.query;
try {
let eb = await searchHentai(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/hentaitv\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/npmjs', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/npmjs`);
const { texto } = req.query;
try {
let eb = await scrapenpmjs(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/npmjs\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/xvideos', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/xvideos`);
const { texto } = req.query;
try {
let eb = await scrapeXvideosFull(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/xvideos\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/pornhub', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/pornhub`);
const { texto } = req.query;
try {
let eb = await searchPornhub(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/pornhub\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/erome', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/erome`);
const { texto } = req.query;
try {
let eb = await scrapeErome(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/erome\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/pinterest', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/pinterest`);
const { texto } = req.query;
try {
let eb = await pinterestV1(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/pinterest\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/pesquisas/stickerly', async (req, res) => {
logger.info(`ROTA ACESSADA: /pesquisas/stickerly`);
const { texto } = req.query;
try {
let eb = await buscarStickerly(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /pesquisas/stickerly\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

// Importação dos scrapers de STALKS
const { kwaistalk } = require('./scrapers/stalks/kwai.js');
const { stalkttk } = require('./scrapers/stalks/tiktok.js');
const { scrapeProfilewattpad } = require('./scrapers/stalks/wattpad');
const { stalkige } = require('./scrapers/stalks/instagram');
const { getUserData } = require('./scrapers/stalks/github');
const { steamStalk } = require('./scrapers/stalks/steam');
const { scrapeCOC } = require('./scrapers/stalks/clashlfclans');
const { MinecraftStalk } = require('./scrapers/stalks/minecraft');
const { scrapePinterestProfile } = require('./scrapers/stalks/pinterest');
const { scrapeSnapchatProfile } = require('./scrapers/stalks/snapchat');
const { obterDadosPerfilSoundCloud } = require('./scrapers/stalks/soundcloud');
const { infoYouTube } = require('./scrapers/stalks/youtube');
const { fetchDataxvideos } = require('./scrapers/stalks/xvideos');
const { fetchData_pornhub } = require('./scrapers/stalks/pornhub');
const { scrapeErome_stalks } = require('./scrapers/stalks/erome');
const { pegarPerfil } = require('./scrapers/stalks/prive');
const { buscarPerfilFreeFire } = require('./scrapers/stalks/ff');
const {capturarPerfilCompleto } = require('./scrapers/stalks/clashofclans');


// Rotas de stalks
app.get('/stalks/clashofclans', async (req, res) => {
logger.info(`ROTA ACESSADA: /stalks/clashofclans`);
const { texto } = req.query;
try {
let eb = await capturarPerfilCompleto(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /stalks/clashofclans\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/stalks/kwai', async (req, res) => {
logger.info(`ROTA ACESSADA: /stalks/kwai`);
const { texto } = req.query;
try {
let eb = await kwaistalk(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /stalks/kwai\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/stalks/tiktok', async (req, res) => {
logger.info(`ROTA ACESSADA: /stalks/tiktok`);
const { texto } = req.query;
try {
let eb = await stalkttk(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /stalks/tiktok\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/stalks/wattpad', async (req, res) => {
logger.info(`ROTA ACESSADA: /stalks/wattpad`);
const { texto } = req.query;
try {
let eb = await scrapeProfilewattpad(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /stalks/wattpad\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/stalks/instagram', async (req, res) => {
logger.info(`ROTA ACESSADA: /stalks/instagram`);
const { texto } = req.query;
try {
let eb = await stalkige(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /stalks/instagram\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/stalks/github', async (req, res) => {
logger.info(`ROTA ACESSADA: /stalks/github`);
const { texto } = req.query;
try {
let eb = await getUserData(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /stalks/github\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/stalks/steam', async (req, res) => {
logger.info(`ROTA ACESSADA: /stalks/steam`);
const { texto } = req.query;
try {
let eb = await steamStalk(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /stalks/steam\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/stalks/clashofclans', async (req, res) => {
logger.info(`ROTA ACESSADA: /stalks/clashofclans`);

const { texto } = req.query;
try {
let eb = await scrapeCOC(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /stalks/clashofclans\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/stalks/minecraft', async (req, res) => {
logger.info(`ROTA ACESSADA: /stalks/minecraft`);
const { texto } = req.query;
try {
let eb = await MinecraftStalk(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /stalks/minecraft\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/stalks/pinterest', async (req, res) => {
logger.info(`ROTA ACESSADA: /stalks/pinterest`);

const { texto } = req.query;
try {
let eb = await scrapePinterestProfile(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /stalks/pinterest\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/stalks/snapchat', async (req, res) => {
logger.info(`ROTA ACESSADA: /stalks/snapchat`);
const { texto } = req.query;
try {
let eb = await scrapeSnapchatProfile(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /stalks/snapchat\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/stalks/soundcloud', async (req, res) => {
logger.info(`ROTA ACESSADA: /stalks/soundcloud`);
const { texto } = req.query;
try {
let eb = await obterDadosPerfilSoundCloud(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /stalks/soundcloud\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/stalks/youtube', async (req, res) => {
logger.info(`ROTA ACESSADA: /stalks/youtube`);
const { texto } = req.query;
try {
let eb = await infoYouTube(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /stalks/youutbe\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/stalks/xvideos', async (req, res) => {
logger.info(`ROTA ACESSADA: /stalks/xvideos`);
const { texto } = req.query;
try {
let eb = await fetchDataxvideos(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /stalks/xvideos\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/stalks/pornhub', async (req, res) => {
logger.info(`ROTA ACESSADA: /stalks/pornhub`);
const { texto } = req.query;
try {
let eb = await fetchData_pornhub(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /stalks/pornhub\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/stalks/erome', async (req, res) => {
logger.info(`ROTA ACESSADA: /stalks/erome`);
const { texto } = req.query;
try {
let eb = await scrapeErome_stalks(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /stalks/erome\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/stalks/cameraprive', async (req, res) => {
logger.info(`ROTA ACESSADA: /stalks/cameraprive`);
const { texto } = req.query;
try {
let eb = await pegarPerfil(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /stalks/cameraprive\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});


app.get('/stalks/ff', async (req, res) => {
logger.info(`ROTA ACESSADA: /stalks/ff`);
const { texto } = req.query;
try {
let eb = await buscarPerfilFreeFire(texto);
res.json({ resultado: { texto: eb } });
} catch (error) {
logger.error(`ERRO NA ROTA /stalks/ff\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

// Importação dos scrapers de CANVAS
const { gerarImagem } = require('./scrapers/canvas/musicas/music');
const { gerarImagem2 } = require('./scrapers/canvas/musicas/music2');
const { desenharCena } = require('./scrapers/canvas/bemvindo/bemvindo');
const { desenharPing } = require('./scrapers/canvas/ping/ping');
const { gerarping2 } = require('./scrapers/canvas/ping/ping2');
const { gerarbemvindo2 } = require('./scrapers/canvas/bemvindo/bemvindo2');


const garantirDiretorio = (dirPath) => {
if (!fs.existsSync(dirPath)) {
fs.mkdirSync(dirPath, { recursive: true });
}
};

const fotoicon_reserva = 'https://i.pinimg.com/736x/d7/7d/53/d77d539d8f61cd9371ee97c32b7c5b4b.jpg';
const fundoicon_reserva = 'https://files.catbox.moe/vyybe9.jpg';

app.get('/canvas/play', async (req, res) => {
logger.info(`ROTA ACESSADA: /canvas/play`);

try {
const {
fotoicon,
fundoicon,
cor_nome,
cor_progresso,
progresso,
author,
tempo_inicial,
tempo_final,
nome_musica,
tipologo
} = req.query;
const options = {
thumbnailImage: fotoicon || fotoicon_reserva,
backgroundImage: fundoicon || fundoicon_reserva,
imageDarkness: "60",
nameColor: cor_nome ? `#${cor_nome}` : "#800080",
progressColor: cor_progresso ? `#${cor_progresso}` : "#800080",
progressBarColor: "#2B2B2B",
progress: progresso || 30,
author: author || "daki apis",
startTime: tempo_inicial || "0:32",
endTime: tempo_final || "4:00",
name: nome_musica || "api de canvas",
};
const dirPath = path.join(__dirname, 'imagens');
garantirDiretorio(dirPath);
const outputPath = path.join(dirPath, `wallpaper_${Date.now()}.png`);
const filePath = await gerarImagem(options, outputPath, tipologo);
res.type('png');
if (!fs.existsSync(filePath)) {
return res.status(404).send('Imagem não encontrada.');
}
res.sendFile(filePath, (err) => {
if (err) {
console.error("Erro ao enviar a imagem:", err);
res.status(500).send('Erro ao enviar a imagem.');
}
setTimeout(() => {
try {
fs.unlinkSync(filePath);
logger.warn(`Imagem ${filePath} excluída após 3 minutos.`);
} catch (deleteError) {
console.error("Erro ao excluir o arquivo:", deleteError);
}
}, 180000);
});
} catch (error) {
logger.error(`ERRO NA ROTA /canvas/play\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});


const { createCanvas } = require('canvas')

app.get('/canvas/bemvindo', async (req, res) => {
logger.info(`ROTA ACESSADA: /canvas/bemvindo`);

try {
const {
textobemvindo,
imgbanner,
imgperfil,
nomegrupo,
numerouser
} = req.query;



const dirPath = path.join(__dirname, 'imagens');
garantirDiretorio(dirPath);

const outputPath = path.join(dirPath, `bemvindo_${Date.now()}.png`);
const canvas = createCanvas(900, 300);
const ctx = canvas.getContext('2d');

await desenharCena(ctx, textobemvindo || 'Bem vindo (a)', imgbanner || fundoicon_reserva, imgperfil || fotoicon_reserva, nomegrupo || 'Daki infos', numerouser || '+55 32 985076326');

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);

res.type('png');
if (!fs.existsSync(outputPath)) {
return res.status(404).send('Imagem não encontrada.');
}

res.sendFile(outputPath, (err) => {
if (err) {
console.error("Erro ao enviar a imagem:", err);
res.status(500).send('Erro ao enviar a imagem.');
}
setTimeout(() => {
try {
fs.unlinkSync(outputPath);
logger.warn(`Imagem ${outputPath} excluída após 3 minutos.`);
} catch (deleteError) {
console.error("Erro ao excluir o arquivo:", deleteError);
}
}, 180000); // 3 minutos
});

} catch (error) {
logger.error(`ERRO NA ROTA /canvas/bemvindo\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});


app.get('/canvas/bemvindo2', async (req, res) => {
  logger.info(`ROTA ACESSADA: /canvas/bemvindo2`);

  try {
    const {
  textobemvindo,
  imgbanner,
  imgperfil,
  nomegrupo,
  numerouser
} = req.query;

const bannerUrl = imgbanner && imgbanner.trim() ? imgbanner : 'https://i.pinimg.com/1200x/8b/76/8e/8b768e3c8e400659851987cba7c82c7a.jpg';
const perfilUrl = imgperfil && imgperfil.trim() ? imgperfil : 'https://i.pinimg.com/736x/e3/68/7a/e3687ab9a7dd6807fab29188cb997eea.jpg';

const buffer = await gerarbemvindo2({
  tituloTopo: textobemvindo || 'Bem vindo (a)',
  imagem1Url: bannerUrl,
  imagem2Url: perfilUrl,
  textoCard1: nomegrupo || 'Daki infos',
  textoCard2: numerouser || '+55 32 985076326'
});


    res.set('Content-Type', 'image/png');
    res.send(buffer);

  } catch (error) {
    logger.error(`ERRO NA ROTA /canvas/bemvindo2\n\n${error}`);
    res.status(500).json({ erro: 'Ocorreu um erro ao processar sua solicitação.' });
  }
});

app.get('/canvas/ping', async (req, res) => {
logger.info(`ROTA ACESSADA: /canvas/ping`);

try {
let {
titulo,
imagemFundo,
imagemCircular,
velocidade,
sistema,
tempoOnline,
usoCpu,
memoria,
nomeBot
} = req.query;

// Valores padrão
titulo = titulo || 'Ping do bot';
imagemFundo = imagemFundo || 'https://files.catbox.moe/vyybe9.jpg'; // valor reserva
imagemCircular = imagemCircular || 'https://i.pinimg.com/736x/d7/7d/53/d77d539d8f61cd9371ee97c32b7c5b4b.jpg'; // valor reserva
velocidade = velocidade || '1.900';
sistema = sistema || 'Sistema operacional: linux';
tempoOnline = tempoOnline || 'Tempo online:.00h 07m 16s';
usoCpu = usoCpu || 'Uso da cpu: 14.35%';
memoria = memoria || 'Memória: 5.00gb';
nomeBot = nomeBot || 'Daki infos';

const dirPath = path.join(__dirname, 'imagens');
garantirDiretorio(dirPath);

const outputPath = path.join(dirPath, `ping_${Date.now()}.png`);
const canvas = createCanvas(840, 400);
const ctx = canvas.getContext('2d');

// ⬇️ Chamada com os dados ajustados
await desenharPing(ctx, {
titulo,
imagemFundo,
imagemCircular,
velocidade,
sistema,
tempoOnline,
usoCpu,
memoria,
nomeBot
});

const buffer = canvas.toBuffer('image/png');
fs.writeFileSync(outputPath, buffer);

res.type('png');
if (!fs.existsSync(outputPath)) {
return res.status(404).send('Imagem não encontrada.');
}

res.sendFile(outputPath, (err) => {
if (err) {
console.error("Erro ao enviar a imagem:", err);
res.status(500).send('Erro ao enviar a imagem.');
}
setTimeout(() => {
try {
fs.unlinkSync(outputPath);
logger.warn(`Imagem ${outputPath} excluída após 3 minutos.`);
} catch (deleteError) {
console.error("Erro ao excluir o arquivo:", deleteError);
}
}, 180000);
});

} catch (error) {
logger.error(`ERRO NA ROTA /canvas/ping\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});



app.get('/canvas/ping2', async (req, res) => {
  logger.info(`ROTA ACESSADA: /canvas/ping2`);

  try {
    let {
      titulo,
      imagemFundo,
      imagemCircular,
      nomebot
    } = req.query;

    titulo = titulo || '0.0004 ms';
    nomebot = nomebot || 'Obsidian'
    imagemFundo = imagemFundo || 'https://i.pinimg.com/736x/eb/01/32/eb0132491473a03044708bbad2f00667.jpg';
    imagemCircular = imagemCircular || 'https://i.pinimg.com/736x/44/dd/39/44dd39521229bf5c43fdfc64ee62b412.jpg';

    // Usando ping2 para gerar o buffer da imagem
    const buffer = await gerarping2(nomebot, imagemFundo, imagemCircular, titulo);

    res.set('Content-Type', 'image/png');
    return res.send(buffer);

  } catch (error) {
    logger.error(`ERRO NA ROTA /canvas/ping2\n\n${error}`);
    return res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
  }
});



const { attp1 } = require('./scrapers/attp/attp1');
const { attp2 } = require('./scrapers/attp/attp2');
const { attp3 } = require('./scrapers/attp/attp3');
app.get('/adesivos/attp1', async (req, res) => {
logger.info(`ROTA ACESSADA: /adesivos/attp1`);

try {
const { texto } = req.query;
const text = texto || 'tokyo';

// Gera o adesivo animado (salvo como ./src/attp.webp)
const attpPath = await attp1(text);

// Verifica se existe
if (!fs.existsSync(attpPath)) {
return res.status(404).send('Imagem não encontrada.');
}

// Envia o arquivo .webp
res.type('webp');
res.sendFile(path.resolve(attpPath), (err) => {
if (err) {
console.error("Erro ao enviar a imagem:", err);
return res.status(500).send('Erro ao enviar a imagem.');
}

// Exclui o arquivo após 3 minutos
setTimeout(() => {
try {
fs.unlinkSync(attpPath);
logger.warn(`Imagem ${attpPath} excluída após 3 minutos.`);
} catch (deleteError) {
console.error("Erro ao excluir o arquivo:", deleteError);
}
}, 180000); // 3 minutos
});

} catch (error) {
logger.error(`ERRO NA ROTA /adesivos/attp1\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});


app.get('/adesivos/attp2', async (req, res) => {
logger.info(`ROTA ACESSADA: /adesivos/attp2`);

try {
const { texto } = req.query;
const text = texto || 'tokyo';

// Gera o adesivo animado (salvo como ./src/attp.webp)
const attpPath = await attp2(text);

// Verifica se existe
if (!fs.existsSync(attpPath)) {
return res.status(404).send('Imagem não encontrada.');
}

// Envia o arquivo .webp
res.type('webp');
res.sendFile(path.resolve(attpPath), (err) => {
if (err) {
console.error("Erro ao enviar a imagem:", err);
return res.status(500).send('Erro ao enviar a imagem.');
}

// Exclui o arquivo após 3 minutos
setTimeout(() => {
try {
fs.unlinkSync(attpPath);
logger.warn(`Imagem ${attpPath} excluída após 3 minutos.`);
} catch (deleteError) {
console.error("Erro ao excluir o arquivo:", deleteError);
}
}, 180000); // 3 minutos
});

} catch (error) {
logger.error(`ERRO NA ROTA /adesivos/attp2\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});


app.get('/adesivos/attp3', async (req, res) => {
logger.info(`ROTA ACESSADA: /adesivos/attp3`);

try {
const { texto } = req.query;
const text = texto || 'tokyo';

// Gera o adesivo animado (salvo como ./src/attp.webp)
const attpPath = await attp3(text);

// Verifica se existe
if (!fs.existsSync(attpPath)) {
return res.status(404).send('Imagem não encontrada.');
}

// Envia o arquivo .webp
res.type('webp');
res.sendFile(path.resolve(attpPath), (err) => {
if (err) {
console.error("Erro ao enviar a imagem:", err);
return res.status(500).send('Erro ao enviar a imagem.');
}

// Exclui o arquivo após 3 minutos
setTimeout(() => {
try {
fs.unlinkSync(attpPath);
logger.warn(`Imagem ${attpPath} excluída após 3 minutos.`);
} catch (deleteError) {
console.error("Erro ao excluir o arquivo:", deleteError);
}
}, 180000); // 3 minutos
});

} catch (error) {
logger.error(`ERRO NA ROTA /adesivos/attp3\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

//importação dos scrapers de DOWNLOADS
const { fbdl } = require('./scrapers/dl/fbdl')
const { capcut } = require('./scrapers/dl/capcut')
const { pintorest } = require('./scrapers/dl/pinterest')
const { pintorestv2 } = require('./scrapers/dl/pinterestv2')
const { snappinDownload } = require('./scrapers/dl/pinterestv3')
const { instagramD } = require('./scrapers/dl/instagram')
const { downloadYoutubeVideo } = require('./scrapers/dl/youtube3')
const { soundcloudDownloader } = require('./scrapers/dl/soundcloud')
const { downloadFromThreads } = require('./scrapers/dl/theads')
const { teraboxDownloader } = require('./scrapers/dl/terabox')
const { spotifyDownload } = require('./scrapers/dl/spotify')
const { fbvdl } = require('./scrapers/dl/fbdl2')
const { baixarAudio, baixarVideo } = require('./scrapers/dl/youtube')
app.get('/dl/instagram', async (req, res) => {
logger.info(`ROTA ACESSADA: /dl/instagram`);
const { texto } = req.query;
try {
let eb = await instagramD(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /dl/instagram\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/dl/spotify', async (req, res) => {
logger.info(`ROTA ACESSADA: /dl/spotify`);
const { texto } = req.query;
try {
let eb = await spotifyDownload(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /dl/spotify\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});


app.get('/dl/youtube3', async (req, res) => {
logger.info(`ROTA ACESSADA: /dl/youtube3`);
const { texto, formato } = req.query;
try {
let eb = await downloadYoutubeVideo(texto, formato)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /dl/youtube3\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/dl/soundcloud', async (req, res) => {
logger.info(`ROTA ACESSADA: /dl/soundcloud`);
const { texto } = req.query;
try {
let eb = await soundcloudDownloader(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /dl/soundcloud\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/dl/terabox', async (req, res) => {
logger.info(`ROTA ACESSADA: /dl/terabox`);
const { texto } = req.query;
try {
let eb = await teraboxDownloader(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /dl/terabox\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/dl/theads', async (req, res) => {
logger.info(`ROTA ACESSADA: /dl/theads`);
const { texto } = req.query;
try {
let eb = await downloadFromThreads(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /dl/theads\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/dl/facebook', async (req, res) => {
logger.info(`ROTA ACESSADA: /dl/facebook`);
const { texto } = req.query;
try {
let eb = await fbdl(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /dl/facebook\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/dl/capcut', async (req, res) => {
logger.info(`ROTA ACESSADA: /dl/capcut`);

const { texto } = req.query;
try {
let eb = await capcut(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /dl/capcut\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/dl/pinterest', async (req, res) => {
logger.info(`ROTA ACESSADA: /dl/pinterest`);

const { texto } = req.query;
try {
let eb = await pintorest(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /dl/pinterest\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/dl/pinterestv2', async (req, res) => {
logger.info(`ROTA ACESSADA: /dl/pinterestV2`);

const { texto } = req.query;
try {
let eb = await pintorestv2(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /dl/pinterestV2\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/dl/pinterestv3', async (req, res) => {
logger.info(`ROTA ACESSADA: /dl/pinterestV3`);

const { texto } = req.query;
try {
let eb = await snappinDownload(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /dl/pinterestV3\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/dl/tiktok', async (req, res) => {
logger.info(`ROTA ACESSADA: /dl/tiktok`);
const { texto } = req.query;
const { tiktokdl } = require('tiktokdl') 

try {
let eb = await tiktokdl(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /dl/tiktok\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/dl/tiktok_video', async (req, res) => {
logger.info(`ROTA ACESSADA: /dl/tiktok_video`);

const { texto } = req.query;
if (!texto) { 
return res.status(400).json({ erro: "Parâmetro 'texto' é obrigatório." });
}
try {
const tiktokData = await downloadTikTok(texto);
if (tiktokData && tiktokData.result) {
const { result } = tiktokData; 
const tiktokInfo = {
resultado: {
tipo: result.type || 'não encontrado',
author: result.author?.nickname || 'não encontrado', 
likes: result.statistics?.likeCount || 'não encontrado',
thumbnail_usuario_que_postou: result.author?.avatar || 'https://qu.ax/ngtmq.jpg',
comentarios: result.statistics?.commentCount || 'não encontrado',
compartilhamentos: result.statistics?.shareCount || 'não encontrado',
descrição: result.desc || 'não encontrado',
videoUrl: result.video || 'não encontrado'
}
};
res.json(tiktokInfo); 
} else {
res.status(404).json({ erro: "Não foi possível obter dados do TikTok para o texto fornecido." });
}
} catch (error) {
logger.error(`ERRO NA ROTA /dl/tiktok_video\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro interno ao processar sua solicitação." });
}
});

app.get('/dl/tiktok_audio', async (req, res) => {
logger.info(`ROTA ACESSADA: /dl/tiktok_audio`);

const { texto } = req.query;
if (!texto) { 
return res.status(400).json({ erro: "Parâmetro 'texto' é obrigatório." });
}
try {
const tiktokData = await downloadTikTok(texto);
if (tiktokData && tiktokData.result) {
const { result } = tiktokData; 
const tiktokInfo = {
resultado: {
tipo: result.type || 'não encontrado',
author: result.author?.nickname || 'não encontrado', 
likes: result.statistics?.likeCount || 'não encontrado',
thumbnail_usuario_que_postou: result.author?.avatar || 'https://qu.ax/ngtmq.jpg',
comentarios: result.statistics?.commentCount || 'não encontrado',
compartilhamentos: result.statistics?.shareCount || 'não encontrado',
descrição: result.desc || 'não encontrado',
videoUrl: result.video || 'não encontrado'
}
};
res.json(tiktokInfo); 
} else {
res.status(404).json({ erro: "Não foi possível obter dados do TikTok para o texto fornecido." });
}
} catch (error) {
logger.error(`ERRO NA ROTA /dl/tiktok_audio\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro interno ao processar sua solicitação." });
}
});


app.get('/dl/tiktok_audiov2', async (req, res) => {
logger.info(`ROTA ACESSADA: /dl/tiktok_audiov2`);

const { texto } = req.query; 
if (!texto) {
return res.status(400).json({ erro: "Parâmetro 'texto' é obrigatório (URL ou ID do TikTok)." });
}
try {
Tiktok.Downloader(texto, {
version: "v1", // version: "v1" | "v2" | "v3"
proxy: "51.15.59.175:80" // Support Proxy Http, Https, Socks5
}).then((result) => {
if (result.result) { // Check if result.result exists before trying to access its properties
const criadorapi = "Nome do Criador"; // You need to define criadorapi if it's not global
const resultadoFormatado = { // Renamed 'resultado' to 'resultadoFormatado' to avoid conflict
criador: criadorapi,
status: true,
resultado: {
tipo: result.result.type || 'nao encontrado',
descrição: result.result.description || 'nao encontrado',
hashtags: result.result.hashtag || 'nao encontrado',
estatísticas: {
comentários: (result.result.statistics && result.result.statistics.commentCount) || 'nao encontrado',
curtidas: (result.result.statistics && result.result.statistics.diggCount) || 'nao encontrado',
downloads: (result.result.statistics && result.result.statistics.downloadCount) || 'nao encontrado',
visualizações: (result.result.statistics && result.result.statistics.playCount) || 'nao encontrado',
compartilhamentos: (result.result.statistics && result.result.statistics.shareCount) || 'nao encontrado',
favoritos: (result.result.statistics && result.result.statistics.collectCount) || 'nao encontrado'
},
música: {
id: (result.result.music && result.result.music.id) || 'nao encontrado',
título: (result.result.music && result.result.music.title) || 'nao encontrado',
autor: (result.result.music && result.result.music.author) || 'nao encontrado',
álbum: (result.result.music && result.result.music.album) || 'nao encontrado',
duração: (result.result.music && result.result.music.duration) || 'nao encontrado',
url: (result.result.music && result.result.music.playUrl) || 'nao encontrado',
éComercial: (result.result.music && result.result.music.isCommerceMusic) || 'nao encontrado'
},
infos_author: {
uid: (result.result.author && result.result.author.uid) || 'nao encontrado',
username: (result.result.author && result.result.author.username) || 'nao encontrado',
nickname: (result.result.author && result.result.author.nickname) || 'nao encontrado',
assinatura: (result.result.author && result.result.author.signature) || 'nao encontrado',
região: (result.result.author && result.result.author.region) || 'nao encontrado',
avatar: (result.result.author && result.result.author.avatarThumb) || 'https://qu.ax/ngtmq.jpg',
urlPerfil: (result.result.author && result.result.author.url) || 'nao encontrado'
}
}
};
return res.status(200).json(resultadoFormatado); 
} else {
return res.status(404).json({ erro: "Não foi possível obter dados do TikTok para o texto fornecido." });
}
});
} catch (error) {
logger.error(`ERRO NA ROTA /dl/tiktok_audiov2\n\n${error}`);
return res.status(500).json({ erro: "Ocorreu um erro interno ao processar sua solicitação." });
}
});

app.get('/dl/tiktok_videov2', async (req, res) => {
logger.info(`ROTA ACESSADA: /dl/tiktok_videov2`);

const { texto } = req.query; 
if (!texto) {
return res.status(400).json({ erro: "Parâmetro 'texto' é obrigatório (URL ou ID do TikTok)." });
}
try {
Tiktok.Downloader(texto, {
version: "v1", // version: "v1" | "v2" | "v3"
proxy: "51.15.59.175:80" // Support Proxy Http, Https, Socks5
}).then((result) => {
if (result.result) { // Check if result.result exists before trying to access its properties
const resultadoFormatado = { // Renamed 'resultado' to 'resultadoFormatado' to avoid conflict
status: true,
resultado: {
tipo: result.result.type || 'nao encontrado',
descrição: result.result.description || 'nao encontrado',
hashtags: result.result.hashtag || 'nao encontrado',
estatísticas: {
comentários: (result.result.statistics && result.result.statistics.commentCount) || 'nao encontrado',
curtidas: (result.result.statistics && result.result.statistics.diggCount) || 'nao encontrado',
downloads: (result.result.statistics && result.result.statistics.downloadCount) || 'nao encontrado',
visualizações: (result.result.statistics && result.result.statistics.playCount) || 'nao encontrado',
compartilhamentos: (result.result.statistics && result.result.statistics.shareCount) || 'nao encontrado',
favoritos: (result.result.statistics && result.result.statistics.collectCount) || 'nao encontrado'
},
vídeo: {
qualidade: result.result.video.ratio || 'nao encontrado',
duração: result.result.video.duration || 'nao encontrado',
capa: result.result.video.cover || 'https://qu.ax/ngtmq.jpg', // Pode ajustar para exibir URLs específicas
endereçoPlay: result.result.video.playAddr || 'nao encontrado'
},

infos_author: {
uid: (result.result.author && result.result.author.uid) || 'nao encontrado',
username: (result.result.author && result.result.author.username) || 'nao encontrado',
nickname: (result.result.author && result.result.author.nickname) || 'nao encontrado',
assinatura: (result.result.author && result.result.author.signature) || 'nao encontrado',
região: (result.result.author && result.result.author.region) || 'nao encontrado',
avatar: (result.result.author && result.result.author.avatarThumb) || 'https://qu.ax/ngtmq.jpg',
urlPerfil: (result.result.author && result.result.author.url) || 'nao encontrado'
}
}
};
return res.status(200).json(resultadoFormatado); 
} else {
return res.status(404).json({ erro: "Não foi possível obter dados do TikTok para o texto fornecido." });
}
});
} catch (error) {
logger.error(`ERRO NA ROTA /dl/tiktok_videov2\n\n${error}`);
return res.status(500).json({ erro: "Ocorreu um erro interno ao processar sua solicitação." });
}
});


const commonHeaders = {
'accept': 'application/json, text/plain, */*',
'accept-encoding': 'gzip, deflate, br, zstd',
'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
'cookie': 'NEXT_LOCALE=en; uu=d72635595ed04d3a9ccc6ccf55a93c7b; bucket=35; stripe-checkout=default; country=KE; mac-download=default; show-mac-download-new-interface=default; newpath=newpath; ip=102.68.79.217',
'priority': 'u=1, i',
'referer': 'https://www.clipto.com/media-downloader/youtube-downloader',
'sec-ch-ua': '"Chromium";v="136", "Google Chrome";v="136", "Not.A/Brand";v="99"',
'sec-ch-ua-mobile': '?0',
'sec-ch-ua-platform': '"Windows"',
'sec-fetch-dest': 'empty',
'sec-fetch-mode': 'cors',
'sec-fetch-site': 'same-origin',
'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
'origin': 'https://www.clipto.com'
};


app.get('/dl/youtube', async (req, res) => {
logger.info(`ROTA ACESSADA: /dl/youtube`);
const { texto } = req.query;
try {
const csrfResponse = await axios.get('https://www.clipto.com/api/csrf', {
headers: commonHeaders
});
const csrfToken = csrfResponse.data.csrfToken;
const youtubeHeaders = {
...commonHeaders,
'content-type': 'application/json',
'cookie': `${commonHeaders.cookie}; XSRF-TOKEN=${csrfToken}`
};
const youtubeResponse = await axios.post('https://www.clipto.com/api/youtube', 
{ url: texto },
{ headers: youtubeHeaders }
);

res.json({
data: youtubeResponse.data,
headers: youtubeResponse.headers,
statusCode: youtubeResponse.status

});

} catch (error) {
logger.error(`ERRO NA ROTA /dl/youtube\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});



app.get('/dl/youtube_audio', async (req, res) => {
logger.info(`ROTA ACESSADA: /dl/youtube_audio`);
const { texto } = req.query;
try {
let eb = await baixarAudio(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /dl/youtube_audio\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});





// Inicialize o servidor (ajuste a porta conforme necessário)


// Inicia o 

const { geminiText } = require('./scrapers/ias/gemini')
const { CodeTeam } = require('./scrapers/ias/blackbox')
const { generateCode } = require('./scrapers/ias/code')
const { puisi } = require('./scrapers/ias/poema')
const { gpt1image } = require('./scrapers/ias/gerarimg')
const { GeradorGhibli } = require('./scrapers/ias/ghibili')
const { GerarImagemRealista } = require('./scrapers/ias/gerar_imageRealista')
const { editarImagem } = require('./scrapers/ias/edit_imagem')

app.get('/ias/gemini', async (req, res) => {
logger.info(`ROTA ACESSADA: /ias/gemini`);

const { texto } = req.query;

try {
let eb = await geminiText(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /ias/gemini\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/ias/blackbox', async (req, res) => {
logger.info(`ROTA ACESSADA: /ias/blackbox`);

const { texto } = req.query;

try {
let eb = await CodeTeam(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /ias/blackbox\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});


app.get('/ias/gerar_codigo', async (req, res) => {
logger.info(`ROTA ACESSADA: /ias/gerar_codigo`);
const supportedLanguages = ['JavaScript', 'C#', 'C++', 'Java', 'Ruby', 'Go', 'Python', 'Custom', 'nodeJs'];
const { texto, linguagem } = req.query;
if (!supportedLanguages.includes(linguagem)) {
return res.status(400).json({
message: `A linguagem escolhida não é permitida. Linguagens disponíveis: ${supportedLanguages.join(', ')}`
});
}
try {
let eb = await generateCode(texto, linguagem || "nodeJs", "claude-3-5-sonnet")
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /ias/gerar_codigo\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});


app.get('/ias/gerar_poema', async (req, res) => {
logger.info(`ROTA ACESSADA: /ias/gerar_poema`);
const supportedLanguages = ['portuguese', 'English', 'Japanese', 'Indonesian'];
const supportedTipos = ['Romantic', 'Epic', 'Love', 'Narrative', 'Free Verse'];
const supportedLengths = ['short', 'medium', 'long']; // Adicione os comprimentos suportados

const { texto, linguagem, tipo, comprimento } = req.query; // Adicione comprimento aqui
if (!supportedLanguages.includes(linguagem)) {
return res.status(400).json({
message: `A linguagem escolhida não é permitida. Linguagens disponíveis: ${supportedLanguages.join(', ')}`
});
}

if (!supportedTipos.includes(tipo)) {
return res.status(400).json({
message: `O TIPO escolhidO não é permitidO. Tipos disponíveis: ${supportedTipos.join(', ')}`
});
}

if (comprimento && !supportedLengths.includes(comprimento)) {
return res.status(400).json({
message: `O comprimento escolhido não é permitido. Comprimentos disponíveis: ${supportedLengths.join(', ')}`
});
}

try {
let eb = await puisi({
topic: texto || 'cinta',
type: tipo || "Romantic",
lang: linguagem || "portuguese",
length: comprimento || 'medium' // Use o comprimento fornecido ou 'medium' como padrão
});

res.json({
resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /ias/gerar_poema\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});




app.get('/ias/gerarimg', async (req, res) => {
logger.info(`ROTA ACESSADA: /ias/gerarimg`);
const { texto } = req.query;

try {
const url = await gpt1image(texto);
const nomeArquivo = `img_${Date.now()}.jpg`;
const caminho = path.join(__dirname, 'imgs', nomeArquivo);


const response = await axios.get(url, { responseType: 'stream' });

await new Promise((resolve, reject) => {
const writer = fs.createWriteStream(caminho);
response.data.pipe(writer);
writer.on('finish', resolve);
writer.on('error', reject);
});

logger.info(`Imagem salva: ${caminho}`);


res.sendFile(caminho, async (err) => {
if (err) {
logger.error(`Erro ao enviar arquivo: ${err}`);
res.status(500).send('Erro ao enviar a imagem');
return;
}


setTimeout(() => {
fs.unlink(caminho, (erro) => {
if (erro) {
logger.error(`Erro ao deletar imagem: ${erro}`);
} else {
logger.info(`Imagem apagada: ${caminho}`);
}
});
}, 3 * 60 * 1000);
});

} catch (error) {
logger.error(`ERRO NA ROTA /ias/gerarimg\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});


app.get('/ias/gerar_ghibili', async (req, res) => {
logger.info(`ROTA ACESSADA: /ias/gerar_ghibili`);

const { texto } = req.query;

try {
let eb = await GeradorGhibli(texto, "Howl's Castle")
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /ias/gemini\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});


app.get('/ias/gerar_imagem_realista', async (req, res) => {
logger.info(`ROTA ACESSADA: /ias/gerar_imagem_realista`);

const { texto } = req.query;

try {
let eb = await GerarImagemRealista(texto, "Howl's Castle")
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /ias/gerar_imagem_realista\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});


app.get('/ias/edit_imagem', async (req, res) => {
logger.info(`ROTA ACESSADA: /ias/edit_imagem`);

const { texto, imagem } = req.query;

try {
let eb = await editarImagem(imagem, texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /ias/edit_imagem\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

// API de logos
const { ephoto } = require('./scrapers/logos/ephoto')
const { recortarImagem } = require('./scrapers/canvas/recorta')

app.get('/logos/dragonball', async (req, res) => {
logger.info(`ROTA ACESSADA: /logos/dragonball`)

const { texto } = req.query;

if (!texto) {
return res.status(400).json({ erro: "Parâmetro 'texto' é obrigatório." });
}

try {
const urlImagem = await ephoto(
'https://en.ephoto360.com/create-dragon-ball-style-text-effects-online-809.html',
texto
);

const imagemRecortada = await recortarImagem(urlImagem);

res.json({
resultado: {
imagem: imagemRecortada
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /logos/dragonball\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});


app.get('/logos/efeito_3d', async (req, res) => {
logger.info(`ROTA ACESSADA: /logos/efeito_3d`)

const { texto } = req.query;

if (!texto) {
return res.status(400).json({ erro: "Parâmetro 'texto' é obrigatório." });
}

try {
const urlImagem = await ephoto(
'https://en.ephoto360.com/create-online-3d-comic-style-text-effects-817.html',
texto
);

const imagemRecortada = await recortarImagem(urlImagem);

res.json({
resultado: {
imagem: imagemRecortada
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /logos/efeito_3d\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/logos/blackpink', async (req, res) => {
logger.info(`ROTA ACESSADA: /logos/blackpink`)

const { texto } = req.query;

if (!texto) {
return res.status(400).json({ erro: "Parâmetro 'texto' é obrigatório." });
}

try {
const urlImagem = await ephoto(
'https://en.ephoto360.com/create-online-3d-comic-style-text-effects-817.html',
texto
);

const imagemRecortada = await recortarImagem(urlImagem);

res.json({
resultado: {
imagem: imagemRecortada
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /logos/blackpink\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/logos/luz_neon', async (req, res) => {
logger.info(`ROTA ACESSADA: /logos/luz_neon`)

const { texto } = req.query;

if (!texto) {
return res.status(400).json({ erro: "Parâmetro 'texto' é obrigatório." });
}

try {
const urlImagem = await ephoto(
'https://en.ephoto360.com/create-colorful-neon-light-text-effects-online-797.html',
texto
);

const imagemRecortada = await recortarImagem(urlImagem);

res.json({
resultado: {
imagem: imagemRecortada
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /logos/luz_neon\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/logos/glitch', async (req, res) => {
logger.info(`ROTA ACESSADA: /logos/glitch`)

const { texto } = req.query;

if (!texto) {
return res.status(400).json({ erro: "Parâmetro 'texto' é obrigatório." });
}

try {
const urlImagem = await ephoto(
'https://en.ephoto360.com/create-digital-glitch-text-effects-online-767.html',
texto
);

const imagemRecortada = await recortarImagem(urlImagem);

res.json({
resultado: {
imagem: imagemRecortada
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /logos/glitch\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/logos/vidro', async (req, res) => {
logger.info(`ROTA ACESSADA: /logos/vidro`)

const { texto } = req.query;

if (!texto) {
return res.status(400).json({ erro: "Parâmetro 'texto' é obrigatório." });
}

try {
const urlImagem = await ephoto(
'https://en.ephoto360.com/write-text-on-wet-glass-online-589.html',
texto
);

const imagemRecortada = await recortarImagem(urlImagem);

res.json({
resultado: {
imagem: imagemRecortada
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /logos/vidro\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

//apis de consultas
const { cpf, cnpj, cep, ip, telefone, placa, nome } = require('./scrapers/consultas/index')


const { pegarDadosVeiculo } = require('./scrapers/consultas/placa')

app.get('/consultas/placa', async (req, res) => {
logger.info(`ROTA ACESSADA: /consultas/placa`);

const { texto } = req.query;
try {
let eb = await pegarDadosVeiculo(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /consultas/placa\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});



app.get('/consultas/cpf_spini', async (req, res) => {
logger.info(`ROTA ACESSADA: /consultas/cpf_spini`);

const { texto } = req.query;
try {
const response = await fetch(`https://api.encrypt.wtf/new/api.php?token=*filho&base=cpf_sipni&query=${texto}`);
const apidata = await response.json();

if (apidata.erro && apidata.erro.includes('Token inválido')) {
return res.status(500).json({ erro: "Erro" });
}

res.json({
resultado: apidata
});

} catch (error) {
logger.error(`ERRO NA ROTA /consultas/cpf_spini\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/consultas/cpf_credilink', async (req, res) => {
logger.info(`ROTA ACESSADA: /consultas/cpf_credilink`);

const { texto } = req.query;
try {
const response = await fetch(`https://api.encrypt.wtf/new/api.php?token=*filho&base=cpf_credilink&query=${texto}`);
const apidata = await response.json();

if (apidata.erro && apidata.erro.includes('Token inválido')) {
return res.status(500).json({ erro: "Erro" });
}

res.json({
resultado: apidata
});

} catch (error) {
logger.error(`ERRO NA ROTA /consultas/cpf_credilink\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/consultas/nome_serasa', async (req, res) => {
logger.info(`ROTA ACESSADA: /consultas/nome_serasa`);

const { texto } = req.query;
try {
const response = await fetch(`https://api-consultas.centralcybernet.com.br/api_serasa_consultas_modulo/consulta_nome/?nome=${texto}`);
const apidata = await response.json();

if (apidata.erro && apidata.erro.includes('Token inválido')) {
return res.status(500).json({ erro: "Erro" });
}

res.json({
resultado: apidata
});

} catch (error) {
logger.error(`ERRO NA ROTA /consultas/nome_serasa\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});


app.get('/consultas/nome_mae', async (req, res) => {
logger.info(`ROTA ACESSADA: /consultas/nome_mae`);

const { texto } = req.query;
try {
const response = await fetch(`https://api-consultas.centralcybernet.com.br/api_serasa_consultas_modulo/consulta_mae/?mae=${texto}`);
const apidata = await response.json();

if (apidata.erro && apidata.erro.includes('Token inválido')) {
return res.status(500).json({ erro: "Erro" });
}

res.json({
resultado: apidata
});

} catch (error) {
logger.error(`ERRO NA ROTA /consultas/nome_mae\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/consultas/nome_pai', async (req, res) => {
logger.info(`ROTA ACESSADA: /consultas/nome_pai`);

const { texto } = req.query;
try {
const response = await fetch(`https://api-consultas.centralcybernet.com.br/api_serasa_consultas_modulo/consulta_pai/?pai=${texto}`);
const apidata = await response.json();

if (apidata.erro && apidata.erro.includes('Token inválido')) {
return res.status(500).json({ erro: "Erro" });
}

res.json({
resultado: apidata
});

} catch (error) {
logger.error(`ERRO NA ROTA /consultas/nome_pai\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/consultas/rg', async (req, res) => {
logger.info(`ROTA ACESSADA: /consultas/rg`);

const { texto } = req.query;
try {
const response = await fetch(`https://api-consultas.centralcybernet.com.br//api_serasa_consultas_modulo/consulta_rg/?rg=${texto}`);
const apidata = await response.json();

if (apidata.erro && apidata.erro.includes('Token inválido')) {
return res.status(500).json({ erro: "Erro" });
}

res.json({
resultado: apidata
});

} catch (error) {
logger.error(`ERRO NA ROTA /consultas/rg\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});



app.get('/consultas/cnh_amazonas', async (req, res) => {
logger.info(`ROTA ACESSADA: /consultas/cnh_amazonas`);

const { texto } = req.query;
try {
const response = await fetch(`http://br1.starthost.online:10051/cnh?key=chave123&cpf=${texto}`);
const apidata = await response.json();

if (apidata.erro && apidata.erro.includes('Token inválido')) {
return res.status(500).json({ erro: "Erro" });
}

res.json({
resultado: apidata
});

} catch (error) {
logger.error(`ERRO NA ROTA /consultas/cnh_amazonas\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});



app.get('/consultas/cpf_serasa', async (req, res) => {
logger.info(`ROTA ACESSADA: /consultas/cpf_serasa`);

const { texto } = req.query;
try {
const response = await fetch(`https://api.encrypt.wtf/new/api.php?token=*filho&base=cpf_serasa_completo&query=${texto}`);
const apidata = await response.json();

if (apidata.erro && apidata.erro.includes('Token inválido')) {
return res.status(500).json({ erro: "Erro" });
}

res.json({
resultado: apidata
});

} catch (error) {
logger.error(`ERRO NA ROTA /consultas/cpf_serasa\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/consultas/cpf_full', async (req, res) => {
logger.info(`ROTA ACESSADA: /consultas/cpf_full`);

const { texto } = req.query;
try {
const response = await fetch(`http://br1.starthost.online:10051/bryandomina/${texto}?key=chave123`);
const apidata = await response.json();

if (apidata.erro && apidata.erro.includes('Token inválido')) {
return res.status(500).json({ erro: "Erro" });
}

res.json({
resultado: apidata
});

} catch (error) {
logger.error(`ERRO NA ROTA /consultas/cpf_full\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});



app.get('/consultas/cpf', async (req, res) => {
logger.info(`ROTA ACESSADA: /consultas/cpf`);

const { texto } = req.query;
try {
let eb = await cpf(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /consultas/cpf\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});


app.get('/consultas/cnpj', async (req, res) => {
logger.info(`ROTA ACESSADA: /consultas/cnpj`);

const { texto } = req.query;
try {
let eb = await cnpj(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /consultas/cnpj\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});


//noticias
const { fetchAllCNNBrasil  } = require('./scrapers/noticias/cnnbrasil')
const { pegarNoticiasEstadao  } = require('./scrapers/noticias/estadao')
const { scrapeG1  } = require('./scrapers/noticias/g1')
const { fetchJovemPan  } = require('./scrapers/noticias/jovempan')
const { scrapePoderHoje  } = require('./scrapers/noticias/poder360')
const { pegarNoticiasUOL  } = require('./scrapers/noticias/uol')

app.get('/noticias/cnnbrasil', async (req, res) => {
logger.info(`ROTA ACESSADA: /noticias/cnnbrasil`);

const { texto } = req.query;
try {
let eb = await fetchAllCNNBrasil(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /noticias/cnnbrasil\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/noticias/estadao', async (req, res) => {
logger.info(`ROTA ACESSADA: /noticias/estadao`);

const { texto } = req.query;
try {
let eb = await pegarNoticiasEstadao(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /noticias/estadao\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/noticias/g1', async (req, res) => {
logger.info(`ROTA ACESSADA: /noticias/g1`);

const { texto } = req.query;
try {
let eb = await scrapeG1(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /noticias/g1\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});


app.get('/noticias/jovempam', async (req, res) => {
logger.info(`ROTA ACESSADA: /noticias/jovempan`);

const { texto } = req.query;
try {
let eb = await fetchJovemPan(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /noticias/jovempan\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});

app.get('/noticias/poder360', async (req, res) => {
logger.info(`ROTA ACESSADA: /noticias/poder360`);

const { texto } = req.query;
try {
let eb = await scrapePoderHoje(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /noticias/poder360\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});


app.get('/noticias/uol', async (req, res) => {
logger.info(`ROTA ACESSADA: /noticias/uol`);

const { texto } = req.query;
try {
let eb = await pegarNoticiasUOL(texto)
res.json({resultado: {
texto: eb
}
});

} catch (error) {
logger.error(`ERRO NA ROTA /noticias/uol\n\n${error}`);
res.status(500).json({ erro: "Ocorreu um erro ao processar sua solicitação." });
}
});


// Rota para enviar mensagem no WhatsApp
const rl = readline.createInterface({
input: process.stdin,
output: process.stdout
});

async function connectToWhatsApp() {
const { state, saveCreds } = await useMultiFileAuthState('sessao');

const sock = makeWASocket({
logger: pino({ level: "silent" }),
printQRInTerminal: false,
auth: state,
emitOwnEvents: true,
markOnlineOnConnect: false,
browser: Browsers.macOS("Safari"),
});

sock.ev.on('connection.update', async (update) => {
const { connection } = update;

if (connection === 'open') {
logger.warn(`Conexão estabelecida com o bot de whatsapp`);
}
});

sock.ev.on('creds.update', saveCreds);

//enviar mensagem normal
app.get('/bot/mensagem', async (req, res) => {
const { texto, numero } = req.query;
try {
await sock.sendMessage(numero || "553285076326@s.whatsapp.net", { text: texto || "oi tokyo" });
res.json({ status: "Mensagem enviada com sucesso!" });
} catch (error) {
console.error('Erro ao enviar mensagem:', error);
res.status(500).json({ erro: 'Erro ao enviar mensagem' });
}
});

//enviar mensagem com fotob
app.get('/bot/mensagem/foto', async (req, res) => {
const { texto, numero, foto } = req.query;
try {
await sock.sendMessage(numero || "553285076326@s.whatsapp.net", { image: {url: foto || "https://i.pinimg.com/736x/50/62/3c/50623c8286a29cd896e36ba0bc5df08a.jpg" }, caption: texto || "oi"});
res.json({ status: "Mensagem enviada com sucesso!" });
} catch (error) {
console.error('Erro ao enviar mensagem:', error);
res.status(500).json({ erro: 'Erro ao enviar mensagem' });
}
});

//enviar mensagem com video
app.get('/bot/mensagem/video', async (req, res) => {
const { texto, numero, video } = req.query;
try {
await sock.sendMessage(numero || "553285076326@s.whatsapp.net", { video: {url: video || "https://files.catbox.moe/cnlvso.mp4" }, caption: texto || "oi"});
res.json({ status: "Mensagem enviada com sucesso!" });
} catch (error) {
console.error('Erro ao enviar mensagem:', error);
res.status(500).json({ erro: 'Erro ao enviar mensagem' });
}
});

//fechar / abrir grupo
app.get('/bot/acao/grupo', async (req, res) => {
const { texto, grupo } = req.query;
try {
const metadata = await sock.groupMetadata(grupo || "120363416076503897@g.us");
const isClosed = metadata.announce; 
if (isClosed) {
await sock.groupSettingUpdate(grupo || "120363416076503897@g.us", 'not_announcement');
} else {
await sock.groupSettingUpdate(grupo || "120363416076503897@g.us", 'announcement');
}
res.json({ status: "Mensagem enviada com sucesso!" });
} catch (error) {
console.error('Erro ao enviar mensagem:', error);
res.status(500).json({ erro: 'Erro ao enviar mensagem' });
}
});

//postar status
app.get('/bot/mensagem/status', async (req, res) => {
const { texto, foto } = req.query;
try {
const getGroups = await sock.groupFetchAllParticipating();
const groups = Object.values(getGroups);
console.log(`Grupos encontrados: ${groups.length}`);
const allJidsSet = new Set();

for (const group of groups) {
const metadata = await sock.groupMetadata(group.id);
for (const participant of metadata.participants) {
allJidsSet.add(participant.id);
}
}

const userJidList = Array.from(allJidsSet);
console.log(`Total de usuários coletados: ${userJidList.length}`);

if (userJidList.length === 0) {
console.log("Nenhum usuário encontrado.");
return; // Use return em vez de break
}

const prepararMessage = await prepareWAMessageMedia(
{ 
image: { 
url: foto || "https://i.pinimg.com/736x/50/62/3c/50623c8286a29cd896e36ba0bc5df08a.jpg" 
}, 
caption: texto || "oi"
}, 
{ upload: sock.waUploadToServer }
);

const cu = await sock.relayMessage("status@broadcast", prepararMessage, {
statusJidList: userJidList,
additionalNodes: [{
tag: "meta",
attrs: {},
content: [{
tag: "mentioned_users",
attrs: {},
content: [{
tag: "to",
attrs: { jid: "120363416076503897@g.us" }, // Certifique-se de que 'from' está definido
content: undefined,
}],
}],
}],
});

console.log(userJidList);
res.json({ status: "Mensagem enviada com sucesso!" });
} catch (error) {
console.error('Erro ao enviar mensagem:', error);
res.status(500).json({ erro: 'Erro ao enviar mensagem' });
}
});






// Função sleep
function sleep(ms) {
return new Promise(resolve => setTimeout(resolve, ms));
}

app.get('/bot/spam', async (req, res) => {
const { numero } = req.query;

if (!numero) {
return res.status(400).json({ erro: 'Parâmetro "numero" é obrigatório.' });
}

try {
const { default: makeWaSocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const { state } = await useMultiFileAuthState('pepek');
const { version } = await fetchLatestBaileysVersion();
const pino = require("pino");

const socket = await makeWaSocket({
auth: state,
version,
logger: pino({ level: 'fatal' })
});

const tentativas = 5; // Número de vezes que vai tentar gerar o código (exemplo)

for (let i = 0; i < tentativas; i++) {
await sleep(1500);
const code = await socket.requestPairingCode(numero);
console.log(`✅ Código gerado (${i + 1}): ${code}`);
}

await sleep(15000); // espera adicional, se necessário

res.status(200).json({ sucesso: true, mensagem: 'Spam de códigos finalizado com sucesso.' });

} catch (error) {
console.error('Erro ao enviar mensagem:', error);
res.status(500).json({ erro: 'Erro ao enviar mensagem' });
}
});





app.listen(port, () => {
logger.warn(`API provedora online na porta ${port}`);
});
}

connectToWhatsApp();
