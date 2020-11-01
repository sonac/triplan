import fetch from 'node-fetch';
import {Telegraf} from 'telegraf';

export interface TelegramInfo {
  email: string;
  chatId: number;
  firstName: string | null;
  username: string | null;
}

const bot = new Telegraf(process.env.BOT_TOKEN || '');
const TRIPLAN_HOST = process.env.TRIPLAN_HOST || 'localhost';
const TRIPLAN_PORT = process.env.TRIPLAN_PORT || '8080';
bot.start((ctx: any) =>
  ctx.reply(
    'Welcome! To activate me, give me an email from your triplan account, so I can connect you'
  )
);
bot.help((ctx: any) => ctx.reply('Send me a sticker'));
bot.on('sticker', (ctx: any) => ctx.reply('👍'));
bot.hears('hi', (ctx: any) => {
  return ctx.reply('Hey there!');
});
bot.on('message', async (ctx: any) => {
  console.log(ctx.message);
  const msg = ctx.message.text;
  if (msg.includes('@')) {
    const chat = await ctx.getChat();
    const body: TelegramInfo = {
      email: msg,
      chatId: chat.id,
      firstName: chat.first_name,
      username: chat.username,
    };
    console.log(body);
    const resp = await fetch(
      `http://${TRIPLAN_HOST}:${TRIPLAN_PORT}/api/telegram/update`,
      {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(resp);
  }
  return ctx.reply('whaat?');
});
bot.launch();
