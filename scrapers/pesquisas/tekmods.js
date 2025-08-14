const axios = require("axios");
const cheerio = require("cheerio");

async function scrapeTekmods(query) {
    try {
        const url = "https://tekmods.com/?s=" + encodeURIComponent(query);
        const { data } = await axios.get(url);
        const $ = cheerio.load(data);

        const results = [];

        // Percorre cada resultado da lista
        $("#listpost").each((_, el) => {
            const element = $(el);

            const link = element.find("a.archive-post").attr("href") || "";
            const title = element.find("h3").text().trim();
            const image = element.find("img").attr("src") || "";

            const version = element.find(".text-truncate.text-muted span.align-middle").first().text().trim();
            const modDescription = element.find(".text-truncate.text-muted span.align-middle.mt-1").text().trim();

            results.push({
                title,
                link,
                image,
                version,
                modDescription
            });
        });

        // Para cada link, faz uma nova requisição e extrai dados detalhados
        for (let item of results) {
            if (!item.link) continue;
            try {
                const { data: detailHtml } = await axios.get(item.link);
                const $$ = cheerio.load(detailHtml);

                const mainImage = $$("#primary img.wp-post-image").attr("src") || "";
                const fullTitle = $$("#primary h1").text().trim() || "";
                const updatedAt = $$("#primary time").text().trim() || "";
                const developer = $$("#primary a[title^='Developer']").text().trim() || "";

                const infoTable = {};
                $$("#primary table.table tr").each((_, tr) => {
                    const th = $$(tr).find("th").text().trim();
                    const td = $$(tr).find("td").first().text().trim();
                    if (th && td) {
                        infoTable[th] = td;
                    }
                });

                const downloadLink = $$("#primary a.btn.btn-secondary").attr("href") || "";

                item.details = {
                    mainImage,
                    fullTitle,
                    updatedAt,
                    developer,
                    infoTable,
                    downloadLink
                };

            } catch (err) {
                console.error(`Erro ao pegar detalhes de ${item.link}:`, err.message);
            }
        }

        return results; // corrigido

    } catch (error) {
        console.error("Erro ao fazer scrape:", error.message);
    }
}

module.exports = { scrapeTekmods };
