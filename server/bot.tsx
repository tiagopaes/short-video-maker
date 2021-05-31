import { Request, Response } from 'express';
import { Telegraf } from 'telegraf';
import util from 'util';
import child_process from 'child_process';
import dotenv from 'dotenv';

dotenv.config();
const exec = util.promisify(child_process.exec);

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN as string);

const createVideoCommand = '/createShort';

bot.command(createVideoCommand, createShortVideo);
bot.catch(errorHandler);
bot.launch();

async function createShortVideo(ctx: any) {
  const message = (ctx.message.text as string);
  const [youtubeUrl, from, to] = message
    .replace(createVideoCommand + ' ', '')
    .split(' ');
  const text = message
    .replace(createVideoCommand + ' ', '')
    .split('"')[1];
  
  ctx.reply('Starting rendering video..');

  const command = __dirname + '/../node_modules/.bin/ts-node ' + __dirname + '/build.tsx';
  exec(`${command} --youtubeUrl=${youtubeUrl} --from=${from} --to=${to} --text="${text}" --chatId=${ctx.message.chat.id}`);
}

function errorHandler(err: unknown, ctx: any) {
  console.log('[Bot] Error', err)
  ctx.reply(`Ooops, unexpected error occurred ${ctx.updateType}`, err)
}

export function webhook(req: Request, res: Response) {
  return bot.handleUpdate(req.body, res);
}
