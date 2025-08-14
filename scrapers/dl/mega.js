const { File } = require("megajs");
async function getFileDetails(url) {
try {
const fileInfo = await File.fromURL(url);
await fileInfo.loadAttributes();
const dataFileBuffer = await fileInfo.downloadBuffer();
function formatSize(bytes) {
if (bytes >= 1073741824) return (bytes / 1073741824).toFixed(2) + " GB";
else if (bytes >= 1048576) return (bytes / 1048576).toFixed(2) + " MB";
else if (bytes >= 1024) return (bytes / 1024).toFixed(2) + " KB";
else if (bytes > 1) return bytes + " bytes";
else if (bytes == 1) return bytes + " byte";
return "0 bytes";
}
return {
name: fileInfo.name,
size: formatSize(fileInfo.size),
downloadLink: dataFileBuffer
};
} catch (error) {
throw new Error("Erro ao obter informações do arquivo: " + error.message);
}
}
module.exports = { getFileDetails }
// Exemplo de uso:
/*(async () => {
const url = "sua_url_aqui";// Insira o link do arquivo Mega.nz
const details = await getFileDetails(url);
console.log(details);// Mostra nome, tamanho, link e buffer de dados
})();
*/