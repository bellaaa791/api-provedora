const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require('fs');
const { Hercai } = require('hercai');
const axios = require('axios');
//ABAIXO CONTEM AS CONFIGURAÇÕES NESCESSÁRIAS PARA RODAR O SCRIPT\\
const APIKEY_GEMINI = 'AIzaSyBPqhVneCx0c4ZkcUszV6rkc7FJtb43Wr0';


//GEMINI PRO TEXTO\\
async function geminiProText(query) {
try {
const genAI = new GoogleGenerativeAI(APIKEY_GEMINI);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
const resultado = await model.generateContent(query); 
let resposta = resultado.response.text();
return resposta
} catch (erro) {
console.log(erro)
}
}



//GEMINI SOMENTE TEXTO\\
async function geminiText(query) {
const genAI = new GoogleGenerativeAI(APIKEY_GEMINI);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
const resultado = await model.generateContent(query); 
let resposta = resultado.response.text();
return resposta
}

//GEMINI PRO IMAGE\\
async function geminiVerImg(query, imageUrl) {
const genAI = new GoogleGenerativeAI(APIKEY_GEMINI);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
let image;
if (imageUrl && (imageUrl.startsWith("http://") || imageUrl.startsWith("https://"))) {
const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
const mimeType = response.headers['content-type']
image = {
inlineData: {
data: Buffer.from(response.data).toString('base64'),
mimeType: mimeType,
},
};
} else {
const buffer = fs.readFileSync('./foto.png');
image = {
inlineData: {
data: Buffer.from(buffer).toString('base64'),
mimeType: 'image/png',
},
};
}

const resultado = await model.generateContent([query, image]);
let resposta = resultado.response.text();
return resposta
}

//HERCAI AI\\
async function OrbitalText(model, query) {
try {
const herc = new Hercai(); 
const response = await herc.question({ model: model, content: query});
let resposta = response.reply;
return resposta;
} catch (error) {
console.error("Erro ao chamar o modelo Hercai:", error);
throw error;
}
}

//HERCAI AI IMAGE\\
async function OrbitalImg(model, query) {
try {
const herc = new Hercai(); 
const negativePrompt = ""
const response = await herc.drawImage({
model: model,
prompt: query,
negative_prompt: negativePrompt
});
let resposta = response.url;
return resposta;
} catch (error) {
console.error("Erro ao gerar imagem com o modelo Hercai:", error);
throw error;
}
}


module.exports = { 
geminiText,
geminiProText,
geminiVerImg,
OrbitalText,
OrbitalImg
}