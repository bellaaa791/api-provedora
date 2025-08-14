const axios = require("axios");
const cheerio = require("cheerio");

async function fetchJovemPan() {
  try {
    const url = "https://jovempan.com.br/";
    const { data: html } = await axios.get(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    const $ = cheerio.load(html);

    const containerHome = $(".container.container-home");

    // Live JP (id jp-news-86)
    const liveJP = [];
    $("#jp-news-86 .item-live").each((i, el) => {
      const item = $(el);
      const link = item.find("a").attr("href");
      const category = item.find(".category-premium-wrapper .category").text().trim();
      const title = item.find("p.title").text().trim();
      const image = item.find(".image img.post-image").attr("src");

      liveJP.push({ link, category, title, image });
    });

    // Notícias destaque (id jp-news-26)
    const destaqueNews = [];
    $("#jp-news-26 .news-big, #jp-news-26 .more-news ul li").each((i, el) => {
      const item = $(el);
      let link, category, title, excerpt, image;

      if (item.hasClass("news-big")) {
        link = item.find("a").attr("href");
        category = item.find(".category-premium-wrapper .category").text().trim();
        title = item.find("h2.title").text().trim();
        excerpt = item.find("p.excerpt").text().trim();
        image = item.find(".container-image-highlight-news img.post-image").attr("src");
      } else {
        link = item.find("a").attr("href");
        title = item.find("p.link-more").text().trim();
      }

      destaqueNews.push({ link, category, title, excerpt, image });
    });

    // Breaking News (id jp-news-14)
    const breakingNews = [];
    $("#jp-news-14 .breaking-content").each((i, el) => {
      const item = $(el);
      const link = item.find("a").attr("href");
      const title = item.find("p.limited-text").text().trim();
      const date = item.find("p.hot-news-date").text().trim();

      breakingNews.push({ link, title, date });
    });

    return {
      liveJP,
      destaqueNews,
      breakingNews,
    };
  } catch (error) {
    console.error("Erro ao buscar Jovem Pan:", error.message);
    return null;
  }
}

module.exports = { fetchJovemPan }
