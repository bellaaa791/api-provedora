const axios = require("axios");
const FormData = require("form-data");
const cheerio = require("cheerio");

async function threads(urls) {
   if (!urls) throw new Error("Masukkan URL Threads");

   try {
      let d = new FormData();
      d.append("url", urls);

      let headers = {
         headers: {
            ...d.getHeaders()
         }
      };

      let { data: s } = await axios.post("https://savemythreads.com/result.php", d, headers);
      let $ = cheerio.load(s);

      let img = [];
      img.push({
         imagesUrl: $('img').attr("src")
      });

      return img;
   } catch (e) {
      console.error(e.message);
   }
}
/*
// Usage
(async () => {
   try {
      const img = await threads("https://www.threads.net/@digaorqs/post/DGyy6R0gQ1N?xmt=AQGzYBs7DcF27sEG1zGccfuK2fO0NlHnKDXNfO63JQJGfQ");
      console.log(img);
   } catch (e) {
      console.error(e.message);
   }
})();


*/

module.exports = { threads }
