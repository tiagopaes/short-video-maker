import { bundle } from '@remotion/bundler';
import {
  getCompositions,
  renderFrames,
  stitchFramesToVideo,
} from '@remotion/renderer';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { execSync } from 'child_process';

const compositionId = 'Short';
const props = {};

run();

async function run() {
  const bundled = await bundle(path.join(__dirname, './src/index.tsx'));
  const comps = await getCompositions(bundled, { inputProps: props });
  const video = comps.find((c) => c.id === compositionId);
  if (!video) {
    throw new Error(`No video called ${compositionId}`);
  }

  const tmpDir = await fs.promises.mkdtemp(
    path.join(os.tmpdir(), 'remotion-')
    // path.join('.', 'dist', 'remotion-')
  );

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

  console.log('Video rendered!');
}

