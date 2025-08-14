const axios = require("axios");

async function removebg(buffer) {
    try {
        const image = buffer.toString("base64");
        const res = await axios.post(
            "https://us-central1-ai-apps-prod.cloudfunctions.net/restorePhoto", {
                image: `data:image/png;base64,${image}`,
                model: "fb8af171cfa1616ddcf1242c093f9c46bcada5ad4cf6f2fbe8b81b330ec5c003",
            }
        );

        const data = res.data;

        if (!data) {
            throw new Error("failed to removebg image");
        }

        console.log(res.status, data);
        return data; // Retorna os dados diretamente

    } catch (e) {
        console.log(e);
        return { msg: e.message }; // Retorna o erro com a mensagem correta
    }
}

module.exports = { removebg };
