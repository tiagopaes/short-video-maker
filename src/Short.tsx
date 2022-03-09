import { useVideoConfig, Video, Sequence } from 'remotion';
import { Cta } from './Cta';

export const Short: React.FC<{ videoFileName: string; text: string, cta: string | null }> = ({ videoFileName, text, cta }) => {
  const { width, height, durationInFrames } = useVideoConfig();
  const shortDuration = cta ? durationInFrames - 150 : durationInFrames;

  return (
    <div>
      <Sequence from={0} durationInFrames={shortDuration}>
        <div style={{
          display: 'flex',
          backgroundColor: '#171717',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'start',
          width,
          height,
          margin: 0,
          padding: 0
        }}>
          <div
            style={{
              fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
              fontWeight: 'bold',
              margin: '300px 30px 130px',
              color: '#fff',
              fontSize: '60px',
              textAlign: 'center'
            }}
          >{text}</div>
          <Video
            src={videoFileName == 'neto-cotonete.mp4' ? require('./assets/neto-cotonete.mp4') : (require(`./../.data/${videoFileName}`) || null)}
            startFrom={0}
            endAt={durationInFrames}
            style={{ width }}
          />

        </div>
      </Sequence>

      <Sequence from={shortDuration} durationInFrames={150}>
        <Cta videoFileName={cta} />
      </Sequence>
    </div >
  );
}
