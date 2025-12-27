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

        const response = await axios({
            url,
            method,
            params,
            data: body,
            headers: {
                ...headers,
                "X-Auth-Token": process.env.FOOTBALL_DATA_API_KEY, // token do .env
            },
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
