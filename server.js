require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const TOKEN = process.env.BOT_TOKEN;
const CHAT_ID = process.env.CHAT_ID;

// Проверка, чтобы сервер не запускался без переменных
if (!TOKEN || !CHAT_ID) {
    console.error("❌ BOT_TOKEN или CHAT_ID не заданы");
    process.exit(1);
}

app.post("/send", async (req, res) => {
    const { name, phone } = req.body;

    if (!name || !phone) {
        return res.status(400).json({ success: false });
    }

    const message = `
📩 Новая заявка
👤 Имя: ${name}
📞 Телефон: ${phone}
`;

    try {
        const telegramResponse = await fetch(
            `https://api.telegram.org/bot${TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                }),
            }
        );

        const data = await telegramResponse.json();

        if (!data.ok) {
            console.error("Ошибка Telegram:", data);
            return res.status(500).json({ success: false });
        }

        console.log("✅ Отправлено в Telegram");
        res.json({ success: true });

    } catch (error) {
        console.error("Server error:", error);
        res.status(500).json({ success: false });
    }
});

// ВАЖНО ДЛЯ RENDER
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});