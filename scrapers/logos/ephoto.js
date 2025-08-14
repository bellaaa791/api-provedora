const axios = require('axios');
const cheerio = require('cheerio');

async function ephoto(url, text) {
  const form = new URLSearchParams();
  const gT = await axios.get(url, {
    headers: {
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36"
    }
  });

  const $ = cheerio.load(gT.data);
  const token = $("input[name=token]").val();
  const build_server = $("input[name=build_server]").val();
  const build_server_id = $("input[name=build_server_id]").val();

  form.append("text[]", text);
  form.append("token", token);
  form.append("build_server", build_server);
  form.append("build_server_id", build_server_id);

  const res = await axios.post(url, form.toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "*/*",
      "Accept-Language": "en-US,en;q=0.9",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
      cookie: gT.headers["set-cookie"]?.join("; ") || ""
    }
  });

  const $$ = cheerio.load(res.data);
  const json = JSON.parse($$("input[name=form_value_input]").val());
  json["text[]"] = json.text;
  delete json.text;

  const { data } = await axios.post("https://en.ephoto360.com/effect/create-image", new URLSearchParams(json).toString(), {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/105.0.0.0 Safari/537.36",
      cookie: gT.headers["set-cookie"]?.join("; ") || ""
    }
  });

  const servidor = build_server.endsWith('/') ? build_server : build_server + '/';

  return servidor + data.image;
}

module.exports = { ephoto };
