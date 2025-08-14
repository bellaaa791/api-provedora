const axios = require('axios');

async function MinecraftStalk(teks) {
    try {
        const response = await axios.get('https://playerdb.co/api/player/minecraft/' + teks);
        const data = response.data;

       const result = {
    usuario: data.data.player.username,
    id: data.data.player.id,
    id_raw: data.data.player.raw_id,
    avatar: data.data.player.avatar,
    textura_da_skin: data.data.player.skin_texture,
    historico_de_nome: data.data.player.name_history
};

console.log(result)
        return result
    } catch (error) {
        return error.message;
    }
}
//return MinecraftStalk("hann");
module.exports = { MinecraftStalk }