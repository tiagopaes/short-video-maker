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

async function createShortVideo(ctx: any) {
  const message = (ctx.message.text as string);
  const [youtubeUrl, from, to] = message
    .replace(createVideoCommand + ' ', '')
    .split(' ');
  const text = message
    .replace(createVideoCommand + ' ', '')
    .split('"')[1] || '';

  if (!validate({ youtubeUrl, from, to }, ctx)) {
    return;
  }

  ctx.reply('Starting rendering video..');

  const command = __dirname + '/../node_modules/.bin/ts-node ' + __dirname + '/build.tsx';
  exec(`${command} --youtubeUrl=${youtubeUrl} --from=${from} --to=${to} --text="${text}" --chatId=${ctx.message.chat.id}`);
}

function errorHandler(err: unknown, ctx: any) {
  console.log('[Bot] Error', err)
  ctx.reply(`Ooops, unexpected error occurred ${ctx.updateType}`, err)
}

function webhook(req: Request, res: Response) {
  return bot.handleUpdate(req.body, res);
}

function validate(parameters: any, ctx: any): boolean {
  const { youtubeUrl, from, to } = parameters;
  const example = createVideoCommand + ' https://youtu.be/FeDN06QTv2E 00:00:00.00 00:00:00.00 "my text"';

  if (!stringIsAValidUrl(String(youtubeUrl))) {
    ctx.reply(`O primeiro argumento deve ser um link para o vídeo do youtube que você quer cortar. \nExemplo: ${example}`, { disable_web_page_preview: true });
    return false;
  }

  if (!timeParamIsValid(from)) {
    ctx.reply('O argumento de tempo inicial deve estar no formato correto: 00:00:00.00', { disable_web_page_preview: true });
    return false;
  }

  if (!timeParamIsValid(to)) {
    ctx.reply('O argumento de tempo final deve estar no formato correto: 00:00:00.00', { disable_web_page_preview: true });
    return false;
  }

  return true;

  function stringIsAValidUrl(s: string): boolean {
    try {
      new URL(s);
      return true;
    } catch (err) {
      return false;
    }
  }

  function timeParamIsValid(time: string) {
    try {
      const [hour, minutes, seconds] = time.split(":");
      const [sec, miliseconds] = seconds.split(".");

      const data = [hour, minutes, sec, miliseconds];
      let result = true;
      data.forEach(item => {
        if (item.length != 2 || !/^\d+$/.test(item)) {
          result = false
        }
      });

      return result;
    } catch (error) {
      console.log(error)
      return false;
    }
  }
}

export { bot, webhook };
