const config = require('./jsons/config.json');
const resposta = require('./jsons/respostas.json');
const axios = require('axios')
const prefixo = config.prefixo
const urlapi = config.urlapi
const apikey = config.apikey
const numerodono = config.numero_dono + '@s.whatsapp.net'
const fotos = require('./jsons/fotos.json');
const fotomenu = fotos.fotomenu;
const fotocanal = fotos.fotocanal
const fs = require('fs')
const { prepareWAMessageMedia, proto, isJidNewsletter } = require("baileys-pro");

const RESET = "\x1b[0m";
const RED = "\x1b[31m";
const GREEN = "\x1b[32m";
const YELLOW = "\x1b[33m";
const WHITE = "\x1b[37m";

module.exports = async function handleMessage(sock, mek) {
try {
const { query, sendNode } = sock
const conn = black = vncs = sock
const m = info = mek
if (mek.mtype === "protocolMessage") return;
const body = (mek.mtype === 'interactiveResponseMessage')
? JSON.parse(mek.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id
: (mek.mtype === 'conversation')
? mek.message.conversation
: (mek.mtype === 'deviceSentMessage')
? mek.message.extendedTextMessage.text
: (mek.mtype === 'imageMessage')
? mek.message.imageMessage.caption
: (mek.mtype === 'videoMessage')
? mek.message.videoMessage.caption
: (mek.mtype === 'extendedTextMessage')
? mek.message.extendedTextMessage.text
: (mek.mtype === 'buttonsResponseMessage')
? mek.message.buttonsResponseMessage.selectedButtonId
: (mek.mtype === 'listResponseMessage')
? mek.message.listResponseMessage.singleSelectReply.selectedRowId
: (mek.mtype === 'templateButtonReplyMessage')
? mek.message.templateButtonReplyMessage.selectedId
: (mek.mtype === 'messageContextInfo')
? (mek.message.buttonsResponseMessage?.selectedButtonId || mek.message.listResponseMessage?.singleSelectReply.selectedRowId || mek.text)
: "";

const budy = (typeof mek.text === 'string') ? mek.text : "";
const isCmd = body && body.startsWith(prefixo);
const command = isCmd ? body.slice(prefixo.length).trim().split(/ +/)[0].toLowerCase() : "";
const args = body && body.trim().split(/ +/).slice(1);
const q = args.join(' ')
const from = mek.key.remoteJid;
const sender = m.sender
const pushname = m.pushName
const isGroup = from.endsWith("@g.us");
let contextInfo = null;
for (const key in mek.message) {
if (mek.message[key]?.contextInfo) {
contextInfo = mek.message[key].contextInfo;
break;
}
}


const dono = numerodono.includes(sender)
if (config.botoff && !dono) {
return;
}

const enviar = async (texto) => {
sock.sendMessage(from, { 
text: texto}, {quoted: info})
}

const fetchJson = (url, options) => new Promise(async (resolve, reject) => {
fetch(url, options)
.then(response => response.json())
.then(json => {
resolve(json)
})
.catch((err) => {
reject(err)
})
});

const newsletterInfo = contextInfo?.forwardedNewsletterMessageInfo || null;
const newsletterId = newsletterInfo?.newsletterJid || "N/A";
const newsletterName = newsletterInfo?.newsletterName || "N/A";

if (m.message) {
console.log(`╭─────────────────────────────────
│
│〔 ${RED}PRIVADO${RESET} 〕: ${WHITE}${from}${RESET}
│
│〔 ${RED}DE${RESET} 〕: ${YELLOW}${sender}${RESET}
│〔 ${RED}MENSAGEM${RESET} 〕: ${GREEN}${typeof body === "string" && body.length <= 1000 ? body : ""}${RESET}
│〔 ${RED}NiCK${RESET} 〕: ${GREEN}${pushname}${RESET}
│〔 ${RED}NEWSLETTER iD${RESET} 〕: ${GREEN}${newsletterId}${RESET}
│〔 ${RED}NEWSLETTER NAME${RESET} 〕: ${GREEN}${newsletterName}${RESET}
╰─────────────────────────────────`)
}


if (!isCmd) return;

switch (command) {

/*

case 'status':
const userJidList = (await conn.groupMetadata(from)).participants.map(p => p.id);
prepararMessage = await prepareWAMessageMedia({ image: { url: "https://avatarfiles.alphacoders.com/364/364731.png" } }, { upload: conn.waUploadToServer })
const cu = await conn.relayMessage("status@broadcast", prepararMessage, {
statusJidList: userJidList,
additionalNodes: [{
tag: "meta",
attrs: {},
content: [{
tag: "mentioned_users",
attrs: {},
content: [{
tag: "to",
attrs: { jid: from },
content: undefined,
}],
}],
}],
});
await conn.relayMessage(from, proto.Message.fromObject({
"groupStatusMentionMessage": {
"message": {
"protocolMessage": {
"key": {
"remoteJid": "status@broadcast",
"fromMe": true,
"id": cu
},
"type": "STATUS_MENTION_MESSAGE"
}
}
}
}), {})
break;

*/

case 'divulgar_canal':
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
break;
}

prepararMessage = await prepareWAMessageMedia({ image: { url: fotocanal }, caption: q}, { upload: sock.waUploadToServer })
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
attrs: { jid: from },
content: undefined,
}],
}],
}],
});
console.log(userJidList)
break 

case 'divulgar': {
console.log("Iniciando divulgação...");

// Buscar todos os grupos
const getGroups = await sock.groupFetchAllParticipating();
const groups = Object.values(getGroups);
console.log(`Grupos encontrados: ${groups.length}`);

// Coletar todos os participantes de todos os grupos
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
break;
}

// Preparar a mídia
const prepararMessage = await prepareWAMessageMedia(
{
image: { url: fotocanal }
},
{ upload: sock.waUploadToServer }
);

// Postar o status com menções
try {
await sock.relayMessage("status@broadcast", prepararMessage, {
statusJidList: userJidList,
additionalNodes: [{
tag: "meta",
attrs: {},
content: [{
tag: "mentioned_users",
attrs: {},
content: userJidList.map(jid => ({
tag: "to",
attrs: { jid },
content: [],
})),
}],
}],
});

console.log("✅ Status postado com menções para todos os usuários!");
} catch (err) {
console.error("❌ Erro ao postar status com menções:", err);
}
console.log(userJidList)
break;
}



 case 'status2':
sock.sendStatusMentions({ image: {url: fotomenu}, caption: "teste"}, [from] );
break

case 'status3':
sock.sendStatusMentions({ video: {url: "https://files.catbox.moe/42x5cy.mp4"}, caption: "🐥💨💨" }, [from] );
break


case 'status4':
sock.sendStatus({ text: "o"});
break

 //INICIO MENUS
case 'menu':
texto = `
乂 ⌬ M E N U - D O W N L O A D S
ャ □ ${prefixo}capcut
ャ □ ${prefixo}facebook
ャ □ ${prefixo}pinterest_mp4
ャ □ ${prefixo}pinterest_mp4-2
ャ □ ${prefixo}tiktok_mp4
ャ □ ${prefixo}tiktok_mp3

乂 ⌬ M E N U - S T A L K S 
ャ □ ${prefixo}stalk_kwai
ャ □ ${prefixo}stalk_xvideos
ャ □ ${prefixo}
ャ □ ${prefixo}
ャ □ ${prefixo}
ャ □ ${prefixo}
ャ □ ${prefixo}
ャ □ ${prefixo}
ャ □ ${prefixo}
ャ □ ${prefixo}
ャ □ ${prefixo}
ャ □ ${prefixo}
ャ □ ${prefixo}
ャ □ ${prefixo}


`
sock.sendMessage(from, {image: {url:fotomenu}, caption: texto}, {quoted:info})
break

//INICIO COMANDOS DE DOWNLOADS

case 'capcut':
if(!q) return enviar('*Coloque o linkde um vídeo do capcut :)🩷*')
enviar('*Processando...*')
try {
const api = await fetchJson(urlapi + `api/downloads/capcut?texto=${q}&apikey=${apikey}`)
const videoUrl = api.resultado.texto.medias.url;
const response = await axios.get(videoUrl, {
responseType: 'arraybuffer' 
});
const videoBuffer = Buffer.from(response.data);

const texto = `
*Título:* ${api.resultado.texto.title || "Indisponivel"}
`
sock.sendMessage(from, {video: videoBuffer, caption: texto}, {quoted:info})
} catch(error) {
enviar('*Deu erro :(*')
console.log(error)
}
break 

case 'facebook':
if(!q) return enviar('*Coloque o linkde um vídeo do facebook :)🩷*')
enviar('*Processando...*')
try {
const api = await fetchJson(urlapi + `api/downloads/facebook?texto=${q}&apikey=${apikey}`)
const videoUrl = api.resultado.texto.video_hd;
const response = await axios.get(videoUrl, {
responseType: 'arraybuffer' 
});
const videoBuffer = Buffer.from(response.data);

const texto = `
*Título:* ${api.resultado.texto.titulo || "Indisponivel"}
`
sock.sendMessage(from, {video: videoBuffer, caption: texto}, {quoted:info})
} catch(error) {
enviar('*Deu erro :(*')
console.log(error)
}
break 

case 'pinterest_mp4':
if(!q) return enviar('*Coloque o linkde um vídeo do pinterest :)🩷*')
enviar('*Processando...*')
try {
const api = await fetchJson(urlapi + `api/downloads/pinterest_mp4?texto=${q}&apikey=${apikey}`)
const videoUrl = api.resultado.texto.video;
const response = await axios.get(videoUrl, {
responseType: 'arraybuffer' 
});
const videoBuffer = Buffer.from(response.data);
const texto = `
*Título:* ${api.resultado.texto.titulo || "Indisponivel"}
`
sock.sendMessage(from, {video: videoBuffer, caption: texto}, {quoted:info})
} catch(error) {
enviar('*Deu erro :(*')
console.log(error)
}
break

case 'pinterest_mp4-2':
if(!q) return enviar('*Coloque o linkde um vídeo do pinterest :)🩷*')
enviar('*Processando...*')
try {
const api = await fetchJson(urlapi + `api/downloads/pinterest_mp4V2?texto=${q}&apikey=${apikey}`)
const videoUrl = api.resultado.texto.download;
const response = await axios.get(videoUrl, {
responseType: 'arraybuffer' 
});
const videoBuffer = Buffer.from(response.data);
const texto = `
*Título:* ${api.resultado.texto.titulo || "Indisponivel"}
*Data:* ${api.resultado.texto.upload || "Indisponivel"}
`
sock.sendMessage(from, {video: videoBuffer, caption: texto}, {quoted:info})
} catch(error) {
enviar('*Deu erro :(*')
console.log(error)
}
break

case 'tiktok_mp4':
if(!q) return enviar('*Coloque o linkde um vídeo do tiktok :)🩷*')
enviar('*Processando...*')
try {
const api = await fetchJson(urlapi + `api/downloads/tiktok_videoV2?texto=${q}&apikey=${apikey}`)
const videoUrl = api.resultado.vídeo.endereçoPlay[0];
const response = await axios.get(videoUrl, {
responseType: 'arraybuffer' 
});
const videoBuffer = Buffer.from(response.data);
const texto = `
*Comentários:* ${api.resultado.estatísticas.comentários || "Indisponivel"}
*Curtidas:* ${api.resultado.estatísticas.curtidas || "Indisponivel"}
*Downloads:* ${api.resultado.estatísticas.downloads || "Indisponivel"}
*Visualizações:* ${api.resultado.estatísticas.visualizações || "Indisponivel"}
*Compartilhamentos:* ${api.resultado.estatísticas.compartilhamentos || "Indisponivel"}
*Favoritos:* ${api.resultado.estatísticas.favoritos || "Indisponivel"}
*Qualidade:* ${api.resultado.vídeo.qualidade || "Indisponivel"}
`
sock.sendMessage(from, {video: videoBuffer, caption: texto}, {quoted:info})
} catch(error) {
enviar('*Deu erro :(*')
console.log(error)
}
break

case 'tiktok_mp3':
if(!q) return enviar('*Coloque o linkde um vídeo do tiktok :)🩷*')
enviar('*Processando...*')
try {
const api = await fetchJson(urlapi + `api/downloads/tiktok_audioV2?texto=${q}&apikey=${apikey}`)
const audioUrl = api.resultado.música.url[0];
const response = await axios.get(audioUrl, {
responseType: 'arraybuffer' 
});
const audioBuffer = Buffer.from(response.data);
const texto = `
*Comentários:* ${api.resultado.estatísticas.comentários || "Indisponivel"}
*Curtidas:* ${api.resultado.estatísticas.curtidas || "Indisponivel"}
*Downloads:* ${api.resultado.estatísticas.downloads || "Indisponivel"}
*Visualizações:* ${api.resultado.estatísticas.visualizações || "Indisponivel"}
*Compartilhamentos:* ${api.resultado.estatísticas.compartilhamentos || "Indisponivel"}
*Favoritos:* ${api.resultado.estatísticas.favoritos || "Indisponivel"}`
enviar(texto)
sock.sendMessage(from, {audio: audioBuffer, fileName: 'audio.mp3', mimetype: "audio/mpeg"}, {quoted:info})
} catch(error) {
enviar('*Deu erro :(*')
console.log(error)
}
break

 //INICIO COMANDOS DE STALKS
case 'stalk_kwai':
if(!q) return enviar('*Coloque o nome de um usuário :)🩷*')
try {
const api = await fetchJson(urlapi + `api/stalks/kwai?texto=${q}&apikey=${apikey}`)
texto = `
*----乂 ⌬ S T A L K - K W A I*
*ャ □ Nome:* ${api.resultado.texto.nome || "indisponivel"}
*ャ □ Nome de usuário :* ${api.resultado.texto.nome_usuario || "indisponivel"}
*ャ □ Criação:* ${api.resultado.texto.data_criação || "indisponivel"}
*ャ □ Seguidores:* ${api.resultado.texto.seguidores || "indisponivel"}
*ャ □ Seguindo:* ${api.resultado.texto.seguindo || "indisponivel"}
*ャ □ Curtidas:* ${api.resultado.texto.curtidas || "indisponivel"}
*ャ □ Bio:* ${api.resultado.texto.bio || "indisponivel"}
*ャ □ Vídeos:* ${api.resultado.texto.total_videos || "indisponivel"}`
sock.sendMessage(from, {image: {url:api.resultado.texto.foto_perfil || fotomenu}, caption: texto}, {quoted:info})
break
} catch(error) {
enviar('*Deu erro :(*')
console.log(error)
}
break

case 'stalk_xvideos':
if(!q) return enviar('*Coloque o nome de um usuário :)🩷*')
try {
const api = await fetchJson(urlapi + `api/stalks/xvideos?texto=${q}&apikey=${apikey}`)
texto = `
*----乂 ⌬ S T A L K - X V I D E O S*
*ャ □ Nome de usuário :* ${api.resultado.texto.Usuário || "indisponivel"}
*ャ □ Ultima atividade:* ${api.resultado.texto.Última_atividade || "indisponivel"}
*ャ □ Inscritos:* ${api.resultado.texto.Inscritos || "indisponivel"}
*ャ □ Seguindo:* ${api.resultado.texto.seguindo || "indisponivel"}
*ャ □ Curtidas:* ${api.resultado.texto.curtidas || "indisponivel"}
*ャ □ Descrição:* ${api.resultado.texto.Descrição || "indisponivel"}
*ャ □ Vídeos:* ${api.resultado.texto.Quantidade_de_vídeos || "indisponivel"}
*ャ □ Vídeos no Red:* ${api.resultado.texto.Quantidade_de_vídeos_no_RED || "indisponivel"}
*ャ □ Views no perfil:* ${api.resultado.texto.Visualizações_do_perfil || "indisponivel"}
*ャ □ Data registro:* ${api.resultado.texto.Data_de_registro || "indisponivel"}`
sock.sendMessage(from, {image: {url:api.resultado.texto.Foto_perfil || fotomenu}, caption: texto}, {quoted:info})
break
} catch(error) {
enviar('*Deu erro :(*')
console.log(error)
}
break

case 'stalk_pornhub':
if(!q) return enviar('*Coloque o nome de um usuário :)🩷*')
try {
const api = await fetchJson(urlapi + `api/stalks/pornhub?texto=${q}&apikey=${apikey}`)
texto = `
*----乂 ⌬ S T A L K - P O R NH U B*
*ャ □ Nome de usuário :* ${api.resultado.texto.Nome || "indisponivel"}
*ャ □ Inscritos:* ${api.resultado.texto.Inscritos || "indisponivel"}
*ャ □ Ranking Geral:* ${api.resultado.texto.Ranking_Geral || "indisponivel"}
*ャ □ Ranking Semanal:* ${api.resultado.texto.Ranking_Semanal || "indisponivel"}
*ャ □ Ranking Mensal:* ${api.resultado.texto.Ranking_Mensal || "indisponivel"}
*ャ □ Views de Vídeo:* ${api.resultado.texto.Visualizações_do_vídeo || "indisponivel"}
*ャ □ Bio:* ${api.resultado.texto.Bio || "indisponivel"}`
sock.sendMessage(from, {image: {url:api.resultado.texto.Avatar || fotomenu}, caption: texto}, {quoted:info})
break
} catch(error) {
enviar('*Deu erro :(*')
console.log(error)
}
break 



case "ping":
await sock.sendMessage(from, { text: "🏓 Pong!" }, { quoted: mek });
break;

case 'stop':
conn.newsletterAction("120363419707933411@newsletter", "unfollow")
break

case 'seguir':
conn.newsletterAction("120363419707933411@newsletter", "follow")
break
case 'mek':
enviar('ok')
console.log(info)
break



case 'menu..':
await conn.relayMessage(from, proto.Message.fromObject({
"ephemeralMessage": {
"message": {
"viewOnceMessage": {
"message": {
"buttonsMessage": {
"imageMessage": (await prepareWAMessageMedia({
"image": {
"url": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTdv7NJ_3d5AKb2kAp32U_QPLrZM_sUa3ZHEA&usqp=CAU"
}
}, {
"upload": conn.waUploadToServer
})).imageMessage,
"contentText": `mensagem que vai ficar na lista, em cima do footer, vncs gayKKKKKKKKKKKKKKKKKKKKKKKKKKKKK`,
"footerText": "Selecione a opção abaixo:",
"buttons": [{
"buttonId": `${prefixo}ping`,
"buttonText": {
"displayText": " ' ping"
},
"type": "RESPONSE",
"nativeFlowInfo": {
"name": "single_select",
"paramsJson": JSON.stringify({
"title": "𝖢𝖫𝗂𝖢𝖪",
"sections": [{
"title": "𝖢𝖬𝖣 -",
"rows": [
{
"title": "𝗆𝖾𝗇𝗎",
"description": " ' 𝗆𝖾𝗇𝗎",
"id": `${prefixo}menu`
},
{
"title": "ping",
"description": " ' ping",
"id": `${prefixo}ping`
}
]
}]
})
}
}],
"headerType": "IMAGE",
}
}
}
}
}
}), {})
break

case 'butto......n':
await conn.relayMessage(from, proto.Message.fromObject({
viewOnceMessage: {
message: {
buttonsMessage: {
contentText: 'texto acima do footer',
footerText: "footer do botão",
buttons: [{
buttonId: `${prefixo}ping`,
buttonText: {
displayText: " ' ping"
},
type: "RESPONSE",
}
],
headerType: 1
}
}
}
}), {});
break;





default:
await sock.sendMessage(from, { text: "❌ Comando não reconhecido." }, { quoted: mek });
break;
}

} catch (err) {
console.error(`${RED}[ERRO] no cases.js:${RESET}`, err);
}
};

fs.watchFile(require.resolve(__filename), () => {
fs.unwatchFile(require.resolve(__filename))
console.log(`Atualizado ${__filename}`)
delete require.cache[require.resolve(__filename)]
require(require.resolve(__filename))
});
