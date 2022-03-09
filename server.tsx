import fs from 'fs';
import path from 'path';
import youtubedl from 'youtube-dl-exec';
import minimist from 'minimist';
import axios from 'axios';
import FormData from 'form-data';
import { execSync } from 'child_process';
import dotenv from 'dotenv';

dotenv.config();

const argv = minimist(process.argv.slice(2));
const { youtubeUrl, from, to, text, cta } = argv;

run();

async function run() {
  try {
    const durationInSeconds = toSeconds(from, to);
    const ytResponse = await youtubedl(youtubeUrl, {
      dumpSingleJson: true,
      noWarnings: true,
      noCallHome: true,
      noCheckCertificate: true,
      preferFreeFormats: true,
      youtubeSkipDashManifest: true,
      referer: youtubeUrl
    });
    const filename = `${Date.now()}.mp4`;
    const filePath = path.join(__dirname, `./.data/${filename}`);

    console.log("> Starting dowload and convert");
    const { url } = ytResponse.formats.filter(format => format.asr).slice(-1).pop() || {};
    const command = `ffmpeg -ss ${from} -i "${url}" -t ${durationInSeconds} -c copy ${filePath}`;
    execSync(command, { cwd: __dirname, stdio: 'inherit' });
    console.log("> Video has downloaded!");

    const props = {
      videoFileName: filename,
      text,
      durationInFrames: durationInSeconds * 30,
      cta
    };
    const buildCommand = `npm run build -- --props='${JSON.stringify(props)}'`;
    execSync(buildCommand, { cwd: __dirname, stdio: 'inherit' });

    console.log('> Sending video via telegram');

    const output = 'out.mp4';

    const telegramUrl = `${process.env.TELEGRAM_API_URL}/bot${process.env.TELEGRAM_BOT_TOKEN}/sendVideo`;
    const form = new FormData();
    form.append('video', fs.createReadStream(output));
    form.append('caption', text);
    form.append('chat_id', process.env.TELEGRAM_CHAT_ID);
    const headers = form.getHeaders();
    await axios.post(telegramUrl, form, { headers, maxContentLength: Infinity, maxBodyLength: Infinity });

    console.log('> Video sent!');
    await execSync(`rm ${filePath}`);

    process.exit(0);
  } catch (error) {
    console.log(error);
    const telegramUrl = `${process.env.TELEGRAM_API_URL}/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`;
    const form = new FormData();
    form.append('text', 'Ooops, unexpected error occurred');
    form.append('chat_id', process.env.TELEGRAM_CHAT_ID);
    const headers = form.getHeaders();
    await axios.post(telegramUrl, form, { headers, maxContentLength: Infinity, maxBodyLength: Infinity });

    process.exit(1);
  }
}

function toSeconds(start: string, end: string) {
  const [startHour, startMinutes, startSeconds] = start.split(":");
  const [startSec, startMiliseconds] = startSeconds.split(".");

  const [endHour, endMinutes, endSeconds] = end.split(":");
  const [endSec, endMiliseconds] = endSeconds.split(".");

  const startToSeconds =
    parseInt(startHour) * 60 + parseInt(startMinutes) * 60 + parseInt(startSec);

  const endToSeconds =
    parseInt(endHour) * 60 + parseInt(endMinutes) * 60 + parseInt(endSec);

  const miliseconds = Math.abs(parseInt(endMiliseconds) - parseInt(startMiliseconds));

  const toSeconds = +(parseInt(String(endToSeconds)) - parseInt(String(startToSeconds)));

  return Number(`${toSeconds}.${miliseconds}`);
}

