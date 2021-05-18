import { bundle } from '@remotion/bundler';
import {
  getCompositions,
  renderFrames,
  stitchFramesToVideo,
} from '@remotion/renderer';
import fs from 'fs';
import os from 'os';
import path from 'path';
import youtubedl from 'youtube-dl-exec';
import minimist from 'minimist';
import slugify from 'slugify';
import axios from 'axios';
import FormData from 'form-data';
import util from 'util';
import child_process from 'child_process';
import dotenv from 'dotenv';

dotenv.config();
const exec = util.promisify(child_process.exec);
const argv = minimist(process.argv.slice(2));

run();

async function run() {
  try {
    const { youtubeUrl, from, to, text } = argv;
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

    const { id } = ytResponse;
    const filename = `${id}-${from}-${to}-${slugify(text)}.mp4`;
    const assetsPath = './src/assets';

    if (!fs.existsSync(`${assetsPath}/${filename}`)) {
      console.log("> Starting dowload and convert");
      const { url } = ytResponse.formats.find(format => format.format_note == '360p' && format.asr) || {};
      await exec(`ffmpeg -ss ${from} -i "${url}" -t ${durationInSeconds} -c copy ${assetsPath}/${filename}`);
      console.log("> Video has downloaded and converted!");
    }

    console.log("> Starting rendering video");
    const compositionId = 'Short';
    const props = {
      videoFileName: filename,
      text: argv.text
    };
    const data = { durationInFrames: durationInSeconds * 30 };
    await exec(`echo '${JSON.stringify(data)}' > ${assetsPath}/data.json`);
    const bundled = await bundle(path.join(__dirname, './src/index.tsx'));
    const comps = await getCompositions(bundled, { inputProps: props });
    const video = comps.find((c) => c.id === compositionId);
    if (!video) {
      throw new Error(`No video called ${compositionId}`);
    }

    const tmpDir = await fs.promises.mkdtemp(path.join(os.tmpdir(), 'remotion-'));

    const { assetsInfo } = await renderFrames({
      config: video,
      webpackBundle: bundled,
      onStart: () => console.log('Rendering frames...'),
      onFrameUpdate: (f) => {
        if (f % 10 === 0) {
          console.log(`Rendered frame ${f}`);
        }
      },
      parallelism: null,
      outputDir: tmpDir,
      inputProps: props,
      compositionId,
      imageFormat: 'jpeg',
    });

    const finalOutput = path.join(tmpDir, 'out.mp4');
    await stitchFramesToVideo({
      dir: tmpDir,
      force: true,
      fps: video.fps,
      height: video.height,
      width: video.width,
      outputLocation: finalOutput,
      imageFormat: 'jpeg',
      assetsInfo,
    });

    console.log('> Video rendered!');

    console.log('> Sending video via telegram');

    const url = `${process.env.TELEGRAM_API_URL}/bot${process.env.TELEGRAM_BOT_TOKEN}/sendVideo`;
    const form = new FormData();
    form.append('video', fs.createReadStream(finalOutput));
    form.append('caption', text);
    form.append('chat_id', process.env.TELEGRAM_CHAT_ID);
    const headers = form.getHeaders();
    await axios.post(url, form, { headers, maxContentLength: Infinity, maxBodyLength: Infinity });

    console.log('> Video sent!');

    process.exit(0);
  } catch (error) {
    console.log(error);
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

