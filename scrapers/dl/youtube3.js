// y2mate.js
import fetch from 'node-fetch'; // Certifique-se de que o pacote node-fetch está instalado

const y2mate = {
    headers: {
        "Referer": "https://y2mate.nu/",
        "Origin": "https://y2mate.nu/",
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0"
    },

    hit: async (url, description, returnType = "text") => {
        try {
            const validReturnTypes = ["text", "json"];
            if (!validReturnTypes.includes(returnType)) throw new Error(`Invalid return type: ${returnType}.`);

            const response = await fetch(url, { headers: y2mate.headers });
            const data = await response.text();

            if (!response.ok) throw new Error(`${response.status} ${response.statusText}\n${data.split("\n").slice(0, 4).join("\n") + "\n...." || null}`);

            let result = data;
            if (returnType === "json") {
                try {
                    result = JSON.parse(data);
                } catch (error) {
                    throw new Error(`Failed to parse return type as JSON: ${error.message}`);
                }
            }
            return { result, response };
        } catch (error) {
            throw new Error(`Hit failed on ${description}: ${error.message}`);
        }
    },

    getAuthCode: async () => {
        console.log("[y2mate] Downloading homepage");
        const { result: html, response } = await y2mate.hit("https://y2mate.nu", "hit homepage y2mate");
        const valueOnHtml = html.match(/<script>(.*?)<\/script>/)?.[1];
        if (!valueOnHtml) throw new Error(`Failed to match regex for code value in HTML`);

        try {
            eval(valueOnHtml);
        } catch (error) {
            throw new Error(`Eval failed for valueOnHtml: ${error.message}`);
        }

        const srcPath = html.match(/src="(.*?)"/)?.[1];
        if (!srcPath) throw new Error(`Failed to get srcPath for downloading JavaScript file`);

        const url = new URL(response.url).origin + srcPath;

        console.log("[y2mate] Downloading JS file");
        const { result: jsCode } = await y2mate.hit(url, "download js file y2mate");
        const authCode = jsCode.match(/authorization\(\){(.*?)}function/)?.[1];
        if (!authCode) throw new Error(`Failed to match regex for auth function code`);

        const newAuthCode = authCode.replace("id(\"y2mate\").src", `"${url}"`);

        let authString;
        try {
            authString = eval(`(() => { ${newAuthCode} })()`);
        } catch (error) {
            throw new Error(`Eval failed while trying to get authString: ${error.message}`);
        }

        return authString;
    },

    getYoutubeId: async (youtubeUrl) => {
        console.log("[youtube.com] Getting video ID from your YouTube URL");
        const headers = {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36 Edg/137.0.0.0"
        };
        const resp = await fetch(youtubeUrl, { method: "HEAD", headers });
        if (!resp.ok) throw new Error(`Failed to get video ID: ${resp.status} ${resp.statusText}`);

        let videoId = new URL(resp.url)?.searchParams?.get("v");
        if (!videoId) {
            videoId = resp.url.match(/https:\/\/www.youtube.com\/shorts\/(.*?)(?:\?|$)/)?.[1];
            if (!videoId) throw new Error(`Invalid YouTube link provided`);
        }
        return { videoId, url: resp.url };
    },

    download: async (youtubeUrl, format = "mp3") => {
        const validFormats = ["mp3", "mp4"];
        if (!validFormats.includes(format)) throw new Error(`${format} is an invalid format. Available formats: ${validFormats.join(", ")}`);

        const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

        const { videoId, url } = await y2mate.getYoutubeId(youtubeUrl);
        const authCode = await y2mate.getAuthCode();

        console.log("[y2mate] Hitting init API");
        const url1 = `https://d.ecoe.cc/api/v1/init?a=${authCode}&_=${Math.random()}`;
        const { result: resultInit } = await y2mate.hit(url1, "init API", "json");
        if (resultInit.error !== "0") throw new Error(`Error in init API: ${resultInit}`);

        console.log("[y2mate] Hitting convert URL");
        const url2 = new URL(resultInit.convertURL);
        url2.searchParams.append("v", videoId);
        url2.searchParams.append("f", format);
        url2.searchParams.append("_", Math.random());
        const { result: resultConvert } = await y2mate.hit(url2, "hit convert", "json");
        let { downloadURL, progressURL, redirectURL, error: errorFromConvertUrl } = resultConvert;
        if (errorFromConvertUrl) throw new Error(`Error found after fetching convertURL: probably bad YouTube video ID`);

        if (redirectURL) {
            ({ downloadURL, progressURL } = (await y2mate.hit(redirectURL, "fetch redirectURL", "json")).result);
            console.log(`[y2mate] Got redirected`);
        }

        let { error, progress, title } = {};
        while (progress !== 3) {
            const api3 = new URL(progressURL);
            api3.searchParams.append("_", Math.random());

            ({ error, progress, title } = (await y2mate.hit(api3, "check progressURL", "json")).result);

            let status = progress === 3 ? "UwU sucesso 🎉" :
                progress === 2 ? "(👉ﾟヮﾟ)👉 poke server" :
                progress === 1 ? "(👉ﾟヮﾟ)👉 poke server" :
                progress === 0 ? "(👉ﾟヮﾟ)👉 poke server" : "❌ tetot";

            console.log(status);

            if (error) throw new Error(`There was an error value while doing loop check. The error code is ${error}. Probably the video is too long or not compatible or > 45 mins`);
            if (progress !== 3) await delay(5000);
        }

        const result = { title, downloadURL, url };
        return result;
    },
};

// Exportando a função download
export const downloadYoutubeVideo = (youtubeUrl, format = "mp3") => {
    return y2mate.download(youtubeUrl, format);
};

