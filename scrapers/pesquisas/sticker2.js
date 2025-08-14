import axios from "axios";
import * as cheerio from "cheerio";

export const searchStickers = async (searchQuery) => {
    const searchUrl = `https://stickers.cloud/id/cari?q=${encodeURIComponent(searchQuery)}`;
    const response = await axios.get(searchUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:117.0) Gecko/20100101 Firefox/117.0",
            "Accept-Language": "en-US,en;q=0.9"
        }
    });
    const $ = cheerio.load(response.data);
    const results = [];
    $("div.white.rounded.list-item.mt-4.default-shadow a").each((_, el) => {
        const link = $(el).attr("href");
        if (link && link.startsWith("/id/paket/")) {
            results.push(`https://stickers.cloud${link}`);
        }
    });

    console.log("Resultados da pesquisa:", results); // Mostra no console
    return results;
};

export const downloadStickers = async (stickerUrl) => {
    const response = await axios.get(stickerUrl, {
        headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:117.0) Gecko/20100101 Firefox/117.0",
            "Accept-Language": "en-US,en;q=0.9"
        }
    });
    const $ = cheerio.load(response.data);
    const images = [];
    $("div.whatsapp-background div.row div img").each((_, el) => {
        const imgUrl = $(el).attr("src");
        if (imgUrl) images.push(imgUrl);
    });

    console.log("Imagens baixadas:", images); // Mostra no console
    return images;
};

// Testando a função de busca
searchStickers("anime")
    .then((results) => {
        if (results.length > 0) {
            return downloadStickers(results[0]); // Baixa stickers do primeiro link encontrado
        } else {
            console.log("Nenhum sticker encontrado.");
        }
    })
    .then((images) => {
        if (images) console.log("Stickers encontrados:", images);
    })
    .catch(console.error);
    