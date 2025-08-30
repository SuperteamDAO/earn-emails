import { Bot } from 'grammy';

const token = process.env.TELEGRAM_USER_BOT_TOKEN;
if (!token) throw new Error('TELEGRAM_USER_BOT_TOKEN is unset');

const telegramUserBot = new Bot(token);

export { telegramUserBot };
