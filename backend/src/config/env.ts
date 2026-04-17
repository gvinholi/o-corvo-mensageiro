import dotenv from "dotenv";

dotenv.config();

export const env = {
    PORT: process.env.PORT || 3000,
    ML_ACCESS_TOKEN: process.env.ML_ACCESS_TOKEN,
    ML_REFRESH_TOKEN: process.env.ML_REFRESH_TOKEN,
    TELEGRAM_TOKEN: process.env.TELEGRAM_TOKEN,
    TELEGRAM_CHAT_ID: process.env.TELEGRAM_CHAT_ID,
};