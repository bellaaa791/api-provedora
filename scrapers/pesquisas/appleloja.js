const axios = require("axios");
const cheerio = require("cheerio");

async function kontol(url) {
    try {
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);

        const rawName = $("h1.product-header__title").text().trim();
        const [name, ageRating] = rawName.split("\n").map(text => text.trim());

        const description = $(".section__description").first().text().trim().replace(/\s+/g, " ");

        const category = $(".information-list__item__definition a").first().text().trim();
        const developer = {
            name: $(".information-list__item__definition").eq(0).text().trim(),
            url: $(".information-list__item__definition a").first().attr("href"),
        };

        const rating = {
            value: parseFloat($(".we-customer-ratings__averages__display").text().trim()),
            count: parseInt($(".we-customer-ratings__count").text().replace(/[^\d]/g, ""), 10),
        };

        console.log({ name, age_rating: ageRating, description, category, developer, rating }); // Exibe os dados no console
        return { name, age_rating: ageRating, description, category, developer, rating };
    } catch (error) {
        console.error("Error scraping App Store:", error.message);
        throw new Error("Gagal mengambil data.");
    }
}

// Chamada correta para exibir os resultados no console
kontol("https://apps.apple.com/id/app/pou/id575154654")
    .then(console.log)
    .catch(console.error);
    