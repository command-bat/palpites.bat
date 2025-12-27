const axios = require("axios");

exports.isAdmin = async (req, res) => {

    res.json("É admin");
};


exports.fetch = async (req, res) => {
    try {
        const {
            url,
            method = "GET",
            params = {},
            body = {},
            headers = {},
        } = req.body;

        if (!url) {
            return res.status(400).json({ error: "URL é obrigatória" });
        }

        const parsedUrl = new URL(url);

        const finalHeaders = { ...headers };

        // só adiciona a API key se for football-data
        if (parsedUrl.origin === "https://api.football-data.org") {
            finalHeaders["X-Auth-Token"] = process.env.FOOTBALL_DATA_API_KEY;
        }

        const response = await axios({
            url,
            method,
            params,
            data: body,
            headers: finalHeaders,
        });

        return res.json(response.data);
    } catch (error) {
        console.error("[FETCH ERROR]", error.response?.data || error.message);

        return res.status(error.response?.status || 500).json({
            error: "Erro ao buscar dados da API",
            details: error.response?.data || null,
        });
    }
};
